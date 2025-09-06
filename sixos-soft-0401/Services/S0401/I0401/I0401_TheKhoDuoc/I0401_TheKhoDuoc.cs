using sixos_soft_0401.Models.M0401.M0401_TheKhoDuoc;

namespace sixos_soft_0401.Services.S0401.I0401.I0401_TheKhoDuoc
{
    public interface I0401_TheKhoDuoc
    {
        Task<(bool Success, string Message, object Data, object DoanhNghiep, int TotalRecords, int TotalPages, int CurrentPage)>
        FilterByDayAsync(string tuNgay, string denNgay, int IDChiNhanh, int IDKho, int page = 1, int pageSize = 10);
        Task<byte[]> ExportTheKhoDuocPdfAsync(M0401_ExportRequest request, ISession session);

        Task<byte[]> ExportTheKhoDuocExcelAsync(M0401_ExportRequest request, ISession session);
    }
}
