using ClosedXML.Excel;
using ClosedXML.Excel.Drawings;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_TheKhoDuoc;
using sixos_soft_0401.PDFDocuments.P0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_TheKhoDuoc;
using sixos_soft_0401.Services.S0401.S0401_TheKhoDuoc;

namespace sixos_soft_0401.Services.S0401.S0401_TheKhoDuoc
{
    public class S0401_TheKhoDuoc_Service : I0401_TheKhoDuoc
    {
        private readonly M0401AppDbContext _context;
        private readonly ILogger<S0401_TheKhoDuoc_Service> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public S0401_TheKhoDuoc_Service(M0401AppDbContext context, ILogger<S0401_TheKhoDuoc_Service> logger, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<(bool Success, string Message, object Data, object DoanhNghiep, int TotalRecords, int TotalPages, int CurrentPage)>
        FilterByDayAsync(string tuNgay, string denNgay, int IDChiNhanh, int IDKho, int page = 1, int pageSize = 10)
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

                var allData = await _context.T0401_TheKhoDuoc
                    .FromSqlRaw("EXEC S0401_TheKHoDuoc @TuNgay, @DenNgay, @IdChiNhanh, @IdKho",
                        new SqlParameter("@TuNgay", tuNgay),
                        new SqlParameter("@DenNgay", denNgay),
                        new SqlParameter("@IdChiNhanh", IDChiNhanh),
                        new SqlParameter("@IdKho", IDKho))
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
        public async Task<byte[]> ExportTheKhoDuocPdfAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_TheKhoDuoc_Model>();
            var document = new P0401_TheKhoDuoc_PDF(data, request.FromDate, request.ToDate, doanhNghiepObj);

            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }

