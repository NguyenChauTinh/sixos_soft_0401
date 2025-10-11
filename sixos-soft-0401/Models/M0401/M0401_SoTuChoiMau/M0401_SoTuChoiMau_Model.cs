using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sixos_soft_0401.Models.M0401.M0401_SoTuChoiMau
{
    public class M0401_SoTuChoiMau_Model
    {
        public long? IdChiNhanh { get; set; }
        public string? MaYTe { get; set; } 
        public string? TenBenhNhan { get; set; } = string.Empty; //
        public int? Nam { get; set; } 
        public int? Nu { get; set; } 
        public string? KhoaPhong { get; set; } = string.Empty; // 
        public string? NguoiTuChoi { get; set; } = string.Empty; // 
        public DateTime? ThoiGianTuChoi { get; set; }
        public string? LyDoTuChoi { get; set; } = string.Empty; //
    }
}
