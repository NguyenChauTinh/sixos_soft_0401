using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;

namespace sixos_soft_0401.PDFDocuments.P0401
{
    public class P0401_DSNguoiBenhThucHienCLS_PDF : IDocument
    {
        private readonly List<M0401_DSNguoiBenhThucHienCLS_Model> _data;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly M0401_ThongTinDoanhNghiep _thongTinDoanhNghiep;

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
                    _fromDate = _data.Min(x => x.NgayThucHien).ToString("dd-MM-yyyy");
                    _toDate = _data.Max(x => x.NgayThucHien).ToString("dd-MM-yyyy");
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
                                              .Text("DANH SÁCH NGƯỜI BỆNH THỰC HIỆN CHUẨN LÂM SÀNG")
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
                                    for (int i = 0; i < 15; i++)
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
                                    AddHeaderCell("Mã người bệnh");
                                    AddHeaderCell("Số vào viện");
                                    AddHeaderCell("Mã số đợt");
                                    AddHeaderCell("ICD");
                                    AddHeaderCell("Họ tên");
                                    AddHeaderCell("NS");
                                    AddHeaderCell("GT");
                                    AddHeaderCell("Số thẻ BHYT");
                                    AddHeaderCell("KCB BĐ");
                                    AddHeaderCell("Đối tượng");
                                    AddHeaderCell("Nơi chị định");
                                    AddHeaderCell("Bác sĩ");
                                    AddHeaderCell("Dịch vụ");
                                    AddHeaderCell("Số lượng");
                                    AddHeaderCell("Ngày yêu cầu");
                                    AddHeaderCell("Ngày thực hiện");
                                    AddHeaderCell("Quyển");
                                    AddHeaderCell("Số HĐ");
                                    AddHeaderCell("Số chứng từ");
                                    AddHeaderCell("Thiết bị");
                                    AddHeaderCell("Doanh thu");
                                    AddHeaderCell("Bảo hiểm");
                                    AddHeaderCell("Dã thanh toán");
                                });

                                int stt = 1;
                                foreach (var item in _data)
                                {
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(stt++);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.MaNguoiBenh);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.SoVaoVien);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.MaSoDot);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.ICD);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.HoTen);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.NamSinh);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.GioiTinh);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.SoTheBHYT);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.KCB_BD);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.DoiTuong);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.NoiChiDinh);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.BacSi);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.DichVu);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.SoLuong);
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.NgayYeuCau.ToString("dd-MM-yyyy"));
                                    table.Cell().Element(c => CellStyle(c)).AlignCenter().Text(item.NgayThucHien.ToString("dd-MM-yyyy"));
                                    table.Cell().Element(c => CellStyle(c)).Text(item.Quyen);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.SoHD);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.SoChungTu);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.ThietBi);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.DoanhThu);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.BaoHiem);
                                    table.Cell().Element(c => CellStyle(c)).Text(item.DaThanhToan);
                                }
                            });

                        column.Item().PaddingTop(10);
                    });

                page.Footer()
                    .AlignRight()
                    .Column(column =>
                    {
                        column.Item()
                            .Text(text =>
                            {
                                text.Span("Ngày 4 tháng 7 năm 2025").FontSize(11).FontFamily("Times New Roman");
                            });
                        column.Item()
                            .Text(text =>
                            {
                                text.Span("Người xác nhận").FontSize(11).FontFamily("Times New Roman").Bold();
                            });
                        column.Item()
                            .Text(text =>
                            {
                                text.Span("(Ký, ghi rõ họ tên)").FontSize(11).FontFamily("Times New Roman").Italic();
                            });
                        column.Item()
                            .PaddingTop(5)
                            .Text(text =>
                            {
                                text.Span("Trang ").FontSize(10);
                                text.CurrentPageNumber();
                                text.Span(" / ");
                                text.TotalPages();
                            });
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
