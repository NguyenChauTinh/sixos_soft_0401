using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sixos_soft_0401.Controllers.C0401.C0401_SoTuChoiMau;
using sixos_soft_0401.Services.S0401.I0401.I0401_SoTuChoiMau;
using sixos_soft_0401.Models.M0401.M0401_SoTuChoiMau;
using sixos_soft_0401.Models.M0401;

namespace sixos_soft_0401.Controllers.C0401.C0401_SoTuChoiMau
{
    [Route("so_tu_choi_mau")]
    public class C0401_SoTuChoiMauController : Controller
    {
        //private string _maChucNang = "/so_tu_choi_mau";
        //private IMemoryCachingServices _memoryCache;

        private readonly I0401_SoTuChoiMau _service;
        private readonly ILogger<C0401_SoTuChoiMauController> _logger;

        public C0401_SoTuChoiMauController(I0401_SoTuChoiMau service, ILogger<C0401_SoTuChoiMauController> logger /*, IMemoryCachingServices memoryCache*/)
        {
            _service = service;
            _logger = logger;
            //_memoryCache = memoryCache;
        }

        public IActionResult V0401_SoTuChoiMau()
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
            return View("~/Views/V0401/V0401_SoTuChoiMau/V0401_SoTuChoiMau.cshtml");
        }

        [HttpPost("filter")]
        public async Task<IActionResult> FilterByDay(string tuNgay, string denNgay, int IdChiNhanh, int page = 1, int pageSize = 10)
        {
            Console.WriteLine($"FilterByDay input -> tuNgay: {tuNgay}, denNgay: {denNgay}, IdChiNhanh: {IdChiNhanh}, page: {page}, pageSize: {pageSize}");


            var result = await _service.FilterByDayAsync(tuNgay, denNgay, IdChiNhanh, page, pageSize);

            if (!result.Success)
            {
                _logger.LogWarning("FilterByDay failed: {Message}", result.Message);
                return Json(new { success = false, message = result.Message });
            }

            _logger.LogInformation("FilterByDay success -> TotalRecords: {TotalRecords}, TotalPages: {TotalPages}, CurrentPage: {CurrentPage}",
                result.TotalRecords, result.TotalPages, result.CurrentPage);

            return Json(new
            {
                success = true,
                message = result.Message,
                data = result.Data,
                totalRecords = result.TotalRecords,
                totalPages = result.TotalPages,
                currentPage = result.CurrentPage,
                doanhNghiep = result.DoanhNghiep
            });
        }


        [HttpPost("export/pdf")]
        public async Task<IActionResult> ExportToPDF([FromBody] M0401_ExportRequest request)
        {
            var pdfBytes = await _service.ExportSoTuChoiMauPdfAsync(request, HttpContext.Session);

            string fileName = $"SoTuChoiMau_{request.FromDate ?? "all"}_den_{request.ToDate ?? "now"}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }

        [HttpPost("export/excel")]
        public async Task<IActionResult> ExportToExcel([FromBody] M0401_ExportRequest request)
        {
            var excelBytes = await _service.ExportSoTuChoiMauExcelAsync(request, HttpContext.Session);

            string fileName = $"SoTuChoiMau_{request.FromDate ?? "all"}_den_{request.ToDate ?? "now"}.xlsx";
            return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
    }
}
