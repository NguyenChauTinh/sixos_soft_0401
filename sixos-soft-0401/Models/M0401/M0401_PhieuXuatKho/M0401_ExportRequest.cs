

namespace sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho
{
    public class M0401_ExportRequest
    {
        public List<M0401_PhieuXuatKho_Model> Data { get; set; }
        public long IdPhieuXuatKho { get; set; }
        public long IdChiNhanh { get; set; }
        public M0401_ThongTinDoanhNghiep DoanhNghiep { get; set; }
    }
}
