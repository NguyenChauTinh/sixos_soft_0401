//========== GLOBAL FUNCTION ===============
function formatNumber(value) {
    if (value === null || value === undefined || value === "") return "0.00";
    return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function parseDMY(s) {
    const parts = s.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
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
    console.log(message);
    toastEl.classList.remove("bg-success", "bg-danger", "bg-warning");
    if (type === "success") toastEl.classList.add("bg-success");
    if (type === "error") toastEl.classList.add("bg-danger");
    if (type === "warning") toastEl.classList.add("bg-warning");

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}


//========== RENDER DROPDOWN SEARCH ================
let listHangHoa = [];  // Hàng hóa
let listNhomHang = [];      // Nhóm hàng

function initSearchDropdown({ inputId, dropdownId, hiddenFieldId, data, onSelect }) {
    const $input = $(`#${inputId}`);
    const $dropdown = $(`#${dropdownId}`);
    let currentIndex = -1;
    let currentData = data;

    function renderDropdown(filter = "", overrideData = null) {
        if (overrideData) currentData = overrideData;
        const lower = filter.toLowerCase();
        const list = currentData.filter(item =>
            item.ten.toLowerCase().includes(lower) ||
            (item.alias && item.alias.toLowerCase().includes(lower))
        );

        $dropdown.empty();
        currentIndex = -1;

        if (list.length === 0) {
            $dropdown.append(`<div class="list-group-item text-muted">Không tìm thấy</div>`);
        } else {
            list.forEach(item => {
                let tenHienThi = item.ten;
                if (filter.trim() !== "") {
                    const regex = new RegExp(`(${filter})`, "gi");
                    tenHienThi = tenHienThi.replace(regex, "<mark>$1</mark>");
                }
                $dropdown.append(
                    `<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3" data-id="${item.id}">
                        <div class="tenHienThi">${tenHienThi}</div>
                        ${item.alias ? `<div class="px-1">[${item.alias}]</div>` : ""}
                    </div>`
                );
            });
        }
        $dropdown.show();
    }

    $input.on("input focus", function (e) {
        const val = $(this).val();
        if (e.type === "focus") $(this).select();
        renderDropdown(val);
    });

    $dropdown.on("click", ".list-group-item", function () {
        const ten = $(this).find(".tenHienThi").text().trim();
        const id = $(this).data("id");
        $input.val(ten);
        $(`#${hiddenFieldId}`).val(id);
        $dropdown.hide();

        if (onSelect) onSelect({ id, ten });
    });

    $input.on("keydown", function (e) {
        const items = $dropdown.find(".list-group-item");
        if (!items.length) return;

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            currentIndex = (e.key === "ArrowDown")
                ? (currentIndex + 1) % items.length
                : (currentIndex - 1 + items.length) % items.length;

            items.removeClass("active").eq(currentIndex).addClass("active");
            items.eq(currentIndex)[0].scrollIntoView({ behavior: "smooth", block: "nearest" });

        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0) {
                const selected = items.eq(currentIndex);
                const ten = selected.find(".tenHienThi").text().trim();
                const id = selected.data("id");

                $input.val(ten);
                $(`#${hiddenFieldId}`).val(id);
                $dropdown.hide();

                if (onSelect) onSelect({ id, ten });
            }
        }
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest(`#${inputId}, #${dropdownId}`).length) {
            $dropdown.hide();
        }
    });

    return { renderDropdown };
}

