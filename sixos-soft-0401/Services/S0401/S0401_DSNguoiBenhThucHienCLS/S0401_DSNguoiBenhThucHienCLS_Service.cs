using System.Collections.Generic;
using System.Threading.Tasks;
using ClosedXML.Excel;
using ClosedXML.Excel.Drawings;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.PDFDocuments.P0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_DSNguoiBenhThucHienCLS;

namespace sixos_soft_0401.Services.S0401.S0401_DSNguoiBenhThucHienCLS
{
    public class S0401_DSNguoiBenhThucHienCLS : I0401_DSNguoiBenhThucHienCLS
    {
        private readonly M0401AppDbContext _context;
        private readonly ILogger<S0401_DSNguoiBenhThucHienCLS> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public S0401_DSNguoiBenhThucHienCLS(M0401AppDbContext context, ILogger<S0401_DSNguoiBenhThucHienCLS> logger, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<(bool Success, string Message, object Data, object DoanhNghiep, int TotalRecords, int TotalPages, int CurrentPage)>
        
            FilterByDayAsync(string tuNgay, string denNgay, int IDChiNhanh, int page = 1, int pageSize = 10)
        {
            var doanhNghiep = await _context.ThongTinDoanhNghieps
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

            var session = _httpContextAccessor.HttpContext?.Session;
            session?.SetString("DoanhNghiepInfo", JsonConvert.SerializeObject(doanhNghiep));
            _logger.LogInformation("Doanh Nghiep Info: {@DoanhNghiep}", doanhNghiep);

            if (doanhNghiep == null)
            {
                _logger.LogWarning("No doanh nghiep found for ChiNhanh ID: {IdChiNhanh}", IDChiNhanh);
                return (false, "Không tìm thấy thông tin doanh nghiệp.", null, null, 0, 0, page);
            }

            var allData = await _context.T0401_DSNguoiBenhThucHienCLS
                .FromSqlRaw("EXEC S0301_ThongKeBenhNhanDKKhamVip @TuNgay, @DenNgay, @IdChiNhanh",
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

            var sessionData = new
            {
                Data = allData,
                FromDate = tuNgay,
                ToDate = denNgay
            };
            session?.SetString("FilteredData", JsonConvert.SerializeObject(sessionData));

            return (true, message, pagedData, doanhNghiep, totalRecords, totalPages, page);
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

        public async Task<byte[]> ExportDSNguoiBenhThucHienCLSPdfAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_DSNguoiBenhThucHienCLS_Model>();
            var document = new P0401_DSNguoiBenhThucHienCLS_PDF(data, request.FromDate, request.ToDate, doanhNghiepObj);

            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }

        public async Task<byte[]> ExportDSNguoiBenhThucHienCLSExcelAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_DSNguoiBenhThucHienCLS_Model>();
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
            worksheet.Cell("B1").Value = doanhNghiepObj.TenCSKCB ?? "BỆNH VIỆN";
            worksheet.Cell("B1").Style.Font.Bold = true;
            worksheet.Cell("B1").Style.Font.FontSize = 13;

            worksheet.Cell("B2").Value = $"Địa chỉ: {doanhNghiepObj.DiaChi ?? ""}";
            worksheet.Cell("B2").Style.Font.FontSize = 11;

            worksheet.Cell("B3").Value = $"Điện thoại: {doanhNghiepObj.DienThoai ?? ""}";
            worksheet.Cell("B3").Style.Font.FontSize = 11;

            worksheet.Cell("B4").Value = $"Email: {doanhNghiepObj.Email ?? ""}";
            worksheet.Cell("B4").Style.Font.FontSize = 11;

            // Tiêu đề và thông tin thống kê
            worksheet.Range("I1:M1").Merge();
            worksheet.Cell("I1").Value = "DANH SÁCH NGƯỜI BỆNH THỰC HIỆN CHUẨN LÂM SÀNG";
            worksheet.Cell("I1").Style.Font.Bold = true;
            worksheet.Cell("I1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell("I1").Style.Font.FontSize = 13;
            worksheet.Cell("I1").Style.Font.FontColor = XLColor.FromHtml("#003087"); // Matches Colors.Blue.Darken2

            worksheet.Range("I2:M2").Merge();
            worksheet.Cell("I2").Value = "Đơn vị thống kê";
            worksheet.Cell("I2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell("I2").Style.Font.FontSize = 11;

            worksheet.Range("I3:M3").Merge();
            worksheet.Cell("I3").Value = fromDate == toDate ? $"Ngày: {fromDate}" : $"Từ ngày: {fromDate} đến ngày: {toDate}";
            worksheet.Cell("I3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            worksheet.Cell("I3").Style.Font.FontSize = 10;
            worksheet.Cell("I3").Style.Font.Bold = true;

            // Kích thước cột
            for (int i = 1; i <= 24; i++)
            {
                worksheet.Column(i).Width = 15; // Adjust width for 24 columns
            }

            int currentRow = 6; // Start table after header content

            // Header bảng
            var headers = new[]
            {
        "STT", "Mã người bệnh", "Số vào viện", "Mã số đợt", "ICD", "Họ tên", "NS", "GT",
        "Số thẻ BHYT", "KCB BĐ", "Đối tượng", "Nơi chỉ định", "Bác sĩ", "Dịch vụ",
        "Số lượng", "Ngày yêu cầu", "Ngày thực hiện", "Quyển", "Số HĐ", "Số chứng từ",
        "Thiết bị", "Doanh thu", "Bảo hiểm", "Đã thanh toán"
    };

            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cell(currentRow, i + 1).Value = headers[i];
            }

            var headerRange = worksheet.Range(currentRow, 1, currentRow, 24);
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
                worksheet.Cell(currentRow, 2).Value = item.MaNguoiBenh;
                worksheet.Cell(currentRow, 3).Value = item.SoVaoVien;
                worksheet.Cell(currentRow, 4).Value = item.MaSoDot;
                worksheet.Cell(currentRow, 5).Value = item.ICD;
                worksheet.Cell(currentRow, 6).Value = item.HoTen;
                worksheet.Cell(currentRow, 7).Value = item.NamSinh;
                worksheet.Cell(currentRow, 8).Value = item.GioiTinh;
                worksheet.Cell(currentRow, 9).Value = item.SoTheBHYT;
                worksheet.Cell(currentRow, 10).Value = item.KCB_BD;
                worksheet.Cell(currentRow, 11).Value = item.DoiTuong;
                worksheet.Cell(currentRow, 12).Value = item.NoiChiDinh;
                worksheet.Cell(currentRow, 13).Value = item.BacSi;
                worksheet.Cell(currentRow, 14).Value = item.DichVu;
                worksheet.Cell(currentRow, 15).Value = item.SoLuong;
                worksheet.Cell(currentRow, 16).Value = item.NgayYeuCau.ToString("dd-MM-yyyy");
                worksheet.Cell(currentRow, 17).Value = item.NgayThucHien.ToString("dd-MM-yyyy");
                worksheet.Cell(currentRow, 18).Value = item.Quyen;
                worksheet.Cell(currentRow, 19).Value = item.SoHD;
                worksheet.Cell(currentRow, 20).Value = item.SoChungTu;
                worksheet.Cell(currentRow, 21).Value = item.ThietBi;
                worksheet.Cell(currentRow, 22).Value = item.DoanhThu;
                worksheet.Cell(currentRow, 23).Value = item.BaoHiem;
                worksheet.Cell(currentRow, 24).Value = item.DaThanhToan;

                var dataRange = worksheet.Range(currentRow, 1, currentRow, 24);
                dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                worksheet.Cell(currentRow, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 8).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 16).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 17).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                currentRow++;
            }

            // Footer
            currentRow += 2;
            worksheet.Range(currentRow, 20, currentRow, 24).Merge();
            worksheet.Cell(currentRow, 20).Value = $"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}";
            worksheet.Cell(currentRow, 20).Style.Font.FontSize = 11;
            worksheet.Cell(currentRow, 20).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

            currentRow++;
            worksheet.Range(currentRow, 20, currentRow, 24).Merge();
            worksheet.Cell(currentRow, 20).Value = "Người xác nhận";
            worksheet.Cell(currentRow, 20).Style.Font.FontSize = 11;
            worksheet.Cell(currentRow, 20).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 20).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

            currentRow++;
            worksheet.Range(currentRow, 20, currentRow, 24).Merge();
            worksheet.Cell(currentRow, 20).Value = "(Ký, ghi rõ họ tên)";
            worksheet.Cell(currentRow, 20).Style.Font.FontSize = 11;
            worksheet.Cell(currentRow, 20).Style.Font.Italic = true;
            worksheet.Cell(currentRow, 20).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }



    }
}
