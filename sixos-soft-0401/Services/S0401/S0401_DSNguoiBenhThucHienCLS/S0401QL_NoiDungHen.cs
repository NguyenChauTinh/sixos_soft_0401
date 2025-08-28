using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_DSNguoiBenhThucHienCLS;

namespace sixos_soft_0401.Services.S0401.S0401_DSNguoiBenhThucHienCLS
{
    public class S0401_DSNguoiBenhThucHienCLS : I0401_DSNguoiBenhThucHienCLS
    {
        private readonly M0401AppDbContext _context;

        public S0401_DSNguoiBenhThucHienCLS(M0401AppDbContext context)
        {
            _context = context;
        }

        

    }
}