$(document).ready(function () {
    // Load Nhóm hàng
    $.getJSON("/dist/data/json/Json0301/HH_DM_NhomHang.json", function (data) {
        listNhomHang = data.map(n => {
            let alias = n.viettat && n.viettat.trim() !== ""
                ? n.viettat.toUpperCase()
                : n.ten.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase()).join("");
            return { ...n, alias };
        });
        // Load Hàng hóa
        $.getJSON("/dist/data/json/Json0301/HH_DM_HangHoa.json", function (dataHH) {
            listHangHoa = dataHH.map(n => {
                let alias = n.viettat && n.viettat.trim() !== ""
                    ? n.viettat.toUpperCase()
                    : n.ten.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase()).join("");
                return { ...n, alias };
            });
            // Tạo dropdown nhóm hàng
            const nhomHangDropdown = initSearchDropdown({
                inputId: "searchNhomHang",
                dropdownId: "dropdownNhomHang",
                hiddenFieldId: "selectedNhomHangId",
                data: listNhomHang,
                onSelect: ({ id }) => {
                    const currentHangHoaId = $("#selectedHangHoaId").val();
                    const currentHangHoa = listHangHoa.find(h => h.id === currentHangHoaId);

                    if (!currentHangHoa || currentHangHoa.idNhomHang !== id) {
                        $("#searchHangHoa").val("");
                        $("#selectedHangHoaId").val("");
                    }

                    hangHoaDropdown.renderDropdown("", listHangHoa.filter(h => h.idNhomHang === id));
                }
            });

            // Tạo dropdown hàng hóa
            const hangHoaDropdown = initSearchDropdown({
                inputId: "searchHangHoa",
                dropdownId: "dropdownHangHoa",
                hiddenFieldId: "selectedHangHoaId",
                data: listHangHoa,
                onSelect: ({ id }) => {
                    // Pick Hàng hóa → auto select Nhóm hàng
                    const hangHoa = listHangHoa.find(h => h.id === id);
                    if (hangHoa) {
                        const nhom = listNhomHang.find(n => n.id === hangHoa.idNhomHang);
                        if (nhom) {
                            $("#searchNhomHang").val(nhom.ten);
                            $("#selectedNhomHangId").val(nhom.id);
                        }
                    }
                }
            });
        });
    });
});




// ==================== ĐỊNH DẠNG NGÀY NHẬP ====================
function initDateInputFormatting() {
    const dateInputIds = ["ngayTuNgay", "ngayDenNgay"];

    dateInputIds.forEach(function (id) {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener("input", function () {
            let value = input.value.replace(/\D/g, "");
            let formatted = "";
            let selectionStart = input.selectionStart;

            if (value.length > 0) formatted += value.substring(0, 2);
            if (value.length >= 3) formatted += "-" + value.substring(2, 4);
            if (value.length >= 5) formatted += "-" + value.substring(4, 8);

            if (formatted !== input.value) {
                const prevLength = input.value.length;
                input.value = formatted;
                const newLength = formatted.length;
                const diff = newLength - prevLength;
                input.setSelectionRange(selectionStart + diff, selectionStart + diff);
            }
        });

        input.addEventListener("click", function () {
            const pos = input.selectionStart;
            if (pos <= 2) input.setSelectionRange(0, 2);
            else if (pos <= 5) input.setSelectionRange(3, 5);
            else input.setSelectionRange(6, 10);
        });

        input.addEventListener("keydown", function (e) {
            const pos = input.selectionStart;
            let val = input.value;

            if (e.key === "Backspace" && (pos === 3 || pos === 6)) {
                e.preventDefault();
                input.value = val.slice(0, pos - 1) + val.slice(pos);
                input.setSelectionRange(pos - 1, pos - 1);
            }
            if (e.key === "Delete" && (pos === 2 || pos === 5)) {
                e.preventDefault();
                input.value = val.slice(0, pos) + val.slice(pos + 1);
                input.setSelectionRange(pos, pos);
            }
        });
    });
}


// ==================== DATEPICKER ====================
function initDatePicker() {
    $('[id="ngayTuNgay"], [id="ngayDenNgay"]').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        language: 'vi',
        todayHighlight: true,
        orientation: 'bottom auto',
        weekStart: 1
    });
}

// ==================== BIẾN GLOBAL PHÂN TRANG ====================
let currentPage = 1;
let pageSize = 20;
let totalRecords = 0;
let totalPages = 0;
let isInitialLoad = true;

