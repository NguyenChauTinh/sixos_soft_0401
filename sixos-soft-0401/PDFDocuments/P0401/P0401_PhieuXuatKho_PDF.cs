using System.Globalization;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho;

namespace sixos_soft_0401.PDFDocuments.P0401
{
    public class P0401_PhieuXuatKho_PDF : IDocument
    {
        private readonly List<M0401_PhieuXuatKho_Model> _data;
        private readonly M0401_ThongTinDoanhNghiep _thongTinDoanhNghiep;

        public P0401_PhieuXuatKho_PDF(List<M0401_PhieuXuatKho_Model> data, long idPhieuXuatKho, M0401_ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0401_PhieuXuatKho_Model>();
            _thongTinDoanhNghiep = doanhNghiep ?? new M0401_ThongTinDoanhNghiep
            {
                TenCSKCB = "Tên đơn vị",
                DiaChi = "",
                DienThoai = ""
            };

            if (idPhieuXuatKho > 0)
            {
                _data = _data
                    .Where(x => x.IdPhieuXuatKho == idPhieuXuatKho)
                    .ToList();
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
                .DefaultTextStyle(TextStyle.Default.FontSize(8)); // Reduced font size
        }

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
  
                page.DefaultTextStyle(x =>
                    x.FontFamily("Times New Roman")
                     .FontSize(8)
                     .FontColor(Colors.Black)
                );
                page.Size(PageSizes.A4.Portrait());
                page.Margin(20);
                page.PageColor(Colors.White);

                

                page.Content()
                    .Column(column =>
                    {
                        column.Item()
                            .Row(row =>
                            {
                                row.RelativeColumn(0.6f)
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
                                                infoColumn.Spacing(4);
                                                infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "").Bold().FontSize(8);
                                                infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}").FontSize(8);
                                            });
                                    });

