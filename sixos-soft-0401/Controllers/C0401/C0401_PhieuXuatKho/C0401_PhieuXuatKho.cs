using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sixos_soft_0401.Models.M0401.M0401_PhieuXuatKho;
using sixos_soft_0401.Services.S0401.I0401.I0401_PhieuXuatKho;

namespace sixos_soft_0401.Controllers.C0401.C0401_PhieuXuatKho
{
    [Route("phieu_xuat_kho")]
    public class C0401_PhieuXuatKhoController : Controller
    {
        //private string _maChucNang = "/phieu_xuat_kho";
        //private IMemoryCachingServices _memoryCache;

        private readonly I0401_PhieuXuatKho _service;
        private readonly ILogger<C0401_PhieuXuatKhoController> _logger;

        public C0401_PhieuXuatKhoController(I0401_PhieuXuatKho service, ILogger<C0401_PhieuXuatKhoController> logger /*, IMemoryCachingServices memoryCache*/)
        {
            _service = service;
            _logger = logger;
            //_memoryCache = memoryCache;
        }

        public IActionResult V0401_PhieuXuatKho()
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
            return View("~/Views/V0401/V0401_PhieuXuatKho/V0401_PhieuXuatKho.cshtml");
        }

        [HttpPost("export/pdf")]
        public async Task<IActionResult> ExportToPDF([FromBody] M0401_ExportRequest request)
        {
            var pdfBytes = await _service.ExportPhieuXuatKhoPdfAsync(request, HttpContext.Session);

            string fileName = $"PhieuXuatKho.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
    }
}
