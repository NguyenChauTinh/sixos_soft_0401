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
                .DefaultTextStyle(TextStyle.Default.FontSize(10)); // Reduced font size
        }

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
  
                page.DefaultTextStyle(x =>
                    x.FontFamily("Times New Roman")
                     .FontSize(10)
                     .FontColor(Colors.Black)
                );
                page.Size(PageSizes.A4.Landscape());
                page.Margin(20);
                page.PageColor(Colors.White);

                

                page.Content()
                    .Column(column =>
                    {
                        column.Item()
                            .Row(row =>
                            {
                                row.RelativeItem(0.6f)
                                    .Row(innerRow =>
                                    {
                                        innerRow.ConstantItem(70)
                                            .Column(logoColumn =>
                                            {
                                                logoColumn.Item()
                                                    .Width(70)
                                                    .Height(70)
                                                    .Image("wwwroot/dist/img/logo.png", ImageScaling.FitArea);
                                            });

                                        innerRow.RelativeItem()
                                            .PaddingLeft(2)
                                            .Column(infoColumn =>
                                            {
                                                infoColumn.Spacing(4);
                                                infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "").Bold().FontSize(10);
                                                infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}").FontSize(10);
                                                infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}").FontSize(10);
                                                infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}").FontSize(10);
                                                infoColumn.Item().Text("Mã QHNS:").FontSize(10);
                                            });
                                    });

                                row.RelativeItem(0.4f)
                                    .Column(nationalColumn =>
                                    {
                                        nationalColumn.Spacing(4);
                                        nationalColumn.Item()
                                              .AlignCenter()
                                              .Text("Mấu số C31 - HD")
                                              .FontSize(10)
                                              .Bold();
                                              

                                        nationalColumn.Item()
                                            .AlignCenter()
                                            .Text("(Ban hành kèm theo thông tư 107/2017/TT-BTC 24/11/2017)")
                                            .FontSize(10);
                                      

                                        
                                    });


                            });

                        var firstData = _data.FirstOrDefault();


                        column.Item().Row(r =>
                        {
                            r.ConstantItem(0.25f);
                            r.RelativeItem().Column(column =>

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
                                         text.DefaultTextStyle(TextStyle.Default.FontSize(10));
                                         text.Span($"Ngày chứng từ: {firstData?.NgayChungTu:dd-MM-yyyy}");
                                     });

                                column.Item()
                                     .AlignCenter()
                                     .Text(text =>
                                     {
                                         text.DefaultTextStyle(TextStyle.Default.FontSize(10));
                                         text.Span($"Số chứng từ: {firstData?.SoChungTu}");
                                     });
                            });

                            r.ConstantItem(0.25f);
                        });





                        column.Item()
                            .Row(row =>
                            {
                                row.RelativeItem(0.4f)
                                    .PaddingBottom(10)
                                    .Row(innerRow =>
                                    {

                                        innerRow.RelativeItem()
                                            
                                            .Column(infoColumn =>
                                            {
                                                infoColumn.Spacing(4);

                                                void AddRow(string label, string value)
                                                {
                                                    infoColumn.Item().Row(row =>
                                                    {
                                                        row.RelativeItem(5)
                                                           .Text(label).FontSize(10).AlignLeft();

                                                        row.ConstantItem(5)
                                                           .Text(":").FontSize(10).AlignCenter();

                                                        row.RelativeItem(10)
                                                           .Text(value ?? "").FontSize(10).AlignLeft();
                                                    });
                                                }

                                                AddRow("Họ tên người nhận hàng", firstData?.NguoiNhanHang);
                                                AddRow("Lý do xuất", firstData?.LyDoXuat);
                                                AddRow("Xuất tại kho", firstData?.XuatTaiKho);
                                                AddRow("Đơn vị lĩnh", firstData?.DonViLinh);
                                                AddRow("Nội dung", firstData?.NoiDung);
                                            });

                                    });

                                row.RelativeItem(0.6f)
                                    .PaddingLeft(200)
                                    .Column(nationalColumn =>
                                     {
                                        nationalColumn.Spacing(4);

                                        void AddRow(string label, string value)
                                        {
                                            nationalColumn.Item().Row(row =>
                                            {
                                                row.RelativeItem(5)
                                                   .Text(label).FontSize(10).AlignLeft();

                                                row.ConstantItem(5)
                                                   .Text(":").FontSize(10).AlignCenter();

                                                row.RelativeItem(10)
                                                   .Text(value ?? "").FontSize(10).AlignLeft();
                                            });
                                        }

                                        AddRow("Địa chỉ (bộ phận)", firstData?.DiaChi);
                                        AddRow("Địa điểm", firstData?.DiaDiem);
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
                                            .Text(text).Bold().FontSize(10);
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
                                        .AlignRight().Text(string.Format(culture,"{0:N2}", item.DonGia ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format(culture,"{0:N2}", item.ThanhTien ?? 0));

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
                                        .AlignRight().Text(string.Format(culture,"{0:N2}", lastRow.DonGia ?? 0));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight().Text(string.Format(culture,"{0:N2}", lastRow.ThanhTien ?? 0));

                                    // =========================================================================

                                    // Dòng Tổng cộng

                                    table.Cell().ColumnSpan(11).Element(c => CellStyle(c))
                                        .AlignCenter().Text("TỔNG CỘNG").Bold();
                               

                                    table.Cell().Element(c => CellStyle(c))
                                        .AlignRight()
                                        .Text(string.Format(culture, "{0:N2}", tongThanhTien))
                                        .Bold();

                                });

                                block.Item().PaddingTop(1)
                                    .Text($"Cộng khoản: {--stt} khoản.")
                                    .Italic().FontSize(10).Bold();

                                block.Item().AlignRight()
                                    .PaddingTop(20)
                                    .PaddingRight(25)
                                    .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                    .FontSize(10).Italic();

                                // ===== CHỮ KÝ =====
                                // Hàng chữ ký
                                block.Item().EnsureSpace(80)
                                    .Row(row =>
                                    {
                                        row.RelativeItem()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Người lập").Bold().FontSize(10);
                                                col.Item().PaddingTop(3).Text("(Ký, ghi rõ họ tên)").Italic().FontSize(10);
                                            });

                                        row.RelativeItem()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Người nhận hàng").Bold().FontSize(10);
                                                col.Item().PaddingTop(3).Text("(Ký, ghi rõ họ tên)").Italic().FontSize(10);
                                            });

                                        row.RelativeItem()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Thủ kho").Bold().FontSize(10);
                                                col.Item().PaddingTop(3).Text("(Ký, ghi rõ họ tên)").Italic().FontSize(10);
                                            });

                                        row.RelativeItem()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Kế toán trưởng").Bold().FontSize(10);
                                                col.Item().Text("(Hoặc phụ trách bộ phận)").Bold().FontSize(10);
                                                col.Item().PaddingTop(3).Text("(Ký, ghi rõ họ tên)").Italic().FontSize(10);
                                            });

                                        row.RelativeItem()
                                            .AlignCenter()
                                            .Column(col =>
                                            {
                                                col.Item().Text("Thủ trưởng đơn vị").Bold().FontSize(10);
                                                col.Item().Text("(Ký, ghi rõ họ tên)").Italic().FontSize(10);
                                            });
                                    });


                            });
                        });


                    });

                page.Footer()
                    .Row(row =>
                    {


                        row.RelativeItem(0.5f)
                        .PaddingTop(10)
                            .AlignLeft()
                            .Text(x =>
                            {
                                x.Span($"{DateTime.Now:dd-MM-yyyy hh:mm:ss}");
                            });


                        row.RelativeItem(0.5f) // Chiếm 50% chiều rộng footer
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