// ==================== ĐỊNH DẠNG NGÀY XUẤT RA BẢNG ====================
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// ==================== CẬP NHẬT BẢNG ====================
function updateInventoryTable(response, listNhomHang) {
    const tbody = document.getElementById("data-list")
    tbody.innerHTML = ""

    if (response.totalRecords !== undefined) {
        totalRecords = response.totalRecords
        totalPages = response.totalPages
        currentPage = response.currentPage || 1
        const pageInfo = document.getElementById("pageInfo")
        if (pageInfo) {
            pageInfo.textContent = `Trang ${currentPage}/${totalPages} - Tổng ${totalRecords} bản ghi`
        }
        renderPagination()
    }

    let data = []
    if (Array.isArray(response)) {
        data = response
    } else if (response && response.data) {
        data = Array.isArray(response.data) ? response.data : [response.data]
    }

    if (data.length > 0) {
        const groupedData = {}
        data.forEach((item) => {
            const groupId = item.IdNhomVatTu || item.idNhomVatTu || 0
            if (!groupedData[groupId]) {
                groupedData[groupId] = []
            }
            groupedData[groupId].push(item)
        })

        let globalIndex = 0

        Object.keys(groupedData).forEach((groupId) => {
            const groupItems = groupedData[groupId]

            const groupName =
                listNhomHang.find((nhom) => (nhom.id || nhom.Id) == groupId)?.ten ||
                listNhomHang.find((nhom) => (nhom.id || nhom.Id) == groupId)?.Ten ||
                `Nhóm ${groupId}`

            // Create group header row
            const groupHeaderRow = document.createElement("tr")
            groupHeaderRow.className = "group-header"
            groupHeaderRow.innerHTML = `
                <td colspan="14" class="text-left font-weight-bold bg-light" style="padding: 8px; border: 1px solid #dee2e6;">
                    ${groupName}
                </td>
            `
            tbody.appendChild(groupHeaderRow)

            groupItems.forEach((item, index) => {
                globalIndex++
                const stt = globalIndex

                const row = document.createElement("tr")
                row.innerHTML = `
                    <td class="text-center text-nowrap">${stt}</td>
                    <td class="text-center text-nowrap">${item.MaDuoc || item.maDuoc || ""}</td>
                    <td class="text-nowrap">${item.TenThuoc || item.tenThuoc || ""}</td>
                    <td class="text-nowrap">${item.HamLuong || item.hamLuong || ""}</td>
                    <td class="text-nowrap">${item.Dvt_QD || item.dvt_QD || item.dvT_QD || ""}</td>
                    <td class="text-nowrap">${item.DVT || item.dvt || ""}</td>
                    <td class="text-nowrap text-end">${item.TonDau_QD || item.tonDau_QD || item.tonDauQD || 0}</td>
                    <td class="text-nowrap text-end">${formatNumber(item.TonDau || item.tonDau || 0)}</td>
                    <td class="text-nowrap text-end">${item.Nhap_QD || item.nhap_QD || item.nhapQD || 0}</td>
                    <td class="text-nowrap text-end">${formatNumber(item.Nhap || item.nhap || 0)}</td>
                    <td class="text-nowrap text-end">${item.Xuat_QD || item.xuat_QD || item.xuatQD || 0}</td>
                    <td class="text-nowrap text-end">${formatNumber(item.Xuat || item.xuat || 0)}</td>
                    <td class="text-nowrap text-end">${item.TonCuoi_QD || item.tonCuoi_QD || item.tonCuoiQD || 0}</td>
                    <td class="text-nowrap text-end">${formatNumber(item.TonCuoi || item.tonCuoi || 0)}</td>
                `
                tbody.appendChild(row)
            })
        })
    } else {
        const noDataRow = document.createElement("tr")
        noDataRow.innerHTML = '<td colspan="14" class="text-center">Không có dữ liệu</td>'
        tbody.appendChild(noDataRow)
    }
}