                                row.RelativeColumn(0.4f)
                                    .Column(nationalColumn =>
                                    {
                                        nationalColumn.Spacing(4);
                                        nationalColumn.Item()
                                              .AlignCenter()
                                              .Text("Mãu sô C31 - HD")
                                              .FontSize(8)
                                              .Bold()
                                              .FontColor(Colors.Blue.Darken2);

                                        nationalColumn.Item()
                                            .AlignCenter()
                                            .Text("(Ban hành kèm theo thông tư 107/2017/TT-BTC 24/11/2017)")
                                            .FontSize(8);
                                      

                                        
                                    });


                            });

                        var firstData = _data.FirstOrDefault();


                        column.Item().Row(r =>
                        {
                            r.ConstantColumn(0.25f);
                            r.RelativeColumn().Column(column =>

                            {
                                column.Spacing(4);
                                column.Item()
                                      .AlignCenter()
                                      .Text("PHIẾU XUẤT KHO")
                                      .FontFamily("Times New Roman")
                                      .FontSize(18)
                                      .Bold();

                                column.Item()
                                     .AlignCenter()
                                     .Text(text =>
                                     {
                                         text.DefaultTextStyle(TextStyle.Default.FontSize(8));
                                         text.Span($"Ngày chứng từ: {firstData?.NgayChungTu:dd-MM-yyyy}");
                                     });

                                column.Item()
                                     .AlignCenter()
                                     .Text(text =>
                                     {
                                         text.DefaultTextStyle(TextStyle.Default.FontSize(8));
                                         text.Span($"Số chứng từ: {firstData?.SoChungTu}");
                                     });
                            });

                            r.ConstantColumn(0.25f);
                        });





                        column.Item()
                            .Row(row =>
                            {
                                row.RelativeColumn(0.6f)
                                    .PaddingBottom(10)
                                    .Row(innerRow =>
                                    {

                                        innerRow.RelativeColumn()
                                            .PaddingLeft(2)
                                            .Column(infoColumn =>
                                            {
                                                infoColumn.Spacing(4);
                                                infoColumn.Item().Text($"Họ tên người nhận hàng: {firstData?.NguoiNhanHang ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Lý do xuất: {firstData?.LyDoXuat ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Xuất tại kho: {firstData?.XuatTaiKho ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Đơn vị lĩnh: {firstData?.DonViLinh ?? ""}").FontSize(8);
                                                infoColumn.Item().Text($"Nội dung: {firstData?.NoiDung ?? ""}").FontSize(8);
                                            });
                                    });

                                row.RelativeColumn(0.4f)
                                    .PaddingLeft(18)
                                    .Column(nationalColumn =>
                                    {
                                        nationalColumn.Spacing(4);
                                        nationalColumn.Item().Text($"Địa chỉ (bộ phận): {firstData?.DiaChi ?? ""}").FontSize(8);
                                        nationalColumn.Item().Text($"Địa điểm: {firstData?.DiaDiem ?? ""}").FontSize(8);
                                    });


                            });


                        var culture = new CultureInfo("en-US"); // Hoặc "en-US" tùy yêu cầu

                        // Giả sử bạn có list _data
                        var lastRow = _data.LastOrDefault();
                        var mainData = _data.Take(_data.Count - 1).ToList();
                        int stt = 1;

                        column.Item()
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(30);   // STT
                                    columns.RelativeColumn(4);    // Tên hàng hóa
                                    columns.RelativeColumn(2);    // Mã số
                                    columns.RelativeColumn(1);    // ĐVT
                                    columns.RelativeColumn(1);    // ĐVT (QĐ)
                                    columns.RelativeColumn(1);    // Số lô
                                    columns.RelativeColumn(2);    // Hạn dùng
                                    columns.RelativeColumn(1);    // Số lượng (QĐ)
                                    columns.RelativeColumn(1);    // Yêu cầu
                                    columns.RelativeColumn(1);    // Thực xuất
                                    columns.RelativeColumn(2);    // Đơn giá
                                    columns.RelativeColumn(2);    // Thành tiền
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
                                            .BorderColor(Colors.Grey.Medium)
                                            .PaddingVertical(3)
                                            .PaddingHorizontal(2)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Text(text).Bold().FontSize(8);
                                    }

                                    // ===== HÀNG 1 =====
                                    AddHeaderCell("STT", rowspan: 2);
                                    AddHeaderCell("Tên, nhãn hiệu, quy cách, phẩm chất vật tư, dụng cụ, sản phẩm, hàng hóa", rowspan: 2);
                                    AddHeaderCell("Mã số", rowspan: 2);
                                    AddHeaderCell("ĐVT", rowspan: 2);
                                    AddHeaderCell("ĐVT (QĐ)", rowspan: 2);
                                    AddHeaderCell("Số lô", rowspan: 2);
                                    AddHeaderCell("Hạn dùng", rowspan: 2);
                                    AddHeaderCell("Số lượng (QĐ)", rowspan: 2);

                                    AddHeaderCell("Số lượng", colspan: 2); // gộp 2 cột con

                                    AddHeaderCell("Đơn giá", rowspan: 2);
                                    AddHeaderCell("Thành tiền", rowspan: 2);

                                    // ===== HÀNG 2 =====
                                    AddHeaderCell("Yêu cầu");
                                    AddHeaderCell("Thực xuất");

                                    // ===== HÀNG 3 ===== (ký hiệu A, B, C...)
                                    var symbols = new[] { "A", "B", "C", "D", "E", "F", "G", "H", "1", "2", "3", "4" };
                                    foreach (var s in symbols)
                                    {
                                        AddHeaderCell(s);
                                    }
                                });



                                foreach (var item in mainData)
                                {
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(stt++);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(item.TenHangHoa);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(item.MaSo);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.DVT);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.DVTQD);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.SoLo);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(item.HanDung?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.SoLuongQD ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.SoLuongYeuCau ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", item.SoLuongThucXuat ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N2}", item.DonGia ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N2}", item.ThanhTien ?? 0));

                                }
                            });

                        // Tính tổng
                        var tongThanhTien = _data.Sum(x => x.ThanhTien ?? 0);


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

                                        columns.ConstantColumn(30);   // STT
                                        columns.RelativeColumn(4);    // Tên hàng hóa
                                        columns.RelativeColumn(2);    // Mã số
                                        columns.RelativeColumn(1);    // ĐVT
                                        columns.RelativeColumn(1);    // ĐVT (QĐ)
                                        columns.RelativeColumn(1);    // Số lô
                                        columns.RelativeColumn(2);    // Hạn dùng
                                        columns.RelativeColumn(1);    // Số lượng (QĐ)
                                        columns.RelativeColumn(1);    // Yêu cầu
                                        columns.RelativeColumn(1);    // Thực xuất
                                        columns.RelativeColumn(2);    // Đơn giá
                                        columns.RelativeColumn(2);    // Thành tiền

                                    });

                                    // Dòng cuối
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(stt++);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(lastRow.TenHangHoa);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .Text(lastRow.MaSo);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.DVT);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.DVTQD);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.SoLo);

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignCenter().Text(lastRow.HanDung?.ToString("dd-MM-yyyy"));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.SoLuongQD ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.SoLuongYeuCau ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N0}", lastRow.SoLuongThucXuat ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N2}", lastRow.DonGia ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format("{0:N2}", lastRow.ThanhTien ?? 0));

                                    // =========================================================================

                                    // Dòng Tổng cộng

                                    table.Cell().ColumnSpan(11).Element(c => CellStyle(c))
                                        .AlignCenter().Text("TỔNG CỘNG").Bold();
                                    table.Cell().Element(c => CellStyle(c)).AlignRight().Text($"{tongThanhTien:N2}").Bold();
                                });

                                block.Item().PaddingTop(1)
                                    .Text($"Cộng khoản: {--stt} khoản.")
                                    .Italic().FontSize(8).Bold();

                                // ===== CHỮ KÝ =====
                                block.Item().PaddingTop(20).EnsureSpace(80)
                                    .Row(row =>
                                    {
                                        row.RelativeColumn()
                                            .AlignLeft()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Người lập").Bold().FontSize(8);
                                                col.Item().PaddingTop(3)
                                                    .Text("(Ký, ghi rõ họ tên)").Italic().FontSize(8);
                                            });

                                        row.RelativeColumn()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Người nhận hàng").Bold().FontSize(8);
                                                col.Item().PaddingTop(3)
                                                    .Text("(Ký, ghi rõ họ tên)").Italic().FontSize(8);
                                            });

                                        row.RelativeColumn()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Thủ kho").Bold().FontSize(10);
                                                col.Item().PaddingTop(3)
                                                    .Text("(Ký, ghi rõ họ tên)").Italic().FontSize(8);
                                            });

                                        row.RelativeColumn()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Kế toán trưởng").Bold().FontSize(8);
                                                col.Item().Text("(Hoặc phụ trách bộ phận)").Bold().FontSize(8);
                                                col.Item().PaddingTop(3)
                                                    .Text("(Ký, ghi rõ họ tên)").Italic().FontSize(8);
                                            });

                                        row.RelativeColumn()
                                            .AlignRight()
                                            .Column(col =>
                                            {
                                                col.Item().AlignCenter()
                                                    .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                                    .FontSize(8).Italic();

                                                col.Item().PaddingTop(5).AlignCenter()
                                                    .Text("Thủ trưởng đơn vị").Bold().FontSize(8);

                                                col.Item().PaddingTop(3).AlignCenter()
                                                    .Text("(Ký, ghi rõ họ tên)").Italic().FontSize(8);
                                            });
                                    });

                            });
                        });


                    });

                page.Footer()
                    .Row(row =>
                    {


                        row.RelativeColumn(0.5f)
                        .PaddingTop(10)
                            .AlignLeft()
                            .Text(x =>
                            {
                                x.Span($"{DateTime.Now:dd-MM-yyyy hh:mm:ss}");
                            });


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
