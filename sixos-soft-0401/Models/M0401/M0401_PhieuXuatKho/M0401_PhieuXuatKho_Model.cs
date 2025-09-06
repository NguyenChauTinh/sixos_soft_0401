using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho
{
    public class M0401_PhieuXuatKho_Model
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ID { get; set; }  // bigint, tự động tăng
        public long? IdChiNhanh { get; set; }
        public long? IdKho { get; set; }


        public DateTime? NgayChungTu { get; set; }
        public string? SoChungTu { get; set; } = string.Empty; 
        public string? NguoiNhanHang { get; set; } = string.Empty; 
        public string? LyDoXuat { get; set; } = string.Empty; 
        public string? XuatTaiKho { get; set; } = string.Empty;
        public string? DonViLinh { get; set; } = string.Empty;
        public string? NoiDung { get; set; } = string.Empty; 
        public string? DiaChi { get; set; } = string.Empty; 
        public string? DiaDiem { get; set; } = string.Empty;
        public string? TenHangHoa { get; set; } = string.Empty;
        public string? MaSo { get; set; } = string.Empty;
        public string? DVT { get; set; } = string.Empty;
        public string? DVTQD { get; set; } = string.Empty;
        public string? SoLo { get; set; } = string.Empty;
        public DateTime? HanDung { get; set; }
        public int? SoLuongQD { get; set; }
        public int? SoLuongYeuCau { get; set; }
        public int? SoLuongThucXuat { get; set; }
        public double? DonGia { get; set; }
        public double? TonGoc { get; set; }
    }
}
