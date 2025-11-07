using ClosedXML.Excel;
using ClosedXML.Excel.Drawings;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DanhSachBenhNhanKhamBenh;
using sixos_soft_0401.PDFDocuments.P0401;

namespace sixos_soft_0401.Services.S0401.S0401_DanHSachBenhNhanKhamBenh
{

    public interface IS0401_DanhSachBenhNhanKhamBenh
    {
        Task<(bool Success, string Message, object Data, object DoanhNghiep, int TotalRecords, int TotalPages, int CurrentPage)>
        FilterByDayAsync(string tuNgay, string denNgay, int IDChiNhanh, int page = 1, int pageSize = 10);
        Task<byte[]> ExportDanhSachBenhNhanKhambenhPdfAsync(M0401_ExportRequest request, ISession session);

        Task<byte[]> ExportDanhSachBenhNhanKhambenhExcelAsync(M0401_ExportRequest request, ISession session);
    }
    public class S0401_DanhSachBenhNhanKhamBenh : IS0401_DanhSachBenhNhanKhamBenh
    {
        private readonly M0401AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<S0401_DanhSachBenhNhanKhamBenh> _logger;

        public S0401_DanhSachBenhNhanKhamBenh(M0401AppDbContext context, IHttpContextAccessor httpContextAccessor, ILogger<S0401_DanhSachBenhNhanKhamBenh> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task<(bool Success, string Message, object Data, object DoanhNghiep, int TotalRecords, int TotalPages, int CurrentPage)>
        FilterByDayAsync(string tuNgay, string denNgay, int IDChiNhanh, int page = 1, int pageSize = 10)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;




                var doanhNghiep = await _context.ThongTinDoanhNghiep
                    .Where(d => d.IDChiNhanh == IDChiNhanh)
                    .Select(d => new
                    {
                        d.ID,
                        d.MaCSKCB,
                        d.TenCSKCB,
                        d.DiaChi,
                        d.DienThoai,
                        d.Email
                    })
                    .FirstOrDefaultAsync();

                if (doanhNghiep == null)
                {
                    return (false, "Không tìm thấy thông tin doanh nghiệp.", null, null, 0, 0, page);
                }

                var session = _httpContextAccessor.HttpContext?.Session;
                if (session != null)
                {
                    session.SetString("DoanhNghiepInfo", JsonConvert.SerializeObject(doanhNghiep));
                }

                var allData = await _context.T0401_DanhSachBenhNhanKhamBenh
                    .FromSqlRaw("EXEC S0401_DanhSachBenhNhanKhamBenh @TuNgay, @DenNgay, @IdChiNhanh",
                        new SqlParameter("@TuNgay", tuNgay),
                        new SqlParameter("@DenNgay", denNgay),
                        new SqlParameter("@IdChiNhanh", IDChiNhanh))
                    .AsNoTracking()
                    .ToListAsync();

                var totalRecords = allData.Count;
                var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
                var pagedData = allData.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                string message = pagedData.Any()
                    ? $"Tìm thấy {totalRecords} kết quả từ {tuNgay} đến {denNgay}."
                    : $"Không tìm thấy kết quả nào từ {tuNgay} đến {denNgay}.";

                if (session != null)
                {
                    var sessionData = new
                    {
                        Data = allData,
                        FromDate = tuNgay,
                        ToDate = denNgay
                    };
                    session.SetString("FilteredData", JsonConvert.SerializeObject(sessionData));
                }

                return (true, message, pagedData, doanhNghiep, totalRecords, totalPages, page);
            }
            catch (Exception ex)
            {
                return (false, $"Có lỗi xảy ra: {ex.Message}", null, null, 0, 0, page);
            }
        }

