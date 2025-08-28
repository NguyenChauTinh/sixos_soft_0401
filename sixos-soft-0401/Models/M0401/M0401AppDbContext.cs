using Microsoft.EntityFrameworkCore;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;

namespace sixos_soft_0401.Models.M0401
{
    public class M0401AppDbContext : DbContext
    {
        public M0401AppDbContext(DbContextOptions<M0401AppDbContext> options) : base(options) { }
        public DbSet<M0401AppDbContext> DSNguoiBenhThucHienCLS { get; set; }
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
