using ClosedXML.Excel;
using ClosedXML.Excel.Drawings;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.PDFDocuments.P0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_DSNguoiBenhThucHienCLS;
using System.Collections.Generic;
using System.Threading.Tasks;

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

                var allData = await _context.T0401_DSNguoiBenhThucHienCLS
                    .FromSqlRaw("EXEC S0401_DSNguoiBenhThucHienCLS @TuNgay, @DenNgay, @IdChiNhanh",
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
            worksheet.Range("B1:G1").Merge();
            worksheet.Cell("B1").Value = doanhNghiepObj.TenCSKCB ?? "BỆNH VIỆN";
            worksheet.Cell("B1").Style.Font.Bold = true;
            worksheet.Cell("B1").Style.Font.FontSize = 13;

            worksheet.Range("B2:G2").Merge();
            worksheet.Cell("B2").Value = $"Địa chỉ: {doanhNghiepObj.DiaChi ?? ""}";
            worksheet.Cell("B2").Style.Font.FontSize = 11;

            worksheet.Range("B3:G3").Merge();
            worksheet.Cell("B3").Value = $"Điện thoại: {doanhNghiepObj.DienThoai ?? ""}";
            worksheet.Cell("B3").Style.Font.FontSize = 11;

            worksheet.Range("B4:G4").Merge();
            worksheet.Cell("B4").Value = $"Email: {doanhNghiepObj.Email ?? ""}";
            worksheet.Cell("B4").Style.Font.FontSize = 11;

            // Tiêu đề và thông tin thống kê
            worksheet.Range("I1:M1").Merge();
            worksheet.Cell("I1").Value = "DANH SÁCH NGƯỜI BỆNH THỰC HIỆN CHUẨN LÂM SÀNG";
            worksheet.Cell("I1").Style.Font.Bold = true;
            worksheet.Cell("I1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("I1").Style.Font.FontSize = 13;
            worksheet.Cell("I1").Style.Font.FontColor = XLColor.FromHtml("#003087"); // Matches Colors.Blue.Darken2

            worksheet.Range("I2:M2").Merge();
            worksheet.Cell("I2").Value = "Đơn vị thống kê";
            worksheet.Cell("I2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("I2").Style.Font.FontSize = 11;

            worksheet.Range("I3:M3").Merge();
            worksheet.Cell("I3").Value = fromDate == toDate ? $"Ngày: {fromDate}" : $"Từ ngày: {fromDate} đến ngày: {toDate}";
            worksheet.Cell("I3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
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

                Console.WriteLine($"Processing row {currentRow}: NgayYeuCau = {item.NgayYeuCau}, NgayThucHien = {item.NgayThucHien}");

                if (item.NgayYeuCau.HasValue)
                {
                    worksheet.Cell(currentRow, 16).Value = item.NgayYeuCau.Value;
                    worksheet.Cell(currentRow, 16).Style.DateFormat.Format = "HH:mm:ss dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 16).Value = "-";
                }
                
                if (item.NgayThucHien.HasValue)
                {
                    worksheet.Cell(currentRow, 17).Value = item.NgayThucHien.Value;
                    worksheet.Cell(currentRow, 17).Style.DateFormat.Format = "HH:mm:ss dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 16).Style.DateFormat.Format = "dd-MM-yyyy HH:mm:ss";

                    worksheet.Cell(currentRow, 17).Value = "-";
                }
                worksheet.Cell(currentRow, 18).Value = item.Quyen;
                worksheet.Cell(currentRow, 19).Value = item.SoHD;
                worksheet.Cell(currentRow, 20).Value = item.SoChungTu;
                worksheet.Cell(currentRow, 21).Value = item.ThietBi;
                worksheet.Cell(currentRow, 22).Value = item.DoanhThu;
                worksheet.Cell(currentRow, 22).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 23).Value = item.BaoHiem;
                worksheet.Cell(currentRow, 23).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 24).Value = item.DaThanhToan;
                worksheet.Cell(currentRow, 24).Style.NumberFormat.Format = "#,##0";


                var dataRange = worksheet.Range(currentRow, 1, currentRow, 24);
                dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                worksheet.Cell(currentRow, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 7).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 8).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 10).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 15).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 16).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 17).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 22).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 23).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 24).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                currentRow++;
            }

            // 2. Áp dụng WrapText & Vertical Align cho toàn bảng (sau vòng lặp)
            worksheet.Range(1, 1, currentRow - 1, 24).Style.Alignment.WrapText = true;
            worksheet.Range(1, 1, currentRow - 1, 24).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            // 3. Set khoảng cách riêng cho từng cột
            worksheet.Column(1).Width = 9;   // STT
            worksheet.Column(2).Width = 16;  // Mã người bệnh
            worksheet.Column(3).Width = 12;  // Số vào viện
            worksheet.Column(4).Width = 12;  // Mã số đợt
            worksheet.Column(5).Width = 10;  // ICD
            worksheet.Column(6).Width = 30;  // Họ tên
            worksheet.Column(7).Width = 6;   // NS
            worksheet.Column(8).Width = 6;   // GT
            worksheet.Column(9).Width = 20;  // Số thẻ BHYT
            worksheet.Column(10).Width = 10; // KCB BĐ
            worksheet.Column(11).Width = 20; // Đối tượng
            worksheet.Column(12).Width = 28; // Nơi chỉ định
            worksheet.Column(13).Width = 26; // Bác sĩ
            worksheet.Column(14).Width = 18; // Dịch vụ
            worksheet.Column(15).Width = 10; // Số lượng
            worksheet.Column(16).Width = 20; // Ngày yêu cầu
            worksheet.Column(17).Width = 20; // Ngày thực hiện
            worksheet.Column(18).Width = 15; // Quyển
            worksheet.Column(19).Width = 15; // Số HĐ
            worksheet.Column(20).Width = 12; // Số chứng từ
            worksheet.Column(21).Width = 24; // Thiết bị
            worksheet.Column(22).Width = 15; // Doanh thu
            worksheet.Column(23).Width = 15; // Bảo hiểm
            worksheet.Column(24).Width = 15; // Đã thanh toán

            // Footer
            currentRow += 2;
            worksheet.Range(currentRow, 22, currentRow, 24).Merge();
            worksheet.Cell(currentRow, 22).Value = $"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}";
            worksheet.Cell(currentRow, 22).Style.Font.FontSize = 11;
            worksheet.Cell(currentRow, 22).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            currentRow++;
            worksheet.Range(currentRow, 22, currentRow, 24).Merge();
            worksheet.Cell(currentRow, 22).Value = "Người xác nhận";
            worksheet.Cell(currentRow, 22).Style.Font.FontSize = 11;
            worksheet.Cell(currentRow, 22).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 22).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            currentRow++;
            worksheet.Range(currentRow, 22, currentRow, 24).Merge();
            worksheet.Cell(currentRow, 22).Value = "(Ký, ghi rõ họ tên)";
            worksheet.Cell(currentRow, 22).Style.Font.FontSize = 11;
            worksheet.Cell(currentRow, 22).Style.Font.Italic = true;
            worksheet.Cell(currentRow, 22).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }



    }
}
