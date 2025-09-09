
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho;
using sixos_soft_0401.PDFDocuments.P0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_PhieuXuatKho;

namespace sixos_soft_0401.Services.S0401.S0401_PhieuXuatKho
{
    public class S0401_PhieuXuatKho_Service : I0401_PhieuXuatKho
    {
        private readonly M0401AppDbContext _context;
        private readonly ILogger<S0401_PhieuXuatKho_Service> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public S0401_PhieuXuatKho_Service(M0401AppDbContext context, ILogger<S0401_PhieuXuatKho_Service> logger, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<M0401_ThongTinDoanhNghiep> GetDoanhNghiepFromDbAsync(long idChiNhanh)
        {
            try
            {
                var doanhNghiep = await _context.ThongTinDoanhNghiep
                    .Where(x => x.IDChiNhanh == idChiNhanh)   // hoặc join bảng ChiNhanh -> DoanhNghiep nếu có
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                _logger.LogInformation("Loaded doanhNghiep: {@doanhNghiep}", doanhNghiep);


                if (doanhNghiep != null)
                {
                    return new M0401_ThongTinDoanhNghiep
                    {
                        TenCSKCB = doanhNghiep.TenCSKCB,
                        DiaChi = doanhNghiep.DiaChi,
                        DienThoai = doanhNghiep.DienThoai,
                        Email = doanhNghiep.Email
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin doanh nghiệp từ SQL");
            }

            return new M0401_ThongTinDoanhNghiep
            {
                TenCSKCB = "Tên đơn vị",
                DiaChi = "",
                DienThoai = "",
                Email = ""
            };
        } 

        public async Task<byte[]> ExportPhieuXuatKhoPdfAsync(M0401_ExportRequest request, ISession session)
        {
            try
            {
 
                // Gọi SP lấy dữ liệu phiếu xuất kho
                var data = await _context.T0401_PhieuXuatKho
                      .FromSqlRaw("EXEC S0401_PhieuXuatKho @IdChiNhanh = {0}, @IdPhieuXuatKho = {1}", request.IdChiNhanh, request.IdPhieuXuatKho)
                        .AsNoTracking()
                        .ToListAsync();

                if (data == null || data.Count == 0)
                {
                    _logger.LogWarning("Không tìm thấy dữ liệu phiếu xuất kho! IdPhieuXuatKho={Id}, IdChiNhanh={ChiNhanh}", request.IdPhieuXuatKho, request.IdChiNhanh);
                    return null;

                }

                var doanhNghiepObj = await GetDoanhNghiepFromDbAsync(request.IdChiNhanh);

                // Sinh PDF
                var document = new P0401_PhieuXuatKho_PDF(data, request.IdPhieuXuatKho, doanhNghiepObj);              

                using var stream = new MemoryStream();
                document.GeneratePdf(stream);
                stream.Position = 0;

                return stream.ToArray();
            }
            catch
            {
                return Array.Empty<byte>();
            }
        }

    }
}
