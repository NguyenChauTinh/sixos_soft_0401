using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sixos_soft_0401.Models.M0401
{
    public class M0401_ThongTinDoanhNghiep
    {
        [Key]
        public long ID { get; set; }

        public string MaCSKCB { get; set; }
        public string TenCSKCB { get; set; }
        public string DiaChi { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }

        [Column("IDChiNhanh")]
        public long IDChiNhanh { get; set; }
    }
}
