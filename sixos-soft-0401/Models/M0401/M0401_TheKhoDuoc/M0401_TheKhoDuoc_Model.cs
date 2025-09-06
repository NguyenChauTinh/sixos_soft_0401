using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sixos_soft_0401.Models.M0401.M0401_TheKhoDuoc
{
    public class M0401_TheKhoDuoc_Model
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ID { get; set; }  // bigint, tự động tăng
        public long? IdChiNhanh { get; set; }
        public long? IdKho { get; set; }
        public string? TenKho { get; set; } = string.Empty; //
        public string? TenDuoc { get; set; } = string.Empty; //
        public string? MaDuoc { get; set; } = string.Empty; //
        public DateTime? NgayThangGhiSo { get; set; }
        public string? ChungTuSoHieu { get; set; } = string.Empty; //
        public DateTime? ChungTuNgayThang { get; set; }
        public string? SoLo { get; set; } = string.Empty; //
        public DateTime? HanDung { get; set; }
        public string? DienGiai { get; set; } = string.Empty; //
        public string? DVT { get; set; } = string.Empty; //
        public string? DVTQuiCach { get; set; } = string.Empty; //
        public int? NhapGoc { get; set; }
        public int? Nhap { get; set; }
        public int? XuatGoc { get; set; }
        public int? Xuat { get; set; }
        public int? TonGoc { get; set; }
        public int? Ton { get; set; }

    }
}
