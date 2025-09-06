using System.Globalization;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Drawing.Charts;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_TheKhoDuoc;

namespace sixos_soft_0401.PDFDocuments.P0401
{
    public class P0401_TheKhoDuoc_PDF : IDocument
    {
        private readonly List<M0401_TheKhoDuoc_Model> _data;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly M0401_ThongTinDoanhNghiep _thongTinDoanhNghiep;
        private const int TotalColumns = 14;

        public P0401_TheKhoDuoc_PDF(List<M0401_TheKhoDuoc_Model> data, string fromDate, string toDate, M0401_ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0401_TheKhoDuoc_Model>();
            _thongTinDoanhNghiep = doanhNghiep ?? new M0401_ThongTinDoanhNghiep
            {
                TenCSKCB = "Tên đơn vị",
                DiaChi = "",
                DienThoai = ""
            };

            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                if (_data.Any())
                {
                    _fromDate = _data.Min(x => x.NgayThangGhiSo)?.ToString("dd-MM-yyyy");
                    _toDate = _data.Max(x => x.NgayThangGhiSo)?.ToString("dd-MM-yyyy");
                }
                else
                {
                    _fromDate = DateTime.Now.ToString("dd-MM-yyyy");
                    _toDate = DateTime.Now.ToString("dd-MM-yyyy");
                }
            }
            else
            {
                _fromDate = fromDate;
                _toDate = toDate;
            }
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        private IContainer CellStyle(IContainer container)
        {
            return container
                .Border(1)
                .BorderColor(Colors.Grey.Medium)
                .PaddingVertical(3) // Reduced padding for tighter fit
                .PaddingHorizontal(2)
                .Background(Colors.White)
                .AlignMiddle()
                .DefaultTextStyle(TextStyle.Default.FontSize(7)); // Reduced font size
        }

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Portrait());
                page.Margin(20);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(7).FontColor(Colors.Black));


                page.Content()
                    .Column(column =>
                    {
                        column.Item()
                            .Row(row =>
                            {
                                row.RelativeColumn(0.59f)
                                    .Row(innerRow =>
                                    {
                                        innerRow.ConstantColumn(70)
                                            .Column(logoColumn =>
                                            {
                                                logoColumn.Item()
                                                    .Width(70)
                                                    .Height(70)
                                                    .Image("wwwroot/dist/img/logo.png", ImageScaling.FitArea);
                                            });

                                        innerRow.RelativeColumn()
                                            .PaddingLeft(2)
                                            .Column(infoColumn =>
                                            {
                                                infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "").Bold().FontSize(10);
                                                infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}").FontSize(8);
                                            });
                                    });
                                
                            });


                        column.Item().Row(r =>
                        {
                            r.ConstantColumn(0.25f);
                            r.RelativeColumn().Column(column =>
                            {
                                column.Item()
                                              .AlignCenter()
                                              .Text("THẺ KHO DƯỢC")
                                              .FontFamily("Times New Roman")
                                              .FontSize(18)
                                              .Bold()
                                              .FontColor(Colors.Blue.Darken2);

                                column.Item()
                                    .AlignCenter()
                                    .Text("Đơn vị thống kê")
                                    .FontSize(10)
                                    .FontFamily("Times New Roman");

                                column.Item()
                                     .AlignCenter()
                                     .Text(text =>
                                     {
                                         text.DefaultTextStyle(TextStyle.Default.FontSize(8));

                                         if (_fromDate == _toDate)
                                             text.Span($"Ngày: {_fromDate}");
                                         else
                                             text.Span($"Từ ngày: {_fromDate} Đến ngày: {_toDate}");
                                     });
                            });

                            r.ConstantColumn(0.25f);
                        });

                        var firstData = _data.FirstOrDefault();

                        var tenKho = firstData?.TenKho ?? "Chưa có tên kho";

                        column.Item().Row(r =>
                        {
                            r.ConstantColumn(0.25f);
                            r.RelativeColumn().Column(column =>
                            {
                                column.Item().PaddingTop(5).PaddingBottom(5).AlignLeft()
                                      .Text($"Tên kho: {tenKho}").FontSize(8).Bold();
                            });

                            r.ConstantColumn(0.25f);
                        });


                        var culture = new CultureInfo("en-US"); // Hoặc "en-US" tùy yêu cầu

                        // Giả sử bạn có list _data
                        var lastRow = _data.LastOrDefault();
                        var mainData = _data.Take(_data.Count - 1).ToList();

                        column.Item()
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);

                                });

                                table.Header(header =>
                                {
                                    void AddHeaderCell(string text, int rowspan = 1, int colspan = 1)
                                    {
                                        var cell = header.Cell();
                                        if (rowspan > 1)
                                            cell.RowSpan((uint)rowspan);
                                        if (colspan > 1)
                                            cell.ColumnSpan((uint)colspan);

                                        cell.Border(1)
                                            .Background(Colors.Grey.Lighten4)
                                            .PaddingVertical(3)
                                            .PaddingHorizontal(2)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Text(text)
                                            .Bold()
                                            .FontSize(7);
                                    }

                                    // ===== HÀNG 1 =====
                                    
                                    AddHeaderCell("Ngày tháng ghi sổ", rowspan: 2);
                                    AddHeaderCell("Chứng từ", colspan: 2); // gộp 2 cột con
                                    AddHeaderCell("Số lô", rowspan: 2);
                                    AddHeaderCell("Hạn dùng", rowspan: 2);
                                    AddHeaderCell("Diễn giải", rowspan: 2);
                                    AddHeaderCell("ĐVT", rowspan: 2);
                                    AddHeaderCell("ĐVT qui cách", rowspan: 2);
                                    AddHeaderCell("Nhập (Gốc)", rowspan: 2);
                                    AddHeaderCell("Nhập", rowspan: 2);
                                    AddHeaderCell("Xuất (Gốc)", rowspan: 2);
                                    AddHeaderCell("Xuất", rowspan: 2);
                                    AddHeaderCell("Tồn (Gốc)", rowspan: 2);
                                    AddHeaderCell("Tồn", rowspan: 2);

                                    // ===== HÀNG 2 ===== (chỉ hiển thị 2 cột con của "Chứng từ")
                                    AddHeaderCell("Số hiệu");
                                    AddHeaderCell("Ngày tháng");

                                    // Thêm dòng ngang dưới header
                                    header.Cell().ColumnSpan(14) // Gộp tất cả các cột để vẽ dòng ngang trên toàn bộ chiều rộng
                                        .BorderBottom(1) // Vẽ đường viền dưới với độ dày 1pt
                                        .BorderColor(Colors.Black); // Màu của dòng ngang
                                });

                                // Hàng đầu

                                // Thêm hàng dữ liệu động dưới dòng ngang
                                if (_data != null && _data.Any())
                                {
                                    var firstItem = _data.First(); // Lấy item đầu tiên để lấy dữ liệu động
                                    table.Cell().ColumnSpan(14) // Gộp tất cả các cột cho hàng dữ liệu
                                        .Element(cell =>
                                        {
                                            cell.Border(1) // Thêm viền cho ô dữ liệu (tùy chọn)
                                                .PaddingVertical(2)
                                                .PaddingHorizontal(2)
                                                .AlignLeft()
                                                .Text($"Tên dược: {firstItem.TenDuoc ?? ""} - Mã dược: {firstItem.MaDuoc ?? ""} - Đơn vị tính: {firstItem.DVT ?? ""}")
                                                .FontSize(7); // Cỡ chữ cho dữ liệu, có thể điều chỉnh
                                        });
                                }

                              


                                foreach (var item in mainData)
                                {
                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.NgayThangGhiSo?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(item.ChungTuSoHieu);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.ChungTuNgayThang?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.SoLo);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.HanDung?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(item.DienGiai);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.DVT);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.DVTQuiCach);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.NhapGoc ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.Nhap ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.XuatGoc ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.Xuat ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.TonGoc ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.Ton ?? 0));
       
                                }
                     });

                        // Tính tổng
                        var tongNhapGoc = _data.Sum(x => x.NhapGoc ?? 0);
                        var tongNhap = _data.Sum(x => x.Nhap ?? 0);
                        var tongXuatGoc = _data.Sum(x => x.XuatGoc ?? 0);
                        var tongXuat = _data.Sum(x => x.Xuat ?? 0);
                        var tongTonGoc = _data.Sum(x => x.TonGoc ?? 0);
                        var tongTon = _data.Sum(x => x.Ton ?? 0);

                        // Bọc Tổng cộng + Chữ ký trong cùng 1 block
                        column.Item().Element(container =>
                        {
                            container.ShowEntire().Column(block =>
                            {
                                // ===== DÒNG TỔNG CỘNG =====
                                block.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {

                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn(3);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);

                                    });

                                    // Dòng cuối
                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.NgayThangGhiSo?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(lastRow.ChungTuSoHieu);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.ChungTuNgayThang?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.SoLo);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.HanDung?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(lastRow.DienGiai);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.DVT);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.DVTQuiCach);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.NhapGoc ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.Nhap ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.XuatGoc ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.Xuat ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.TonGoc ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.Ton ?? 0));

                                    // =========================================================================

                                    // Dòng Tổng cộng

                                    table.Cell().ColumnSpan(8).Element(c => CellStyle(c))
                                        .AlignCenter().Text("TỔNG CỘNG").Bold();

                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongNhapGoc:N0}");
                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongNhap:N0}");
                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongXuatGoc:N0}");
                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongXuat:N0}");
                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongTonGoc:N0}");
                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongTon:N0}");
                                });

                                // ===== CHỮ KÝ =====
                                block.Item().PaddingTop(20).EnsureSpace(80)
                                    .Row(row =>
                                    {
                                        row.RelativeColumn()
                                            .AlignLeft()
                                            .Column(leftColumn =>
                                            {
                                                leftColumn.Item().Text("Trưởng khoa dược")
                                                    .Bold().FontSize(10);
                                                leftColumn.Item().PaddingTop(3)
                                                    .Text("(Ký, ghi rõ họ tên)")
                                                    .Italic().FontSize(9);
                                            });

                                        row.RelativeColumn()
                                            .AlignCenter()
                                            .Column(centerColumn =>
                                            {
                                                centerColumn.Item().Text("Phòng TCKT")
                                                    .Bold().FontSize(10);
                                                centerColumn.Item().PaddingTop(3)
                                                    .Text("(Ký, ghi rõ họ tên)")
                                                    .Italic().FontSize(9);
                                            });

                                        row.RelativeColumn()
                                            .AlignRight()
                                            .Column(rightColumn =>
                                            {
                                                rightColumn.Item().AlignCenter()
                                                    .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                                    .FontSize(10).Italic();

                                                rightColumn.Item().PaddingTop(5).AlignCenter()
                                                    .Text("Thống kê")
                                                    .Bold().FontSize(10);

                                                rightColumn.Item().PaddingTop(3).AlignCenter()
                                                    .Text("(Ký, ghi rõ họ tên)")
                                                    .Italic().FontSize(9);
                                            });
                                    });
                            });
                        });


                    });

                page.Footer()
                    .Row(row =>
                    {
                        // Cột bên trái: Ngày giờ in
                        row.RelativeColumn(0.5f)
                        .PaddingTop(10)
                            .AlignLeft()
                            .Text(x =>
                            {
                                x.Span($"In ngày: {DateTime.Now:dd-MM-yyyy hh:mm:ss}"); // Định dạng ngày giờ
                            });

                        // Cột bên phải: Số trang
                        row.RelativeColumn(0.5f) // Chiếm 50% chiều rộng footer
                            .PaddingTop(10)
                            .AlignRight()
                            .Text(x =>
                            {
                                x.Span("Trang ");
                                x.CurrentPageNumber();
                                x.Span(" / ");
                                x.TotalPages();
                            });
                    });

            });
        }

    }
}