        public async Task<byte[]> ExportTheKhoDuocExcelAsync(M0401_ExportRequest request, ISession session)
        {
            var doanhNghiepObj = GetDoanhNghiepFromRequestOrSession(request, session);

            var data = request.Data ?? new List<M0401_TheKhoDuoc_Model>();
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
            worksheet.Range("B1:E1").Merge();
            worksheet.Cell("B1").Value = doanhNghiepObj.TenCSKCB ?? "BỆNH VIỆN";
            worksheet.Cell("B1").Style.Font.Bold = true;
            worksheet.Cell("B1").Style.Font.FontSize = 13;

            worksheet.Range("B2:E2").Merge();
            worksheet.Cell("B2").Value = $"Địa chỉ: {doanhNghiepObj.DiaChi ?? ""}";
            worksheet.Cell("B2").Style.Font.FontSize = 11;

            worksheet.Range("B3:E3").Merge();
            worksheet.Cell("B3").Value = $"Điện thoại: {doanhNghiepObj.DienThoai ?? ""}";
            worksheet.Cell("B3").Style.Font.FontSize = 11;

            worksheet.Range("B4:E4").Merge();
            worksheet.Cell("B4").Value = $"Email: {doanhNghiepObj.Email ?? ""}";
            worksheet.Cell("B4").Style.Font.FontSize = 11;

            // Tiêu đề và thông tin thống kê
            worksheet.Range("F1:J1").Merge();
            worksheet.Cell("F1").Value = "THẺ KHO DƯỢC";
            worksheet.Cell("F1").Style.Font.Bold = true;
            worksheet.Cell("F1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("F1").Style.Font.FontSize = 18;
            worksheet.Cell("F1").Style.Font.FontColor = XLColor.FromHtml("#003087"); // Matches Colors.Blue.Darken2

            worksheet.Range("F2:J2").Merge();
            worksheet.Cell("F2").Value = "Đơn vị thống kê";
            worksheet.Cell("F2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("F2").Style.Font.FontSize = 11;

            worksheet.Range("F3:J3").Merge();
            worksheet.Cell("F3").Value = fromDate == toDate ? $"Ngày: {fromDate}" : $"Từ ngày: {fromDate} Đến ngày: {toDate}";
            worksheet.Cell("F3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Căn giữa
            worksheet.Cell("F3").Style.Font.FontSize = 10;
            worksheet.Cell("F3").Style.Font.Bold = true;


            worksheet.Range("A8:E8").Merge();
            worksheet.Cell("A8").Value = $"Tên kho: Kho nội tuyến vú tiêu hóa A";
            worksheet.Cell("A8").Style.Font.FontSize = 11;

            // Kích thước cột
            for (int i = 1; i <= 9; i++)
            {
                worksheet.Column(i).Width = 14; //
            }

            int currentRow = 9; // bắt đầu từ dòng 10

            // Hàng 1 của header
            worksheet.Cell(currentRow, 1).Value = "Ngày tháng ghi sổ";
            worksheet.Range(currentRow, 1, currentRow + 1, 1).Merge(); // merge 2 dòng

            worksheet.Cell(currentRow, 2).Value = "Chứng từ";
            worksheet.Range(currentRow, 2, currentRow, 3).Merge(); // merge ngang (cột 2 -> 3)

            worksheet.Cell(currentRow, 4).Value = "Số lô";
            worksheet.Range(currentRow, 4, currentRow + 1, 4).Merge();

            worksheet.Cell(currentRow, 5).Value = "Hạn dùng";
            worksheet.Range(currentRow, 5, currentRow + 1, 5).Merge();

            worksheet.Cell(currentRow, 6).Value = "Diễn giải";
            worksheet.Range(currentRow, 6, currentRow + 1, 6).Merge();

            worksheet.Cell(currentRow, 7).Value = "ĐVT";
            worksheet.Range(currentRow, 7, currentRow + 1, 7).Merge();

            worksheet.Cell(currentRow, 8).Value = "ĐVT qui cách";
            worksheet.Range(currentRow, 8, currentRow + 1, 8).Merge();

            worksheet.Cell(currentRow, 9).Value = "Nhập (Gốc)";
            worksheet.Range(currentRow, 9, currentRow + 1, 9).Merge();

            worksheet.Cell(currentRow, 10).Value = "Nhập";
            worksheet.Range(currentRow, 10, currentRow + 1, 10).Merge();

            worksheet.Cell(currentRow, 11).Value = "Xuất (Gốc)";
            worksheet.Range(currentRow, 11, currentRow + 1, 11).Merge();

            worksheet.Cell(currentRow, 12).Value = "Xuất";
            worksheet.Range(currentRow, 12, currentRow + 1, 12).Merge();

            worksheet.Cell(currentRow, 13).Value = "Tồn (Gốc)";
            worksheet.Range(currentRow, 13, currentRow + 1, 13).Merge();

            worksheet.Cell(currentRow, 14).Value = "Tồn";
            worksheet.Range(currentRow, 14, currentRow + 1, 14).Merge();

            // Hàng 2 của header (các ô con)
            worksheet.Cell(currentRow + 1, 2).Value = "Số hiệu";
            worksheet.Cell(currentRow + 1, 3).Value = "Ngày tháng";

            // Style chung cho toàn bộ header
            var headerRange = worksheet.Range(currentRow, 1, currentRow + 1, 14);
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            currentRow += 2; // Sau header thì dữ liệu bắt đầu từ dòng 10



            var firstItem = data.FirstOrDefault();
            // Merge từ cột 1 (A) đến cột 14 (N) ở dòng currentRow
            var range = worksheet.Range(currentRow, 1, currentRow, 14);
            range.Merge();
            if (firstItem != null)
            {
                var cell = worksheet.Cell(currentRow, 1);
                worksheet.Range(currentRow, 1, currentRow, 14).Merge();

                var richText = cell.GetRichText();
                richText.ClearText();

                richText.AddText("Tên dược: ").SetFontColor(XLColor.Red).SetBold();
                richText.AddText(firstItem.TenDuoc + "   ");

                richText.AddText("Mã dược: ").SetFontColor(XLColor.Green).SetBold();
                richText.AddText(firstItem.MaDuoc + "   ");

                richText.AddText("Đơn vị tính: ").SetFontColor(XLColor.Red).SetBold();
                richText.AddText(firstItem.DVT);

                // Canh lề
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

                // Tự động xuống dòng nếu quá dài
                worksheet.Row(currentRow).AdjustToContents();

            }


            currentRow++;
            int startDataRow = currentRow;

            // Dữ liệu bảng
            int stt = 1;
            foreach (var item in data)
            {

                if (item.NgayThangGhiSo.HasValue)
                {
                    worksheet.Cell(currentRow, 1).Value = item.NgayThangGhiSo.Value;
                    worksheet.Cell(currentRow, 1).Style.DateFormat.Format = "dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 1).Value = "-";
                }
                worksheet.Cell(currentRow, 2).Value = item.ChungTuSoHieu;
                if (item.ChungTuNgayThang.HasValue)
                {
                    worksheet.Cell(currentRow, 3).Value = item.ChungTuNgayThang.Value;
                    worksheet.Cell(currentRow, 3).Style.DateFormat.Format = "dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 3).Value = "-";
                }
                worksheet.Cell(currentRow, 4).Value = item.SoLo;
                if (item.HanDung.HasValue)
                {
                    worksheet.Cell(currentRow, 5).Value = item.HanDung.Value;
                    worksheet.Cell(currentRow, 5).Style.DateFormat.Format = "dd-MM-yyyy";
                }
                else
                {
                    worksheet.Cell(currentRow, 5).Value = "-";
                }
                worksheet.Cell(currentRow, 6).Value = item.DienGiai;
                worksheet.Cell(currentRow, 7).Value = item.DVT;
                worksheet.Cell(currentRow, 8).Value = item.DVTQuiCach;

                worksheet.Cell(currentRow, 9).Value = item.NhapGoc;
                worksheet.Cell(currentRow, 9).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 10).Value = item.Nhap;
                worksheet.Cell(currentRow, 10).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 11).Value = item.XuatGoc;
                worksheet.Cell(currentRow, 11).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 12).Value = item.Xuat;
                worksheet.Cell(currentRow, 12).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 13).Value = item.TonGoc;
                worksheet.Cell(currentRow, 13).Style.NumberFormat.Format = "#,##0";

                worksheet.Cell(currentRow, 14).Value = item.Ton;
                worksheet.Cell(currentRow, 14).Style.NumberFormat.Format = "#,##0";


                var dataRange = worksheet.Range(currentRow, 1, currentRow, 14);
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

                worksheet.Cell(currentRow, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 10).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 11).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 12).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 13).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 14).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;


                currentRow++;
            }

            // 2. Áp dụng WrapText & Vertical Align cho toàn bảng (sau vòng lặp)
            worksheet.Range(1, 1, currentRow - 1, 14).Style.Alignment.WrapText = true;
            worksheet.Range(1, 1, currentRow - 1, 14).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            // 3. Set khoảng cách riêng cho từng cột
            worksheet.Column(1).Width = 17;   // 
            worksheet.Column(2).Width = 26;  // 
            worksheet.Column(3).Width = 17;  // 
            worksheet.Column(4).Width = 12;   // 
            worksheet.Column(5).Width = 17;   // 
            worksheet.Column(6).Width = 40;  // 
            worksheet.Column(7).Width = 16;  // 
            worksheet.Column(8).Width = 16;  // 
            worksheet.Column(9).Width = 16;  // 
            worksheet.Column(10).Width = 16;  // 
            worksheet.Column(11).Width = 16;  // 
            worksheet.Column(12).Width = 16;  // 
            worksheet.Column(13).Width = 16;  // 
            worksheet.Column(14).Width = 16;  // 

            // Sau khi render hết dữ liệu xong
            // currentRow lúc này đã ở dòng tiếp theo sau dữ liệu

            int totalRow = currentRow;

            // Merge từ cột 1 -> 11 (tùy bạn muốn gộp tới đâu)
            worksheet.Range(totalRow, 1, totalRow, 8).Merge();
            worksheet.Cell(totalRow, 1).Value = "TỔNG CỘNG";
            worksheet.Cell(totalRow, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Cell(totalRow, 1).Style.Font.Bold = true;

            // Tính tổng cho các cột số liệu
            worksheet.Cell(totalRow, 9).FormulaA1 = $"=SUM(I{startDataRow}:I{totalRow - 1})"; 
            worksheet.Cell(totalRow, 10).FormulaA1 = $"=SUM(J{startDataRow}:J{totalRow - 1})"; 
            worksheet.Cell(totalRow, 11).FormulaA1 = $"=SUM(K{startDataRow}:K{totalRow - 1})"; 
            worksheet.Cell(totalRow, 12).FormulaA1 = $"=SUM(L{startDataRow}:L{totalRow - 1})"; 
            worksheet.Cell(totalRow, 13).FormulaA1 = $"=SUM(M{startDataRow}:M{totalRow - 1})";
            worksheet.Cell(totalRow, 14).FormulaA1 = $"=SUM(N{startDataRow}:N{totalRow - 1})"; 

            // Style cho dòng tổng
            var totalRange = worksheet.Range(totalRow, 1, totalRow, 14);
            totalRange.Style.Font.Bold = true;
            totalRange.Style.Fill.BackgroundColor = XLColor.LightGray;
            totalRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            totalRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;


            int lastRow = currentRow + 4;
            int totalCols = 14; // tổng số cột của bảng
            int colsPerSection = totalCols / 3;

            // ===== Cột 1: Người lập phiếu =====
            var range1 = worksheet.Range(lastRow, 1, lastRow, colsPerSection);
            range1.Merge();
            var cell1 = range1.FirstCell();
            cell1.Value = "Trưởng khoa dược";
            cell1.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell1.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            cell1.Style.Font.Bold = true;

            // Dòng ghi chú dưới
            var range1Note = worksheet.Range(lastRow + 1, 1, lastRow + 1, colsPerSection);
            range1Note.Merge();
            range1Note.FirstCell().Value = "(Ký, ghi rõ họ tên)";
            range1Note.FirstCell().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // ===== Cột 2: Kế toán =====
            var range2 = worksheet.Range(lastRow, colsPerSection + 1, lastRow, colsPerSection * 2);
            range2.Merge();
            var cell2 = range2.FirstCell();
            cell2.Value = "Phòng TCKT";
            cell2.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell2.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            cell2.Style.Font.Bold = true;

            // Dòng ghi chú dưới
            var range2Note = worksheet.Range(lastRow + 1, colsPerSection + 1, lastRow + 1, colsPerSection * 2);
            range2Note.Merge();
            range2Note.FirstCell().Value = "(Ký, ghi rõ họ tên)";
            range2Note.FirstCell().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // ===== Cột 3: Thủ trưởng đơn vị =====
            // Dòng ngày tháng phía trên
            // Dòng ngày tháng phía trên cột Thủ trưởng đơn vị
            string ngayThangNam = $"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}";

            var range3Date = worksheet.Range(lastRow - 1, colsPerSection * 2 + 1, lastRow - 1, totalCols);
            range3Date.Merge();
            range3Date.FirstCell().Value = ngayThangNam;
            range3Date.FirstCell().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;


            // Tiêu đề chính
            var range3 = worksheet.Range(lastRow, colsPerSection * 2 + 1, lastRow, totalCols);
            range3.Merge();
            var cell3 = range3.FirstCell();
            cell3.Value = "Thống kê";
            cell3.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell3.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            cell3.Style.Font.Bold = true;

            // Dòng ghi chú dưới
            var range3Note = worksheet.Range(lastRow + 1, colsPerSection * 2 + 1, lastRow + 1, totalCols);
            range3Note.Merge();
            range3Note.FirstCell().Value = "(Ký, ghi rõ họ tên)";
            range3Note.FirstCell().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // Tăng chiều cao cho 3 dòng này để có chỗ ký tên
            worksheet.Row(lastRow).Height = 25;
            worksheet.Row(lastRow + 1).Height = 20;
            worksheet.Row(lastRow - 1).Height = 20;



            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
