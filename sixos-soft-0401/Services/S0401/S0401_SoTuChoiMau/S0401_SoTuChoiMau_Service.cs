using ClosedXML.Excel;
using ClosedXML.Excel.Drawings;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_SoTuChoiMau;
using sixos_soft_0401.PDFDocuments.P0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_SoTuChoiMau;

namespace sixos_soft_0401.Services.S0401.S0401_SoTuChoiMau
{
    public class S0401_SoTuChoiMau_Service : I0401_SoTuChoiMau
    {
        private readonly M0401AppDbContext _context;
        private readonly ILogger<S0401_SoTuChoiMau_Service> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public S0401_SoTuChoiMau_Service(M0401AppDbContext context, ILogger<S0401_SoTuChoiMau_Service> logger, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
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

                var allData = await _context.T0401_SoTuChoiMau
                    .FromSqlRaw("EXEC S0401_SoTuChoiMau @TuNgay, @DenNgay, @IdChiNhanh",
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
                _logger.LogError(ex, "Lỗi khi lọc dữ liệu từ ngày {TuNgay} đến {DenNgay}", tuNgay, denNgay);
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

        public async Task<byte[]> ExportSoTuChoiMauPdfAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_SoTuChoiMau_Model>();
            var document = new P0401_SoTuChoiMau_PDF(data, request.FromDate, request.ToDate, doanhNghiepObj);

            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }

        public async Task<byte[]> ExportSoTuChoiMauExcelAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_SoTuChoiMau_Model>();
            var fromDate = request.FromDate;
            var toDate = request.ToDate;

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Báo cáo");

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

            // Thông tin doanh nghiệp
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
            worksheet.Range("H1:I1").Merge();
            worksheet.Cell("H1").Value = "BẢNG TỔNG KẾT XÉT NGHIỆM CỦA BỆNH NHÂN";
            worksheet.Cell("H1").Style.Font.Bold = true;
            worksheet.Cell("H1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("H1").Style.Font.FontSize = 13;
            worksheet.Cell("H1").Style.Font.FontColor = XLColor.FromHtml("#003087"); // Matches Colors.Blue.Darken2

            worksheet.Range("H2:I2").Merge();
            worksheet.Cell("H2").Value = "Đơn vị thống kê";
            worksheet.Cell("H2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("H2").Style.Font.FontSize = 11;

            worksheet.Range("H3:I4").Merge();
            worksheet.Cell("H3").Value = fromDate == toDate ? $"Ngày: {fromDate} 00:00:00" : $"Từ ngày: {fromDate} 00:00:00 Đến ngày: {toDate} 00:00:00";
            worksheet.Cell("H3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("H3").Style.Font.FontSize = 10;
            worksheet.Cell("H3").Style.Font.Bold = true;


            // Kích thước cột
            for (int i = 1; i <= 9; i++)
            {
                worksheet.Column(i).Width = 15; //
            }

            int currentRow = 6; // Start table after header content

            // Header bảng
            var headers = new[]
            {
            "STT", "Mã Y Tế","Tên bệnh nhân","Nam", "Nữ",
            "Khoa Phòng", "Người từ chối", "Thời gian từ chối", "Lý do từ chối"
            };

            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cell(currentRow, i + 1).Value = headers[i];
            }

            var headerRange = worksheet.Range(currentRow, 1, currentRow, 9);
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
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
                worksheet.Cell(currentRow, 2).Value = item.MaYTe;
                worksheet.Cell(currentRow, 3).Value = item.TenBenhNhan;
                worksheet.Cell(currentRow, 4).Value = item.Nam;
                worksheet.Cell(currentRow, 5).Value = item.Nu;
                worksheet.Cell(currentRow, 6).Value = item.KhoaPhong;
                worksheet.Cell(currentRow, 7).Value = item.NguoiTuChoi;
                if (item.ThoiGianTuChoi.HasValue)
                {
                    worksheet.Cell(currentRow, 8).Value = item.ThoiGianTuChoi.Value;
                    worksheet.Cell(currentRow, 8).Style.DateFormat.Format = "HH:mm:ss dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 8).Value = "-";
                }

                worksheet.Cell(currentRow, 9).Value = item.LyDoTuChoi;


                var dataRange = worksheet.Range(currentRow, 1, currentRow, 9);
                dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                worksheet.Cell(currentRow, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 8).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                currentRow++;
            }

            // 2. Áp dụng WrapText & Vertical Align cho toàn bảng (sau vòng lặp)
            worksheet.Range(1, 1, currentRow - 1, 9).Style.Alignment.WrapText = true;
            worksheet.Range(1, 1, currentRow - 1, 9).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            // 3. Set khoảng cách riêng cho từng cột
            worksheet.Column(1).Width = 9;   // 
            worksheet.Column(2).Width = 16;  // 
            worksheet.Column(3).Width = 30;  // Họ tên
            worksheet.Column(4).Width = 6;   // 
            worksheet.Column(5).Width = 6;   // 
            worksheet.Column(6).Width = 40;  // 
            worksheet.Column(7).Width = 30;  // 
            worksheet.Column(8).Width = 30;  // 
            worksheet.Column(9).Width = 40;  // 

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }    
}

