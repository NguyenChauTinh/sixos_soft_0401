using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using VipPatientReport.Models.M0301;
using VipPatientReport.Models.M0301.M0301BCTonKhoVLYT;
using static VipPatientReport.Controllers.C0301.C0301BCTonKhoVTYTController;

namespace VipPatientReport.PDFDocuments.P0301
{
    public class P0301BCTonKhoVTYTPDF : IDocument
    {
        private readonly List<M0301BCTonKhoVTYTModel> _data;
        private readonly List<NhomVatTuModel> _listNhomVatTu;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly string _tenKho;
        private readonly M0301ThongTinDoanhNghiep _thongTinDoanhNghiep;

        public P0301BCTonKhoVTYTPDF(List<M0301BCTonKhoVTYTModel> data, List<NhomVatTuModel> listNhomHang,
            string fromDate, string toDate, string tenKho, M0301ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0301BCTonKhoVTYTModel>();
            _listNhomVatTu = listNhomHang ?? new List<NhomVatTuModel>();
            _tenKho = tenKho ?? "Kho Chẩn đoán Hình ảnh";
            _thongTinDoanhNghiep = doanhNghiep ?? new M0301ThongTinDoanhNghiep
            {
                TenCSKCB = "Tên đơn vị",
                DiaChi = "",
                DienThoai = ""
            };

            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                _fromDate = DateTime.Now.ToString("dd/MM/yyyy");
                _toDate = DateTime.Now.ToString("dd/MM/yyyy");
            }
            else
            {
                _fromDate = fromDate;
                _toDate = toDate;
            }
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(15);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Black));

                page.Content()
                    .Column(column =>
                    {
                        column.Item()
                         .Column(headerColumn =>
                         {
         
                             headerColumn.Item()
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
                                             infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "")
                                                 .Bold().FontSize(13);

                                             infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}")
                                                 .FontSize(11).WrapAnywhere(false);

                                             infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}")
                                                 .FontSize(11);

                                             infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}")
                                                 .FontSize(11);
                                         });
                                 });

                                     // Tên kho
                                     headerColumn.Item().AlignLeft()
                                         .Text(_tenKho)
                                         .FontSize(12)
                                         .Bold();

                                     // Tiêu đề báo cáo
                                     headerColumn.Item().AlignCenter().PaddingVertical(5)
                                         .Text("BÁO CÁO TỒN KHO VẬT TƯ Y TẾ")
                                         .FontSize(16)
                                         .Bold();

                                     // Thời gian
                                     headerColumn.Item().AlignCenter()
                                         .Text($"Từ ngày {_fromDate} đến ngày {_toDate}")
                                         .FontSize(11)
                                         .Italic();
                                 });


                        column.Item().PaddingTop(10)
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(30);  // STT
                                    columns.ConstantColumn(60);  // Mã dược
                                    columns.RelativeColumn(2);   // Tên thuốc
                                    columns.RelativeColumn(1);   // Hàm lượng
                                    columns.ConstantColumn(40);  // ĐVT (QĐ)
                                    columns.ConstantColumn(40);  // ĐVT
                                    columns.ConstantColumn(50);  // Tồn đầu (QĐ)
                                    columns.ConstantColumn(50);  // Tồn đầu
                                    columns.ConstantColumn(50);  // Nhập (QĐ)
                                    columns.ConstantColumn(50);  // Nhập
                                    columns.ConstantColumn(50);  // Xuất (QĐ)
                                    columns.ConstantColumn(50);  // Xuất
                                    columns.ConstantColumn(50);  // Tồn cuối (QĐ)
                                    columns.ConstantColumn(50);  // Tồn cuối
                                });

                                table.Header(header =>
                                {
                                    void AddHeaderCell(string text, int colspan = 1)
                                    {
                                        var cell = header.Cell();
                                        if (colspan > 1)
                                            cell.ColumnSpan((uint)colspan);

                                        cell.Border(1)
                                            .BorderColor(Colors.Black)
                                            .Background(Colors.Grey.Lighten4)
                                            .PaddingVertical(3)
                                            .PaddingHorizontal(2)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Text(text)
                                            .Bold()
                                            .FontSize(9);
                                    }

                                    AddHeaderCell("STT");
                                    AddHeaderCell("Mã dược");
                                    AddHeaderCell("Tên thuốc");
                                    AddHeaderCell("Hàm lượng");
                                    AddHeaderCell("ĐVT (QĐ)");
                                    AddHeaderCell("ĐVT");
                                    AddHeaderCell("Tồn đầu (QĐ)");
                                    AddHeaderCell("Tồn đầu");
                                    AddHeaderCell("Nhập (QĐ)");
                                    AddHeaderCell("Nhập");
                                    AddHeaderCell("Xuất (QĐ)");
                                    AddHeaderCell("Xuất");
                                    AddHeaderCell("Tồn cuối (QĐ)");
                                    AddHeaderCell("Tồn cuối");
                                });

                                var groupedData = _data
                                    .GroupBy(x => x.IdNhomVatTu)
                                    .OrderBy(g => g.Key);

                                int stt = 1;
                                foreach (var group in groupedData)
                                {
                                    var nhomHang = _listNhomVatTu.FirstOrDefault(x => x.Id == group.Key);
                                    var tenNhomHang = nhomHang?.Ten ?? $"Nhóm {group.Key}";

                                    table.Cell().ColumnSpan(14)
                                        .Border(1)
                                        .BorderColor(Colors.Black)
                                        .Background(Colors.Grey.Lighten2)
                                        .PaddingVertical(3)
                                        .PaddingHorizontal(5)
                                        .AlignLeft()
                                        .Text(tenNhomHang)
                                        .Bold()
                                        .FontSize(10);

                                    var sortedItems = group.OrderBy(x => x.TenThuoc);

                                    foreach (var item in sortedItems)
                                    {
                                        table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(stt++.ToString());
                                        table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.MaDuoc ?? "");
                                        table.Cell().Element(c => CellStyle(c)).Text(item.TenThuoc ?? "");
                                        table.Cell().Element(c => CellStyle(c)).Text(item.HamLuong ?? "");
                                        table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.DVT_QD ?? "");
                                        table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.DVT ?? "");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.TonDau_QD.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.TonDau.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.Nhap_QD.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.Nhap.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.Xuat_QD.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.Xuat.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.TonCuoi_QD.ToString("N0") ?? "0");
                                        table.Cell().Element(c => CellStyle(c)).AlignRight().Text(item.TonCuoi.ToString("N0") ?? "0");
                                    }
                                }
                            });

                        column.Item().PaddingTop(20).EnsureSpace(80)
                            .Row(row =>
                            {
                                // Left side - Department head signature
                                row.RelativeColumn()
                                    .AlignLeft()
                                    .Column(leftColumn =>
                                    {
                                        leftColumn.Item().Text("TRƯỞNG KHOA")
                                            .Bold().FontSize(11);
                                        leftColumn.Item().PaddingTop(3)
                                            .Text("(Ký, họ tên, đóng dấu)")
                                            .Italic().FontSize(9);
                                    });

                                // Right side - Report date and reporter
                                row.RelativeColumn()
                                    .AlignRight()
                                    .Column(rightColumn =>
                                    {
                                        rightColumn.Item()
                                            .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                            .FontSize(10).Italic();

                                        rightColumn.Item().PaddingTop(5)
                                            .Text("NGƯỜI BÁO CÁO")
                                            .Bold().FontSize(11);

                                        rightColumn.Item().PaddingTop(3)
                                            .Text("(Ký, họ tên)")
                                            .Italic().FontSize(9);
                                    });
                            });
                    });

                page.Footer()
                    .AlignRight()
                    .Text(x =>
                    {
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
            });
        }

        private IContainer CellStyle(IContainer container)
        {
            return container
                .Border(1)
                .BorderColor(Colors.Black)
                .PaddingVertical(2)
                .PaddingHorizontal(3)
                .Background(Colors.White)
                .AlignMiddle()
                .DefaultTextStyle(TextStyle.Default.FontSize(9));
        }
    }
}
