using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS
{
    public class M0401_DSNguoiBenhThucHienCLS
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ID { get; set; }  // bigint, tự động tăng
        public string MaNguoiBenh { get; set; } = string.Empty; // 

        public string MaSoDot { get; set; } = string.Empty; // 

        public string ICD { get; set; } = string.Empty; // 
        public string HoTen { get; set; } = string.Empty; // 
        public string NamSinh { get; set; } = string.Empty; // 
        public string GioiTinh { get; set; } = string.Empty; // 
        public string SoTheBHYT { get; set; } = string.Empty; // 
        public string KCB_BD { get; set; } = string.Empty; // 
        public string DoiTuong { get; set; } = string.Empty; // 
        public string NoiChiDinh { get; set; } = string.Empty; // 
        public string BacSi { get; set; } = string.Empty; // 
        public string DichVu { get; set; } = string.Empty; // 
        public int SoLuong { get; set; }
        public DateTime NgayYeuCau { get; set; }
        public DateTime NgayThucHien { get; set; }
        public string Quyen { get; set; } = string.Empty; // 
        public string SoHD { get; set; } = string.Empty; // 
        public string SoChungTu { get; set; } = string.Empty; // 
        public string ThietBi { get; set; } = string.Empty; // 
        public double DoanhThu { get; set; }
        public double BaoHiem { get; set; }
        public double DaThanhToan { get; set; }
    }

}
