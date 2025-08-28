using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using VipPatientReport.Models.M0301;
using VipPatientReport.Models.M0301.M0301BangKeHuyHoan;

namespace VipPatientReport.PDFDocuments.P0301
{
    public class P0301BangKeHuyHoanPDF : IDocument
    {
        private readonly List<M0301BaoCaoHuyHoanModel> _data;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly M0301ThongTinDoanhNghiep _thongTinDoanhNghiep;

        public P0301BangKeHuyHoanPDF(List<M0301BaoCaoHuyHoanModel> data, string fromDate, string toDate, M0301ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0301BaoCaoHuyHoanModel>();
            _thongTinDoanhNghiep = doanhNghiep ?? new M0301ThongTinDoanhNghiep
            {
                TenCSKCB = "Tên đơn vị",
                DiaChi = "",
                DienThoai = ""
            };

            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                if (_data.Any())
                {
                    _fromDate = _data.Min(x => x.NgayThu).ToString("dd-MM-yyyy");
                    _toDate = _data.Max(x => x.NgayThu).ToString("dd-MM-yyyy");
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

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(20);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));

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
                                                infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "").Bold().FontSize(13);
                                                infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}").FontSize(11).WrapAnywhere(false);
                                                infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}").FontSize(11);
                                                infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}").FontSize(11);
                                            });
                                    });
                                row.RelativeColumn(0.4f)
                                    .Column(nationalColumn =>
                                    {
                                        nationalColumn.Item()
                                              .AlignRight()
                                              .Text("BẢNG KÊ BL/HĐ HỦY HOÀN")
                                              .FontFamily("Times New Roman")
                                              .FontSize(13)
                                              .Bold()
                                              .FontColor(Colors.Blue.Darken2); 

                                        nationalColumn.Item()
                                            .AlignRight()
                                            .Text("Đơn vị thống kê")
                                            .FontSize(11)
                                            .FontFamily("Times New Roman");

                                        nationalColumn.Item()
                                             .AlignRight()
                                             .Text(text =>
                                             {
                                                 text.DefaultTextStyle(TextStyle.Default.FontSize(10).SemiBold());

                                                 if (_fromDate == _toDate)
                                                     text.Span($"Ngày: {_fromDate}");
                                                 else
                                                     text.Span($"Từ ngày: {_fromDate} đến ngày: {_toDate}");
                                             });
                                    });
                            });

                    
                        column.Item()
                            .Table(table =>
                            {
                                
                                table.ColumnsDefinition(columns =>
                                {
                                   
                                    for (int i = 0; i < 10; i++)
                                    {
                                        columns.RelativeColumn();
                                    }
                                });


                                table.Header(header =>
                                {
                                    void AddHeaderCell(string text)
                                    {
                                        header.Cell()
                                            .Border(1)
                                            .BorderColor(Colors.Grey.Darken1)
                                            .Background(Colors.Grey.Lighten3)
                                            .PaddingVertical(2)
                                            .PaddingHorizontal(3)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Text(text)
                                            .Bold()
                                            .FontSize(13);
                                    }

                                    AddHeaderCell("STT");
                                    AddHeaderCell("Mã y tế");
                                    AddHeaderCell("Họ và tên");
                                    AddHeaderCell("Quyển sổ");
                                    AddHeaderCell("Số biên lai");
                                    AddHeaderCell("Ngày thu");
                                    AddHeaderCell("HTTT");
                                    AddHeaderCell("Hủy");
                                    AddHeaderCell("Hoàn");
                                    AddHeaderCell("Tổng cộng");
                                   
                                });

                                int stt = 1;
                                foreach (var item in _data)
                                {
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(stt++); 
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.MaYTe); 
                                    table.Cell().Element(c => CellStyle(c)).Text(item.HoVaTen); 
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.QuyenSo); 
                                    table.Cell().Element(c => CellStyle(c)).Text(item.SoBienLai);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.NgayThu.ToString("dd-MM-yyyy"));
                                    table.Cell().Element(c => CellStyle(c)).Text(item.IdHTTT.ToString() );
                                    table.Cell().Element(c => CellStyle(c)).Text(item.Huy.ToString());
                                    table.Cell().Element(c => CellStyle(c)).Text(item.Hoan.ToString());
                                    table.Cell().Element(c => CellStyle(c)).Text(item.SoTien.ToString());


                                }
                            });

                        column.Item().PaddingTop(10);

                        column.Item().EnsureSpace(90).Column(group =>
                        {
                            group.Item().AlignLeft()
                                .Text($"Tổng tiền bằng số: {_data.Sum(x => x.SoTien):N0}")
                                .FontSize(10).Bold();
                            group.Item().AlignLeft()
                               .Text($"Tổng tiền bằng chữ: {_data.Sum(x => x.SoTien):N0}")
                               .FontSize(10).Bold();


                            group.Item().AlignRight().PaddingRight(39)
                                .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                .FontSize(10).Italic();

                            group.Item().PaddingTop(3).PaddingBottom(25)
                                .Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                    });

                                    void AddSignCell(string title, string note)
                                    {
                                        table.Cell().Element(cell =>
                                            cell.Column(c =>
                                            {
                                                c.Item().AlignCenter().Text(title).Bold().FontSize(11);
                                                c.Item().AlignCenter().PaddingTop(3).Text(note).Italic().FontSize(9);
                                            }));
                                    }

                                    AddSignCell("THỦ TRƯỞNG ĐƠN VỊ", "(Ký, họ tên, đóng dấu)");
                                    AddSignCell("THỦ QUỸ", "(Ký, họ tên)");
                                    AddSignCell("KẾ TOÁN", "(Ký, họ tên)");
                                    AddSignCell("NGƯỜI LẬP BẢNG", "(Ký, họ tên)");
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
                .BorderColor(Colors.Grey.Medium)
                .PaddingVertical(5)
                .PaddingHorizontal(3)
                .Background(Colors.White)
                .AlignMiddle()
                .DefaultTextStyle(TextStyle.Default.FontSize(11));
        }
    }
}
