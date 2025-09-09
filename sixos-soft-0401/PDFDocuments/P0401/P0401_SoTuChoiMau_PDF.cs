using System.Globalization;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.Models.M0401.M0401_SoTuChoiMau;

namespace sixos_soft_0401.PDFDocuments.P0401
{
    public class P0401_SoTuChoiMau_PDF : IDocument
    {
        private readonly List<M0401_SoTuChoiMau_Model> _data;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly M0401_ThongTinDoanhNghiep _thongTinDoanhNghiep;
        private const int TotalColumns = 9;

        public P0401_SoTuChoiMau_PDF(List<M0401_SoTuChoiMau_Model> data, string fromDate, string toDate, M0401_ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0401_SoTuChoiMau_Model>();
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
                    _fromDate = _data.Min(x => x.ThoiGianTuChoi)?.ToString("dd-MM-yyyy");
                    _toDate = _data.Max(x => x.ThoiGianTuChoi)?.ToString("dd-MM-yyyy");
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
                                              .Text("DANH SÁCH NGƯỜI BỆNH THỰC HIỆN CHUẨN LÂM SÀNG")
                                              .FontFamily("Times New Roman")
                                              .FontSize(10)
                                              .Bold()
                                              .FontColor(Colors.Blue.Darken2);

                                        nationalColumn.Item()
                                            .AlignRight()
                                            .Text("Đơn vị thống kê")
                                            .FontSize(10)
                                            .FontFamily("Times New Roman");

                                        nationalColumn.Item()
                                             .AlignRight()
                                             .Text(text =>
                                             {
                                                 text.DefaultTextStyle(TextStyle.Default.FontSize(8).SemiBold());

                                                 if (_fromDate == _toDate)
                                                     text.Span($"Ngày: 00:00:00 {_fromDate}");
                                                 else
                                                     text.Span($"Từ ngày: 00:00:00{_fromDate} Đến ngày: 00:00:00 {_toDate}");
                                             });
                                    });
                            });

                        column.Item()
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(1); 
                                    columns.RelativeColumn(3); 
                                    columns.RelativeColumn(4); 
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(1.5f); 
                                    columns.RelativeColumn(4); 
                                    columns.RelativeColumn(4); 
                                    columns.RelativeColumn(4); 
                                    columns.RelativeColumn(4); 

                                });

                                string[] headers = { "STT", "Mã Y Tế","Tên bệnh nhân","Nam", "Nữ",
                                    "Khoa Phòng", "Người từ chối", "Thời gian từ chối", "Lý do từ chối" };

                                table.Header(header =>
                                {
                                    foreach (var h in headers)
                                    {
                                        header.Cell().Element(c =>
                                        {
                                             c.Border(1)
                                             .Background(Colors.Grey.Lighten4)
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
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.MaYTe);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.TenBenhNhan);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.Nam);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.Nu);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.KhoaPhong);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.NguoiTuChoi);
                                    table.Cell()
                                        .Element(c => CellStyle(c))
                                        .AlignCenter()
                                        .Text(item.ThoiGianTuChoi?.ToString("HH:mm:ss dd-MM-yyyy"));
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.LyDoTuChoi);

                                }
                            });

                        column.Item().PaddingTop(10);
                        
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
