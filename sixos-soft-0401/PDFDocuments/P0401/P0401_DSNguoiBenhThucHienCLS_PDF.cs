using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;
using System.Globalization;


namespace sixos_soft_0401.PDFDocuments.P0401
{
    public class P0401_DSNguoiBenhThucHienCLS_PDF : IDocument
    {
        private readonly List<M0401_DSNguoiBenhThucHienCLS_Model> _data;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly M0401_ThongTinDoanhNghiep _thongTinDoanhNghiep;
        private const int TotalColumns = 24;

        public P0401_DSNguoiBenhThucHienCLS_PDF(List<M0401_DSNguoiBenhThucHienCLS_Model> data, string fromDate, string toDate, M0401_ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0401_DSNguoiBenhThucHienCLS_Model>();
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
                    _fromDate = _data.Min(x => x.NgayThucHien)?.ToString("dd-MM-yyyy");
                    _toDate = _data.Max(x => x.NgayThucHien)?.ToString("dd-MM-yyyy");
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
                .DefaultTextStyle(TextStyle.Default.FontSize(6)); // Reduced font size
        }

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(20);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontFamily("Times New Roman").FontSize(10).FontColor(Colors.Black));

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
                                                infoColumn.Spacing(2);
                                                infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "").Bold().FontSize(10);
                                                infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}").FontSize(10);
                                                infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}").FontSize(10);
                                                infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}").FontSize(10);
                                            });
                                    });
                                row.RelativeColumn(0.4f)
                                    .Column(nationalColumn =>
                                    {
                                        nationalColumn.Spacing(2);
                                        nationalColumn.Item()
                                              .AlignRight()
                                              .Text("DANH SÁCH NGƯỜI BỆNH THỰC HIỆN CẬN LÂM SÀNG")
                                              .FontSize(10)
                                              .Bold()
                                              .FontColor(Colors.Blue.Darken2);

                                        nationalColumn.Item()
                                            .AlignRight()
                                            .Text("Đơn vị thống kê")
                                            .FontSize(10);

                                        nationalColumn.Item()
                                             .AlignRight()
                                             .Text(text =>
                                             {
                                                 text.DefaultTextStyle(TextStyle.Default.FontSize(8).SemiBold());

                                                 if (_fromDate == _toDate)
                                                     text.Span($"Ngày: 00:00:00 {_fromDate}");
                                                 else
                                                     text.Span($"Từ ngày: 00:00:00 {_fromDate} Đến ngày: 00:00:00 {_toDate}");
                                             });
                                    });
                            });

                        column.Item()
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(1); // STT
                                    columns.RelativeColumn(2); // Mã NB
                                    columns.RelativeColumn(2); // Số vào viện
                                    columns.RelativeColumn(2); // Mã số đợt
                                    columns.RelativeColumn(2); // ICD
                                    columns.RelativeColumn(4); // Họ tên (rộng gấp 4 lần cột STT)
                                    columns.RelativeColumn(1.5f); // NS
                                    columns.RelativeColumn(1); // GT
                                    columns.RelativeColumn(3); // Số BHYT
                                    columns.RelativeColumn(2); // KCB BĐ
                                    columns.RelativeColumn(2); // Đối tượng
                                    columns.RelativeColumn(3); // Nơi chỉ định
                                    columns.RelativeColumn(3); // Bác sĩ
                                    columns.RelativeColumn(4); // Dịch vụ (rộng gấp 4 lần cột STT)
                                    columns.RelativeColumn(1); // SL
                                    columns.RelativeColumn(2); // Ngày YC
                                    columns.RelativeColumn(2); // Ngày TH
                                    columns.RelativeColumn(1.5f); // Quyển
                                    columns.RelativeColumn(2); // Số HĐ
                                    columns.RelativeColumn(2); // Số CT
                                    columns.RelativeColumn(3); // Thiết bị
                                    columns.RelativeColumn(2); // Doanh thu
                                    columns.RelativeColumn(1.5f); // BH
                                    columns.RelativeColumn(1.5f); // Đã TT
                                });

                                string[] headers = { "STT", "Mã NB", "Số vào viện", "Mã số đợt", "ICD", "Họ tên", "NS", "GT",
                            "Số BHYT", "KCB BĐ", "Đối tượng", "Nơi chỉ định", "Bác sĩ", "Dịch vụ",
                            "SL", "Ngày YC", "Ngày TH", "Quyển", "Số HĐ", "Số CT", "Thiết bị", "Doanh thu", "BH", "Đã TT" };

                                table.Header(header =>
                                {
                                    foreach (var h in headers)
                                    {
                                        header.Cell().Element(c =>
                                        {
                                            c.Background(Colors.Grey.Lighten4)
                                             .Border(1)
                                             .BorderColor(Colors.Grey.Medium)
                                             .Padding(2)
                                             .AlignCenter()
                                             .Text(h)
                                             .FontSize(8) // Smaller font for headers to ensure single-line fit
                                             .Bold();
                                        });
                                    }
                                });

                                int stt = 1;
                                foreach (var item in _data)
                                {
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(stt++);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.MaNguoiBenh);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.SoVaoVien);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.MaSoDot);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.ICD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.HoTen);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.NamSinh);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.GioiTinh);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.SoTheBHYT);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.KCB_BD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.DoiTuong);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.NoiChiDinh);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.BacSi);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.DichVu);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignRight().Text(item.SoLuong);
                                    
                                    table.Cell()
                                        .Element(c => CellStyle(c))
                                        .ShowEntire()
                                        .AlignCenter()
                                        .Text(item.NgayYeuCau?.ToString("HH:mm:ss dd-MM-yyyy"));
                                    table.Cell()
                                        .Element(c => CellStyle(c))
                                        .ShowEntire()
                                        .AlignCenter()
                                        .Text(item.NgayThucHien?.ToString("HH:mm:ss dd-MM-yyyy"));
                                    
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.Quyen);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.SoHD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.SoChungTu);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.ThietBi);
                                    var culture = new CultureInfo("en-US"); // Hoặc "en-US" tùy yêu cầu

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight()
                                        .Text(item.DoanhThu?.ToString("N0", culture));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight()
                                        .Text(item.BaoHiem?.ToString("N0", culture));

                                    table.Cell().ShowEntire().Element(c => CellStyle(c))
                                        .AlignRight()
                                        .Text(item.DaThanhToan?.ToString("N0", culture));
                                }
                            });

                        column.Item().PaddingTop(10);
                        column.Item().PaddingTop(20).EnsureSpace(80)
                            .Row(row =>
                            {
                                row.RelativeColumn()
                                    .AlignRight()
                                    .Column(rightColumn =>
                                    {
                                        rightColumn.Item()
                                            .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                            .FontSize(9).Italic();

                                        rightColumn.Item().PaddingTop(5)
                                            .Text("Người xác nhận")
                                            .Bold().FontSize(9);

                                        rightColumn.Item().PaddingTop(3)
                                            .Text("(Ký, họ tên)")
                                            .Italic().FontSize(9);
                                    });
                            });
                    });

                page.Footer()
                    .Text(x =>
                    {
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });

            });
        }
    }
}
