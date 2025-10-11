using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Models.M0401.M0401_BenhNhanXemLSKCB;

namespace sixos_soft_0401.Controllers.C0401.C0401_NhanBenhXemLSKCB
{
    [Route("benh_nhan")]
    public class C0401_BenhNhanXemLSKCBController : Controller
    {
        //private string _maChucNang = "/benh_nhan_xem_lskcb";
        //private IMemoryCachingServices _memoryCache;
        private readonly M0401AppDbContext _context;
        private readonly ILogger<C0401_BenhNhanXemLSKCBController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public C0401_BenhNhanXemLSKCBController(M0401AppDbContext context, ILogger<C0401_BenhNhanXemLSKCBController> logger, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;

        }

        public IActionResult V0401_BenhNhanXemLSKCB()
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
            return View("~/Views/V0401/V0401_BenhNhanXemLSKCB/V0401_BenhNhanXemLSKCB.cshtml");
        }

        [HttpPost("benh_nhan_xem_lskcb")]
        public async Task<IActionResult> BenhNhanXemLSKCB([FromBody] M0401_ExportRequestBenhNhan request)
        {
            if (request == null || request.IDBenhNhan <= 0)
            {
                return BadRequest(new { success = false, message = "ID Bệnh nhân không hợp lệ." });
            }

            try
            {
                // Gọi Stored Procedure và ánh xạ kết quả vào LSKCB_Result_DTO
                var result = await _context.BenhNhanXemLSKCBs
                    .FromSqlRaw("[dbo].[S00_NhanbenhxemLSKCB] @IDBenhNhan = {0}", request.IDBenhNhan)
                    // Cần ToListAsync() để thực thi truy vấn
                    .ToListAsync();

                if (result == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy lịch sử khám chữa bệnh." });
                }

                // Trả về dữ liệu
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gọi Stored Procedure S00_NhanbenhxemLSKCB với ID: {Id}", request.IDBenhNhan);
                // Trả về lỗi 500
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình xử lý: " + ex.Message });
            }
        }

    }


}