// ==================== RENDER PHÂN TRANG ====================
function renderPagination() {
    const pagination = $('#pagination');
    pagination.empty();

    const pages = Math.max(1, totalPages || Math.ceil(totalRecords / pageSize || 1));
    if (currentPage > pages) currentPage = pages;

    $('#pageInfo').text(`Trang ${currentPage}/${pages} - Tổng ${totalRecords} bản ghi`);

    pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.max(1, currentPage - 1)}">Trước</a>
        </li>
    `);

    const visibleCount = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(pages, startPage + visibleCount - 1);

    if (endPage - startPage + 1 < visibleCount) {
        startPage = Math.max(1, endPage - visibleCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pagination.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    pagination.append(`
        <li class="page-item ${currentPage === pages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.min(pages, currentPage + 1)}">Sau</a>
        </li>
    `);
}

// ==================== LỌC DỮ LIỆU ====================
function filterData(isPagination = false) {
    const tuNgay = $('#ngayTuNgay').val();
    const denNgay = $('#ngayDenNgay').val();
    const idVatTu = $('#selectedHangHoaId').val() || 0;
    const idNhomVatTu = $("#selectedNhomHangId").val() || 0;

    console.log("hang hoa id : nhomhang id = " + idVatTu + " : " + idNhomVatTu);
    console.log("tu ngay = ", tuNgay);
    console.log("den ngay = ", denNgay);
    if (!isPagination && (!tuNgay || !denNgay)) {
        alert("Vui lòng chọn cả từ ngày và đến ngày");
        return;
    }

    if (!isPagination) {

        if (parseDMY(tuNgay) > parseDMY(denNgay)) {
            alert("Từ ngày phải bé hơn đến ngày");
            return;
        }
    }
    let idNhanVien = $('selectedNhanVienId').val();

    showSpinner();
    $('.table').css('opacity', '0.5');
    $.ajax({
        url: '/bc_ton_kho_vtyt/filter',
        type: 'POST',
        data: {
            tuNgay: tuNgay,
            denNgay: denNgay,
            IdChiNhanh: _idcn,
            idKho: _idKho,
            idVatTu: idVatTu,
            idNhomVatTu: idNhomVatTu,
            page: currentPage,
            pageSize: pageSize
        },
        success: function (response) {
            if (response.success) {
                console.log("data = ", response.data);
                updateInventoryTable(response, listNhomHang);
                window.filteredData = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
                totalRecords = response.totalRecords || totalRecords;
                totalPages = response.totalPages || totalPages;
                window.doanhNghiep = response.doanhNghiep || null;
            } else {
                showToast("Có lỗi xảy ra khi lọc!", "error");
            }
        },
        complete: function () {
            hideSpinner();
            $('.table').css('opacity', '1');
        }
    });
}

// ==================== HÀM HỖ TRỢ LẤY TOÀN BỘ DỮ LIỆU ====================
function ajaxFilterRequest(payload) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/bc_ton_kho_vtyt/filter',
            type: 'POST',
            data: payload,
            success: function (resp) {
                resolve(resp);
            },
            error: function (xhr, st, err) {
                reject(err || st || xhr);
                showToast("Có lỗi xảy ra khi lọc!", "error");

            }
        });
    });
}

function fetchAllFilteredData(tuNgay, denNgay) {
    let idNhanVien = $('selectedNhanVienId').val();
    return new Promise((resolve, reject) => {
        const basePayload = {
            tuNgay: tuNgay || '',
            denNgay: denNgay || '',
            IdChiNhanh: _idcn,
            page: 1,
            IdNhanVien: idNhanVien,
            pageSize: pageSize
        };

        ajaxFilterRequest(basePayload).then(firstResp => {
            if (!firstResp || !firstResp.success) {
                reject(firstResp || 'Lỗi khi lấy dữ liệu trang 1');
                return;
            }
            const firstData = Array.isArray(firstResp.data) ? firstResp.data : (firstResp.data ? [firstResp.data] : []);
            const tp = firstResp.totalPages || 1;

            if (tp <= 1) {
                resolve(firstData);
                return;
            }

            const promises = [];
            for (let p = 2; p <= tp; p++) {
                const payload = {
                    tuNgay: tuNgay || '',
                    denNgay: denNgay || '',
                    IdChiNhanh: _idcn,
                    page: p,
                    pageSize: pageSize
                };
                promises.push(ajaxFilterRequest(payload));
            }

            Promise.all(promises)
                .then(results => {
                    const pagesData = results.map(r => Array.isArray(r.data) ? r.data : (r.data ? [r.data] : []));
                    const all = firstData.concat(...pagesData);
                    resolve(all);
                })
                .catch(err => {
                    reject(err);
                });
        }).catch(err => reject(err));
    });
}

// ==================== KIỂM TRA DỮ LIỆU XUẤT ====================
function validateExportDatesAndData() {
    const tuNgay = $('#ngayTuNgay').val();
    const denNgay = $('#ngayDenNgay').val();

    if (!tuNgay && !denNgay) {
        if (!window.filteredData || window.filteredData.length === 0) {
            alert("Không có dữ liệu để xuất");
            return false;
        }
        return true;
    }
    if ((tuNgay && !denNgay) || (!tuNgay && denNgay)) {
        showToast("Vui lòng chọn cả từ ngày và đến ngày", "warning");
        return false;
    }

    if (parseDMY(tuNgay) > parseDMY(denNgay)) {
        showToast("Từ ngày phải nhỏ hơn hoặc bằng đến ngày", "warning");
        return false;
    }
    if (!window.filteredData || window.filteredData.length === 0) {
        showToast("Không có dữ liệu để xuất", "warning");
        return false;
    }
    return true;
}

// ==================== XUẤT EXCEL ====================
function doExportExcel(finalData, btn, originalHtml) {
    const requestData = {
        data: finalData,
        fromDate: $('#ngayTuNgay').val(),
        toDate: $('#ngayDenNgay').val(),
        NhomVatTus: listNhomHang || [],
        tenKho: _tenKho || 'Kho chuẩn đoán hình ảnh',
        doanhNghiep: window.doanhNghiep || null
    };

    $.ajax({
        url: '/bc_ton_kho_vtyt/export/excel',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        xhrFields: { responseType: 'blob' },
        success: function (data, status, xhr) {
            const contentType = xhr.getResponseHeader('content-type') || '';
            if (!contentType.includes('spreadsheet') && !contentType.includes('vnd.openxmlformats')) {
                return;
            }
            const blob = new Blob([data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BCTonKhoVTYT_${requestData.fromDate || 'all'}_den_${requestData.toDate || 'now'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showToast('Xuất file excel thành công', "success");
        },
        error: function () {
            showToast('Lỗi khi tạo file Excel', "error");
        },
        complete: function () {
            btn.html(originalHtml);
            btn.prop('disabled', false);
        }
    });
}

$('#btnExportExcel').off('click').on('click', function (e) {
    e.preventDefault();
    if (!validateExportDatesAndData()) return;

    const btn = $(this);
    const originalHtml = btn.html();
    btn.html('<span class="spinner-border spinner-border-sm"></span> Đang tạo');
    btn.prop('disabled', true);

    const tu = $('#ngayTuNgay').val();
    const den = $('#ngayDenNgay').val();

    if (!window.filteredData || (totalRecords && window.filteredData.length < totalRecords)) {
        fetchAllFilteredData(tu, den)
            .then(allData => {
                window.filteredData = allData;
                doExportExcel(allData, btn, originalHtml);
            })
            .catch(err => {
                btn.html(originalHtml);
                btn.prop('disabled', false);
            });
    } else {
        doExportExcel(window.filteredData, btn, originalHtml);
    }
});

// ==================== XUẤT PDF ====================
function doExportPdf(finalData, btnElem) {
    const requestData = {
        data: finalData,
        fromDate: $('#ngayTuNgay').val(),
        toDate: $('#ngayDenNgay').val(),
        NhomVatTus: listNhomHang || [],
        tenKho: _tenKho || 'Kho chuẩn đoán hình ảnh',
        doanhNghiep: window.doanhNghiep || null
    };

    fetch("/bc_ton_kho_vtyt/export/pdf", {
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
            a.download = `BCTonKhoVTYT_${requestData.fromDate || 'all'}_den_${requestData.toDate || 'now'}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            showToast('Xuất file pdf thành công', "success");
        })
        .catch(error => {
            console.log("error = ", error.message);
            showToast("Lỗi trong quá trình xuất file!", "error");
        })
        .finally(() => {
            btnElem.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Xuất PDF';
            btnElem.disabled = false;
        });
}

