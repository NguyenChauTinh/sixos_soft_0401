using System.Collections.Generic;
using System.Threading.Tasks;
using sixos_soft_0401.Models.M0401.M0401_DSNguoiBenhThucHienCLS;


namespace sixos_soft_0401.Services.S0401.I0401.I0401_DSNguoiBenhThucHienCLS
{
    public interface I0401_DSNguoiBenhThucHienCLS
    {

        Task<(bool Success, string Message, object Data, object DoanhNghiep, int TotalRecords, int TotalPages, int CurrentPage)>
        FilterByDayAsync(string tuNgay, string denNgay, int IDChiNhanh, int page = 1, int pageSize = 10);
        Task<byte[]> ExportDSNguoiBenhThucHienCLSPdfAsync(M0401_ExportRequest request, ISession session);

        Task<byte[]> ExportDSNguoiBenhThucHienCLSExcelAsync(M0401_ExportRequest request, ISession session);

    }
}
