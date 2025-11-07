using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_DanhSachBenhNhanKhamBenh;

namespace sixos_soft_0401.PDFDocuments.P0401
{
    public class P0401_DanhSachBenhNhanKhamBenh_PDF : IDocument
    {
        private readonly List<M0401_DanhSachBenhNhanKhamBenh_Model> _data;
        private readonly string _fromDate;
        private readonly string _toDate;
        private readonly M0401_ThongTinDoanhNghiep _thongTinDoanhNghiep;

        public P0401_DanhSachBenhNhanKhamBenh_PDF(
            List<M0401_DanhSachBenhNhanKhamBenh_Model> data,
            string fromDate,
            string toDate,
            M0401_ThongTinDoanhNghiep doanhNghiep)
        {
            _data = data ?? new List<M0401_DanhSachBenhNhanKhamBenh_Model>();
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
                    _fromDate = _data.Min(x => x.NgayKham)?.ToString("dd-MM-yyyy");
                    _toDate = _data.Max(x => x.NgayKham)?.ToString("dd-MM-yyyy");
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
                                row.RelativeItem(0.59f)
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
                                                infoColumn.Spacing(2);
                                                infoColumn.Item().Text(_thongTinDoanhNghiep.TenCSKCB ?? "").Bold().FontSize(10);
                                                infoColumn.Item().Text($"Địa chỉ: {_thongTinDoanhNghiep.DiaChi ?? ""}").FontSize(10);
                                                infoColumn.Item().Text($"Điện thoại: {_thongTinDoanhNghiep.DienThoai ?? ""}").FontSize(10);
                                                infoColumn.Item().Text($"Email: {_thongTinDoanhNghiep.Email ?? ""}").FontSize(10);
                                            });
                                    });
                                row.RelativeItem(0.4f)
                                    .Column(nationalColumn =>
                                    {
                                        nationalColumn.Spacing(2);
                                        nationalColumn.Item()
                                              .AlignRight()
                                              .Text("DANH SÁCH BỆNH NHÂN KHÁM BỆNH")
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
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);

                                });

                                string[] headers = { "STT", "Mã bệnh nhân","Họ tên bệnh nhân","Năm sinh", "Giới tính",
                                    "Địa chỉ", "Tỉnh, Thành phố", "Quốc tịch", "Số CCCD",
                                    "Số BHYT", "Nơi ĐK KCB ban đầu", "Mã ĐK KCB ban đầu", "Đối tượng",
                                    "Ngày khám", "Tên bác sĩ khám", "Chẩn đoán", "Mã ICD",
                                    "Chỉ định điều trị", "Loại giá", "Chuyên khoa", "Loại tiếp nhận", "Hướng giải quyết", "Mã số vào viện" };

                                table.Header(header =>
                                {
                                    foreach (var h in headers)
                                    {
                                        header.Cell().Element(c =>
                                        {
                                            c.Border(1)
                                            .BorderColor(Colors.Grey.Medium)
                                            .Padding(2)
                                            .AlignCenter()
                                            .Text(h)
                                            .FontSize(8) 
                                            .Bold();
                                        });
                                    }
                                });

                                int stt = 1;
                                foreach (var item in _data)
                                {
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(stt++);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.MaBenhNhan);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.HoTenBenhNhan);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.NamSinh);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.GioiTinh);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.DiaChi);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.TinhThanhPho);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.QuocTich);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.SoCCCD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.SoBHYT);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.NoiDK_KCBBD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.MaDK_KCBBD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.DoiTuong);
                                    table.Cell()
                                        .Element(c => CellStyle(c))
                                        .AlignCenter()
                                        .Text(item.NgayKham?.ToString("dd-MM-yyyy"));
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.TenBacSiKham);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.ChanDoan);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.MaICD);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.ChiDinhDieuTri);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.LoaiGia);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.ChuyenKhoa);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.LoaiTiepNhan);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).Text(item.HuongGiaiQuyet);
                                    table.Cell().ShowEntire().Element(c => CellStyle(c)).AlignCenter().Text(item.MaSoVaoVien);

                                }
                            });

                        column.Item().PaddingTop(10).EnsureSpace(80)
                            .Row(row =>
                            {
                                row.RelativeItem()
                                    .AlignRight()
                                    .Column(rightColumn =>
                                    {
                                        rightColumn.Item()
                                            .Text($"Ngày {DateTime.Now:dd} tháng {DateTime.Now:MM} năm {DateTime.Now:yyyy}")
                                            .FontSize(8).Italic();
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