$('#btnExportPDF').off('click').on('click', function (e) {
    e.preventDefault();
    if (!validateExportDatesAndData()) return;

    const btn = this;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang tạo';
    btn.disabled = true;

    const tu = $('#ngayTuNgay').val();
    const den = $('#ngayDenNgay').val();

    if (!window.filteredData || (totalRecords && window.filteredData.length < totalRecords)) {
        fetchAllFilteredData(tu, den)
            .then(allData => {
                window.filteredData = allData;
                doExportPdf(allData, btn);
            })
            .catch(err => {
                showToast('Lỗi khi lấy toàn bộ dữ liệu để xuất PDF: ' + err, "error");
                btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Xuất PDF';
                btn.disabled = false;
            });
    } else {
        doExportPdf(window.filteredData, btn);
    }
});

// ==================== SỰ KIỆN GIAO DIỆN ====================
$(document).ready(function () {
    initDatePicker();
    initDateInputFormatting();
    bindDateRangeValidation();

});
// ==================== SỰ KIỆN THAY ĐỔI SỐ BẢN GHI MỖI TRANG ====================
$(document).on('change', '#pageSizeSelect', function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    filterData();
});

// ==================== SỰ KIỆN PHÂN TRANG ====================
$(document).on('click', '.page-link', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        filterData(true);
    }
});
$(document).on('click', '#btnFilter', function (e) {
    e.preventDefault();
    currentPage = 1;
    isInitialLoad = true;
    filterData();
});
// ==================== KIỂM TRA NGÀY BÁO CÁO =================

