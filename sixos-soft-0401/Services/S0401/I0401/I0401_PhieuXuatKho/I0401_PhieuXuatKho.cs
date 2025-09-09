using sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho;

namespace sixos_soft_0401.Services.S0401.I0401.I0401_PhieuXuatKho
{
    public interface I0401_PhieuXuatKho
    {
        Task<byte[]> ExportPhieuXuatKhoPdfAsync(M0401_ExportRequest request, ISession session);
       
       


    }
}