        private M0401_ThongTinDoanhNghiep GetDoanhNghiepFromRequestOrSession(M0401_ExportRequest request, ISession session)
        {
            M0401_ThongTinDoanhNghiep doanhNghiepObj = null;
            try
            {
                if (request.DoanhNghiep != null)
                {
                    var json = JsonConvert.SerializeObject(request.DoanhNghiep);
                    doanhNghiepObj = JsonConvert.DeserializeObject<M0401_ThongTinDoanhNghiep>(json);
                }

                if (doanhNghiepObj == null)
                {
                    var doanhNghiepJson = session.GetString("DoanhNghiepInfo");
                    if (!string.IsNullOrEmpty(doanhNghiepJson))
                    {
                        doanhNghiepObj = JsonConvert.DeserializeObject<M0401_ThongTinDoanhNghiep>(doanhNghiepJson);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi parse doanh nghiep từ request hoặc session");
            }

            return doanhNghiepObj ?? new M0401_ThongTinDoanhNghiep
            {
                TenCSKCB = "Tên đơn vị",
                DiaChi = "",
                DienThoai = ""
            };
        }

        public async Task<byte[]> ExportDanhSachBenhNhanKhambenhExcelAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_DanhSachBenhNhanKhamBenh_Model>();

            var fromDate = request.FromDate;
            var toDate = request.ToDate;

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Báo cáo");

            worksheet.ShowGridLines = false;

            worksheet.Style.Font.FontName = "Times New Roman";
            worksheet.Style.Font.FontSize = 11;

            // Logo
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "dist", "img", "logo.png");
            if (File.Exists(imagePath))
            {
                var image = worksheet.AddPicture(imagePath)
                                    .MoveTo(worksheet.Cell("A1"))
                                    .WithPlacement(XLPicturePlacement.FreeFloating);
                image.Width = 70;
                image.Height = 70;
            }

            worksheet.Range("B1:F1").Merge();
            worksheet.Cell("B1").Value = doanhNghiepObj.TenCSKCB ?? "BỆNH VIỆN";
            worksheet.Cell("B1").Style.Font.Bold = true;
            worksheet.Cell("B1").Style.Font.FontSize = 13;

            worksheet.Range("B2:F2").Merge();
            worksheet.Cell("B2").Value = $"Địa chỉ: {doanhNghiepObj.DiaChi ?? ""}";
            worksheet.Cell("B2").Style.Font.FontSize = 11;

            worksheet.Range("B3:F3").Merge();
            worksheet.Cell("B3").Value = $"Điện thoại: {doanhNghiepObj.DienThoai ?? ""}";
            worksheet.Cell("B3").Style.Font.FontSize = 11;

            worksheet.Range("B4:F4").Merge();
            worksheet.Cell("B4").Value = $"Email: {doanhNghiepObj.Email ?? ""}";
            worksheet.Cell("B4").Style.Font.FontSize = 11;

            // Tiêu đề và thông tin thống kê
            worksheet.Range("H1:K3").Merge();
            worksheet.Cell("H1").Value = "DANH SÁCH BỆNH NHÂN KHÁM BỆNH";
            worksheet.Cell("H1").Style.Font.Bold = true;
            worksheet.Cell("H1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("H1").Style.Font.FontSize = 16;

            worksheet.Range("H4:K4").Merge();
            worksheet.Cell("H4").Value = fromDate == toDate ? $"Ngày: {fromDate}" : $"Từ ngày: {fromDate}  đến ngày: {toDate}";
            worksheet.Cell("H4").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("H4").Style.Font.FontSize = 11;
            worksheet.Cell("H4").Style.Font.Italic = true;


            int currentRow = 6; 

            // Header bảng
            var headers = new[]
            {
            "STT", "Mã bệnh nhân","Họ tên bệnh nhân","Năm sinh", "Giới tính",
            "Địa chỉ", "Tỉnh, Thành phố", "Quốc tịch", "Số CCCD",
            "Số BHYT", "Nơi ĐK KCB ban đầu", "Mã ĐK KCB ban đầu", "Đối tượng",
            "Ngày khám", "Tên bác sĩ khám", "Chẩn đoán", "Mã ICD",
            "Chỉ định điều trị", "Loại giá", "Chuyên khoa", "Loại tiếp nhận", "Hướng giải quyết", "Mã số vào viện"
            };

            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cell(currentRow, i + 1).Value = headers[i];
            }

            var headerRange = worksheet.Range(currentRow, 1, currentRow, 23);
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            currentRow++;

            // Dữ liệu bảng
            int stt = 1;
            foreach (var item in data)
            {
                worksheet.Cell(currentRow, 1).Value = stt++;
                worksheet.Cell(currentRow, 2).Value = item.MaBenhNhan;
                worksheet.Cell(currentRow, 3).Value = item.HoTenBenhNhan;
                worksheet.Cell(currentRow, 4).Value = item.NamSinh;
                worksheet.Cell(currentRow, 5).Value = item.GioiTinh;
                worksheet.Cell(currentRow, 6).Value = item.DiaChi;
                worksheet.Cell(currentRow, 7).Value = item.TinhThanhPho;
                worksheet.Cell(currentRow, 8).Value = item.QuocTich;
                worksheet.Cell(currentRow, 9).Value = item.SoCCCD;
                worksheet.Cell(currentRow, 10).Value = item.SoBHYT;
                worksheet.Cell(currentRow, 11).Value = item.NoiDK_KCBBD;
                worksheet.Cell(currentRow, 12).Value = item.MaDK_KCBBD;
                worksheet.Cell(currentRow, 13).Value = item.DoiTuong;
                if (item.NgayKham.HasValue)
                {
                    worksheet.Cell(currentRow, 14).Value = item.NgayKham.Value;
                    worksheet.Cell(currentRow, 14).Style.DateFormat.Format = "dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 14).Value = "-";
                }

                worksheet.Cell(currentRow, 15).Value = item.TenBacSiKham;
                worksheet.Cell(currentRow, 16).Value = item.ChanDoan;
                worksheet.Cell(currentRow, 17).Value = item.MaICD;
                worksheet.Cell(currentRow, 18).Value = item.ChiDinhDieuTri;
                worksheet.Cell(currentRow, 19).Value = item.LoaiGia;
                worksheet.Cell(currentRow, 20).Value = item.ChuyenKhoa;
                worksheet.Cell(currentRow, 21).Value = item.LoaiTiepNhan;
                worksheet.Cell(currentRow, 22).Value = item.HuongGiaiQuyet;
                worksheet.Cell(currentRow, 23).Value = item.MaSoVaoVien;


                var dataRange = worksheet.Range(currentRow, 1, currentRow, 23);
                dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                worksheet.Cell(currentRow, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(currentRow, 12).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 14).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Cell(currentRow, 23).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;


                currentRow++;
            }

            int footerRow = currentRow + 2; 
                                            
            var footerRange = worksheet.Range(footerRow, 19, footerRow, 23);
            footerRange.Merge();

            var footerCell = worksheet.Cell(footerRow, 19);
            footerCell.Value = DateTime.Now.ToString("'Ngày' dd 'tháng' MM 'năm' yyyy");
            footerCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; 
            footerCell.Style.Font.Italic = true; 
            footerCell.Style.Font.FontName = "Times New Roman"; 
            footerCell.Style.Font.FontSize = 11; 


            worksheet.Range(1, 1, currentRow - 1, 23).Style.Alignment.WrapText = true;
            worksheet.Range(1, 1, currentRow - 1, 23).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            worksheet.Column(1).Width = 9;   
            worksheet.Column(2).Width = 15;   
            worksheet.Column(3).Width = 25;  
            worksheet.Column(4).Width = 6;   
            worksheet.Column(5).Width = 6;   
            worksheet.Column(6).Width = 30; 
            worksheet.Column(7).Width = 20; 
            worksheet.Column(8).Width = 15; 
            worksheet.Column(9).Width = 15; 
            worksheet.Column(10).Width = 15;  
            worksheet.Column(11).Width = 25;  
            worksheet.Column(12).Width = 25; 
            worksheet.Column(13).Width = 15;  
            worksheet.Column(14).Width = 15;
            worksheet.Column(15).Width = 25;  
            worksheet.Column(16).Width = 25;  
            worksheet.Column(17).Width = 15; 
            worksheet.Column(18).Width = 25;  
            worksheet.Column(19).Width = 15;  
            worksheet.Column(20).Width = 25; 
            worksheet.Column(21).Width = 15; 
            worksheet.Column(22).Width = 25;
            worksheet.Column(23).Width = 15;  

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public async Task<byte[]> ExportDanhSachBenhNhanKhambenhPdfAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_DanhSachBenhNhanKhamBenh_Model>();
            var document = new P0401_DanhSachBenhNhanKhamBenh_PDF(data, request.FromDate, request.ToDate, doanhNghiepObj);

            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }

   
    }
}
