using Microsoft.EntityFrameworkCore;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho;
using sixos_soft_0401.Models.M0401.M0401_SoTuChoiMau;
using sixos_soft_0401.Models.M0401.M0401_TheKhoDuoc;

namespace sixos_soft_0401.Models.M0401
{
    public class M0401AppDbContext : DbContext
    {
        public M0401AppDbContext(DbContextOptions<M0401AppDbContext> options) : base(options) { }
        public DbSet<M0401_DSNguoiBenhThucHienCLS_Model> T0401_DSNguoiBenhThucHienCLS { get; set; }
        public DbSet<M0401_SoTuChoiMau_Model> T0401_SoTuChoiMau { get; set; }
        public DbSet<M0401_TheKhoDuoc_Model> T0401_TheKhoDuoc { get; set; }
        public DbSet<M0401_PhieuXuatKho_Model> T0401_PhieuXuatKho { get; set; }
        public DbSet<M0401_ThongTinDoanhNghiep> ThongTinDoanhNghiep { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<M0401_ThongTinDoanhNghiep>().HasNoKey();
            modelBuilder.Entity<M0401_DSNguoiBenhThucHienCLS_Model>().HasNoKey();
            modelBuilder.Entity<M0401_SoTuChoiMau_Model>().HasNoKey();
            modelBuilder.Entity<M0401_TheKhoDuoc_Model>().HasNoKey();
            modelBuilder.Entity<M0401_PhieuXuatKho_Model>().HasNoKey();

        }
        public bool TestConnection()
        {
            try
            {
                return Database.CanConnect();
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
}
