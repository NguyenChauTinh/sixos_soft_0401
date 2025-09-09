// ==================== XUẤT PDF ====================
function doExportPdf(btnElem) {
    const requestData = {
        idChiNhanh: _idcn,
        idPhieuXuatKho: _idpxk
    };

    fetch("/phieu_xuat_kho/export/pdf", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/pdf' },
        body: JSON.stringify(requestData)
    })
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `PhieuXuatKho.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            showToast('Xuất file pdf thành công', "success");
        })
        .catch(error => {
            showToast("Lỗi trong quá trình xuất file!", "error");
        })
        .finally(() => {
            btnElem.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Xuất PDF';
            btnElem.disabled = false;
        });
}

$('#btnExportPDF').off('click').on('click', function (e) {
    e.preventDefault();
    const btn = this;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang tạo';
    btn.disabled = true;

   
    doExportPdf(btn);

});

//=============== GLOBAL FUNCTION =======================
function showSpinner() {
    document.getElementById("loadingSpinner").style.display = "flex";
}
function hideSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
}
function showToast(message, type = "success") {
    const toastEl = document.getElementById("myToast");
    const body = toastEl.querySelector(".toast-body");

    body.innerText = message;

    toastEl.classList.remove("bg-success", "bg-danger", "bg-warning");
    if (type === "success") toastEl.classList.add("bg-success");
    if (type === "error") toastEl.classList.add("bg-danger");
    if (type === "warning") toastEl.classList.add("bg-warning");

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}