function bindDateRangeValidation() {
    const $tuNgay = $('#ngayTuNgay');
    const $denNgay = $('#ngayDenNgay');


    function formatDMY(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    }

    $tuNgay.on('change', function () {
        const tu = $tuNgay.val();
        const den = $denNgay.val();
        if (tu && den && parseDMY(den) < parseDMY(tu)) {
            $denNgay.val(tu);
        }
    });

    $denNgay.on('change', function () {
        const tu = $tuNgay.val();
        const den = $denNgay.val();
        if (tu && den && parseDMY(den) < parseDMY(tu)) {
            $tuNgay.val(den);
        }
    });
}



// ==================== XỬ LÝ GIAI ĐOẠN =================
$('#selectGiaiDoan').change(function () {
    const selectedValue = $(this).val();
    const container = $('#selectContainer');
    container.empty();

    if (selectedValue === 'Nam' || selectedValue === 'Ngay') {
        container.css('justify-content', 'flex-start');
    } else if (selectedValue === 'Quy' || selectedValue === 'Thang') {
        container.css('justify-content', 'space-around');
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentQuy = Math.ceil(currentMonth / 3);

    // ================== FUNCTION TẠO DROPDOWN ==================
    function createDropdownInput(id, label, values, defaultValue, onSelect, length = 10) {
        const html = `
            <div data-dropdown-wrapper style="width: 45%; position: relative;">
                <label class="form-label">${label}</label>
                <input type="number" class="form-control" id="${id}" value="${defaultValue}" oninput="if(this.value.length > ${length}) this.value = this.value.slice(0, ${length});"  autocomplete="off">
                <div id="${id}Dropdown"
                    style="display:none; position:absolute; top:100%; left:0; width:100%;
                    max-height:200px; overflow-y:auto; z-index:9999; background:white;
                    border:1px solid rgba(0,0,0,.15); border-radius:4px;
                    box-shadow:0 6px 12px rgba(0,0,0,.175);">
                </div>
            </div>
        `;
        container.append(html);

        const $input = $('#' + id);
        const $dropdown = $('#' + id + 'Dropdown');
        let currentHighlightIndex = -1;

        function highlightCurrentItem() {
            const items = $dropdown.find('.dropdown-item');
            items.removeClass('active bg-primary text-white');
            if (currentHighlightIndex >= 0 && currentHighlightIndex < items.length) {
                items.eq(currentHighlightIndex).addClass('active bg-primary text-white');
                const item = items.eq(currentHighlightIndex)[0];
                if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        function renderList(filter = '') {
            $dropdown.empty();
            currentHighlightIndex = -1;

            const typedVal = parseInt($input.val(), 10);
            const typedIsAllowed = Number.isFinite(typedVal) && (values.includes(typedVal) || id === 'yearInput');

            let highlightVal = typedVal;
            if ((id === 'quyInput' || id === 'thangInput') &&
                (!Number.isFinite(typedVal) ||
                (id === 'quyInput' && (typedVal < 1 || typedVal > 4)) ||
                (id === 'thangInput' && (typedVal < 1 || typedVal > 12)))) {

                const now = new Date();
                if (id === 'quyInput') {
                    highlightVal = Math.ceil((now.getMonth() + 1) / 3);
                } else {
                    highlightVal = now.getMonth() + 1;
                }
            }

            let filteredValues = values.filter(v => !filter || v.toString().includes(filter));
            if (filteredValues.length === 0 && id === 'yearInput') {
                if (Number.isFinite(typedVal)) {
                    filteredValues = [typedVal];
                } else {
                    filteredValues = values.slice();
                }
            } else if (filteredValues.length === 0) {
                filteredValues = values.slice();
            }

            filteredValues.forEach((val, index) => {
                const isSelected = Number.isFinite(highlightVal) && val === highlightVal;
                const item = $(` 
            <a href="#" class="dropdown-item ${isSelected ? 'active bg-primary text-white' : ''}"
               data-val="${val}" data-index="${index}"
               style="padding:8px 16px; display:block; text-decoration:none; color:#333; cursor:pointer;">
               ${val}
            </a>
        `);
                item.on('click', function (e) {
                    e.preventDefault();
                    selectItem(val);
                });
                item.on('mouseenter', function () {
                    currentHighlightIndex = index;
                    highlightCurrentItem();
                });
                $dropdown.append(item);
                if (isSelected) currentHighlightIndex = index;
            });

            const items = $dropdown.find('.dropdown-item');
            if (currentHighlightIndex === -1 && items.length) {
                currentHighlightIndex = 0;
            }
            highlightCurrentItem();
        }


        function selectItem(val) {
            $input.val(val);
            $dropdown.hide();
            if (onSelect) onSelect(val);
        }

        $input.on('focus click', function () {
            renderList();
            $dropdown.show();
        });

        $input.on('input', function () {
            renderList($(this).val());
            $dropdown.show();
        });

        $input.on('keydown', function (e) {
            const items = $dropdown.find('.dropdown-item');
            if (!items.length) return;

            const key = e.key;
            const isUp = key === 'ArrowUp';
            const isDown = key === 'ArrowDown';
            const isEnter = key === 'Enter';
            const isEscape = key === 'Escape';
            const isTab = key === 'Tab';

            if (isUp || isDown || isEnter || isEscape || isTab) e.preventDefault();

            if (isUp) {
                currentHighlightIndex = (currentHighlightIndex <= 0) ? items.length - 1 : currentHighlightIndex - 1;
                highlightCurrentItem();
                return;
            }

            if (isDown) {
                currentHighlightIndex = (currentHighlightIndex >= items.length - 1) ? 0 : currentHighlightIndex + 1;
                highlightCurrentItem();
                return;
            }

            if (isEnter && currentHighlightIndex >= 0) {
                const val = parseInt(items.eq(currentHighlightIndex).data('val'), 10);
                console.log("val = ", val)
                selectItem(val);
                return;
            }

            if (isEscape) {
                $dropdown.hide();
                return;
            }

            if (isTab) {
                if (currentHighlightIndex >= 0) {
                    const val = parseInt(items.eq(currentHighlightIndex).data('val'), 10);
                    selectItem(val);
                }
                return;
            }

        });
        $input.on('keypress', function (e) {
            const invalidChars = ['e', 'E', '+', '-', '.', ','];
            if (invalidChars.includes(e.key)) {
                e.preventDefault();
            }
        });

        $(document).off('click.dropdown-' + id).on('click.dropdown-' + id, function (e) {
            if (!$(e.target).closest('[data-dropdown-wrapper]').length) {
              
                $dropdown.hide();
            }
        });
    }

    // ================== FORMAT DATE ==================
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function getMonthDateRange(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return { start: startDate, end: endDate };
    }

    function highlightYearInDropdown(year) {
        $('#yearInputDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
        const yearItem = $('#yearInputDropdown').find(`[data-val="${year}"]`);
        if (yearItem.length) {
            yearItem.addClass('active bg-primary text-white');
            yearItem[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // ================== UPDATE DATE RANGE ==================
    function updateDates() {
        let yearRaw = parseInt($('#yearInput').val(), 10);
        let year = Number.isFinite(yearRaw) ? yearRaw : currentYear;

        if (year < 0 || year > currentYear) {
            year = currentYear;
            $('#yearInput').val(currentYear);
            highlightYearInDropdown(currentYear);
        }

        if (selectedValue === 'Nam') {
            $('#ngayTuNgay').val(`01-01-${year}`);
            $('#ngayDenNgay').val(`31-12-${year}`);
        }
        else if (selectedValue === 'Quy') {
            let quy = parseInt($('#quyInput').val(), 10);
            if (!Number.isFinite(quy)) quy = currentQuy;
            if (quy < 1) quy = 1;
            if (quy > 4) quy = 4;
            $('#quyInput').val(quy);

            const startMonth = (quy - 1) * 3 + 1;
            const endMonth = startMonth + 2;
            $('#ngayTuNgay').val(formatDate(new Date(year, startMonth - 1, 1)));
            $('#ngayDenNgay').val(formatDate(new Date(year, endMonth, 0)));
        }
        else if (selectedValue === 'Thang') {
            let month = parseInt($('#thangInput').val(), 10);
            if (!Number.isFinite(month)) month = currentMonth;
            if (month < 1) month = 1;
            if (month > 12) month = 12;
            $('#thangInput').val(month);

            const { start, end } = getMonthDateRange(year, month);
            $('#ngayTuNgay').val(formatDate(start));
            $('#ngayDenNgay').val(formatDate(end));
        }
        else if (selectedValue === 'Ngay') {
            const today = new Date(Date.now());
            const todayStr = formatDate(today);
            $('#ngayTuNgay').val(todayStr);
            $('#ngayDenNgay').val(todayStr);
        }

        if (selectedValue === 'Nam' || selectedValue === 'Quy' || selectedValue === 'Thang') {
            $('#ngayTuNgay, #ngayDenNgay').prop('disabled', true);
        } else {
            $('#ngayTuNgay, #ngayDenNgay').prop('disabled', false);
        }

        $('#ngayTuNgay').datepicker('setDate', $('#ngayTuNgay').val());
        $('#ngayDenNgay').datepicker('setDate', $('#ngayDenNgay').val());
    }

    const startYear = 2000;
    const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
    createDropdownInput('yearInput', 'Năm', yearOptions, currentYear, updateDates, 4);
    $(document)
        .off('blur', '#yearInput')
        .on('blur', '#yearInput', function () {
            let val = parseInt($(this).val(), 10);
            if (!Number.isFinite(val) || val > currentYear || val < 0) val = currentYear;
            $(this).val(val);

            $('#quyInputDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
            $('#quyInputDropdown').find(`[data-val="${val}"]`).addClass('active bg-primary text-white');

            updateDates();
        });

    // ================== QUÝ ==================
    if (selectedValue === 'Quy') {
        createDropdownInput('quyInput', 'Quý', [1, 2, 3, 4], currentQuy, updateDates, 1);

        $(document)
            .off('blur', '#quyInput')
            .on('blur', '#quyInput', function () {
                let val = parseInt($(this).val(), 10);
                if (!Number.isFinite(val) || val < 1 || val > 4) val = currentQuy;
                $(this).val(val);

                $('#quyInputDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
                $('#quyInputDropdown').find(`[data-val="${val}"]`).addClass('active bg-primary text-white');

                updateDates();
            });
    }

    // ================== THÁNG ==================
    else if (selectedValue === 'Thang') {
        createDropdownInput('thangInput', 'Tháng', Array.from({ length: 12 }, (_, i) => i + 1), currentMonth, updateDates, 2);

        $(document)
            .off('blur', '#thangInput')
            .on('blur', '#thangInput', function () {
                let val = parseInt($(this).val(), 10);
                if (!Number.isFinite(val) || val < 1 || val > 12) val = currentMonth;
                $(this).val(val);

                $('#thangInputDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
                $('#thangInputDropdown').find(`[data-val="${val}"]`).addClass('active bg-primary text-white');

                updateDates();
            });
    }

    else if (selectedValue === 'Ngay') {
        container.empty();
    }

    updateDates();
});
