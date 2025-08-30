

namespace sixos_soft_0401.Models.M0401.M0401_SoTuChoiMau
{
    public class M0401_ExportRequest
    {
        public List<M0401_SoTuChoiMau_Model> Data { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public M0401_ThongTinDoanhNghiep DoanhNghiep { get; set; }
    }
}
