using Microsoft.AspNetCore.Mvc;
using sixos_soft_0401.Services.S0401.I0401.I0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.Models.M0401;

namespace sixos_soft_0401.Controllers.C0401.C0401_DSNguoiBenhThucHienCLS
{
    [Route("danh_sach_nguoi_benh_thuc_hien_cls")]
    public class C0401_DSNguoiBenhThucHienCLSController : Controller
    {

        //private string _maChucNang = "/danh_sach_nguoi_benh_thuc_hien_cls";
        //private IMemoryCachingServices _memoryCache;

        private readonly I0401_DSNguoiBenhThucHienCLS _service;

        public C0401_DSNguoiBenhThucHienCLSController(I0401_DSNguoiBenhThucHienCLS service /*, IMemoryCachingServices memoryCache*/)
        {
            _service = service;
            //_memoryCache = memoryCache;
        }

        public IActionResult V0401_DSNguoiBenhThucHienCLS()
        {
            //var quyenVaiTro = await _memoryCache.getQuyenVaiTro(_maChucNang);
            //if (quyenVaiTro == null)
            //{
            //    return RedirectToAction("NotFound", "Home");
            //}
            //ViewBag.quyenVaiTro = quyenVaiTro;
            //ViewData["Title"] = CommonServices.toEmptyData(quyenVaiTro);


            //==================================


            ViewBag.quyenVaiTro = new
            {
                Them = true,
                Xoa = true,
                Sua = true,
                Xuat = true,
                CaNhan = true,
                Xem = true
            };
            return View("~/Views/V0401/V0401_DSNguoiBenhThucHienCLS/V0401_DSNguoiBenhThucHienCLS.cshtml");
        }

    }
}
