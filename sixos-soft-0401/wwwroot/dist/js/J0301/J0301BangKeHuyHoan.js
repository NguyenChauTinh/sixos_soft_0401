const hinhThucThanhToanData = [
    { id: 1, ten: "Tiền mặt", alias: "TM" },
    { id: 2, ten: "Chuyển khoản", alias: "CK" },
    { id: 3, ten: "Quẹt thẻ", alias: "QT" }
];
let nhanVienData = [];
function formatMoney(value) {
    return Number(value).toLocaleString('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

//========== RENDER DROPDOWN SEARCH ================
function initSearchDropdown({ inputId, dropdownId, hiddenFieldId, data }) {
    const $input = $(`#${inputId}`);
    const $dropdown = $(`#${dropdownId}`);
    let currentIndex = -1;

    function renderDropdown(filter = "") {
        const lower = filter.toLowerCase();

        const list = data.filter(item =>
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
        console.log(`Selected ${inputId}: id =`, id);
        $dropdown.hide();
    });

    $input.on("keydown", function (e) {
        const items = $dropdown.find(".list-group-item");
        if (!items.length) return;

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (e.key === "ArrowDown") {
                currentIndex = (currentIndex + 1) % items.length;
            } else {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
            }

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
                console.log(`Selected ${inputId} (enter): id =`, id);
                $dropdown.hide();
            }
        }
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest(`#${inputId}, #${dropdownId}`).length) {
            $dropdown.hide();
        }
    });
}

$(document).ready(function () {
    $.getJSON("/dist/data/json/Json0301/Dm_NhanVien.json", function (data) {
        nhanVienData = data.map(nv => {
            const alias = nv.ten
                .split(" ")
                .map(word => word.charAt(0).toUpperCase())
                .join("");
            return { ...nv, alias };
        });
        console.log(nhanVienData)

        initSearchDropdown({
            inputId: "searchNhanVien",
            dropdownId: "dropdownNhanVien",
            hiddenFieldId: "selectedNhanVienId",
            data: nhanVienData
        });
    });

    initSearchDropdown({
        inputId: "searchThanhToan",
        dropdownId: "dropdownThanhToan",
        hiddenFieldId: "selectedThanhToanId",
        data: hinhThucThanhToanData
    });
});

//================ XU LY UI =================
// ==================== ĐỊNH DẠNG NGÀY NHẬP ====================
function initDateInputFormatting() {
    const dateInputIds = ["ngayTuNgay_BKHH", "ngayDenNgay_BKHH"];

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
    $('[id="ngayTuNgay_BKHH"], [id="ngayDenNgay_BKHH"]').datepicker({
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
let pageSize = 10;
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
function updateTable(response) {
    const tbody = $('#data-list-BKHH');
    tbody.empty();
    if (response.totalRecords !== undefined) {
        totalRecords = response.totalRecords;
        totalPages = response.totalPages;
        currentPage = response.currentPage || 1;
        $('#pageInfo').text(`Trang ${currentPage}/${totalPages} - Tổng ${totalRecords} bản ghi`);
        renderPagination();
    }

    let data = [];
    if (Array.isArray(response)) {
        data = response;
    } else if (response && response.data) {
        data = Array.isArray(response.data) ? response.data : [response.data];
    }

    if (data.length > 0) {
        let sumCost = 0;
        data.forEach((item, index) => {
            const stt = (currentPage - 1) * pageSize + index + 1;
            sumCost += item.SoTien || item.soTien || 0;
            let tienHuy = item.Huy || item.huy || 0;
            let tienHoan = item.Hoan || item.hoan || 0;
            let tong2tien = item.soTien || item.soTien || 0;
            const row = `
                <tr>
                    <td class="text-center text-nowrap">${stt}</td>
                    <td class="text-center text-nowrap">${item.maYTe || item.MaYTe || ''}</td>
                     <td class="text-nowrap">${item.hoVaTen || item.HoVaTen || ''}</td>
                    <td class="text-nowrap text-center">${item.quyenSo || item.QuyenSo|| 'Không rõ'}</td>
                    <td class="text-center text-nowrap">${item.soBienLai || item.SoBienLai || ''}</td>
                    <td class="text-center text-nowrap">${formatDate(item.ngayThu || item.NgayThu)}</td>
                    <td style="text-align:left;">${item.IdHTTT || item.idHTTT || 'Không rõ'}</td>
                    <td class="text-nowrap text-end">${formatMoney(tienHuy)}</td>
                    <td class="text-nowrap text-end">${formatMoney(tienHoan)}</td>
                    <td class="text-nowrap text-end">${formatMoney(tong2tien)}</td>
                    

                </tr>
            `;
            tbody.append(row); 
        });

    } else {
        tbody.append('<tr><td colspan="10" class="text-center">Không có dữ liệu</td></tr>');
    }
}


// ==================== RENDER PHÂN TRANG ====================
function renderPagination() {
    const pagination = $('#pagination_BKHH');
    pagination.empty();

    const pages = Math.max(1, totalPages || Math.ceil(totalRecords / pageSize || 1));
    if (currentPage > pages) currentPage = pages;

    $('#pageInfo_BKHH').text(`Trang ${currentPage}/${pages} - Tổng ${totalRecords} bản ghi`);

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
    const tuNgay = $('#ngayTuNgay_BKHH').val();
    const denNgay = $('#ngayDenNgay_BKHH').val();

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
        url: '/bang_ke_huy_hoan/filter',
        type: 'POST',
        data: {
            tuNgay: tuNgay,
            denNgay: denNgay,
            IdChiNhanh: _idcn,
            IdNhanVien: idNhanVien,
            page: currentPage,
            pageSize: pageSize
        },
        success: function (response) {
            if (response.success) {
                updateTable(response);
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
            url: '/bang_ke_huy_hoan/filter',
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
    const tuNgay = $('#ngayTuNgay_BKHH').val();
    const denNgay = $('#ngayDenNgay_BKHH').val();

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
        fromDate: $('#ngayTuNgay_BKHH').val(),
        toDate: $('#ngayDenNgay_BKHH').val(),
        doanhNghiep: window.doanhNghiep || null
    };

    $.ajax({
        url: '/bang_ke_huy_hoan/export/excel',
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
            a.download = `ThongKeBenhNhanVip_${requestData.fromDate || 'all'}_den_${requestData.toDate || 'now'}.xlsx`;
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

$('#btnExportExcel_BKHH').off('click').on('click', function (e) {
    e.preventDefault();
    if (!validateExportDatesAndData()) return;

    const btn = $(this);
    const originalHtml = btn.html();
    btn.html('<span class="spinner-border spinner-border-sm"></span> Đang tạo');
    btn.prop('disabled', true);

    const tu = $('#ngayTuNgay_BKHH').val();
    const den = $('#ngayDenNgay_BKHH').val();

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
        fromDate: $('#ngayTuNgay_BKHH').val(),
        toDate: $('#ngayDenNgay_BKHH').val(),
        doanhNghiep: window.doanhNghiep || null
    };

    fetch("/bang_ke_huy_hoan/export/pdf", {
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
            a.download = `ThongKeBenhNhanVip_${requestData.fromDate || 'all'}_den_${requestData.toDate || 'now'}.pdf`;
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

$('#btnExportPDF_BKHH').off('click').on('click', function (e) {
    e.preventDefault();
    if (!validateExportDatesAndData()) return;

    const btn = this;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang tạo';
    btn.disabled = true;

    const tu = $('#ngayTuNgay_BKHH').val();
    const den = $('#ngayDenNgay_BKHH').val();

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
$(document).on('click', '#btnFilter_BKHH', function (e) {
    e.preventDefault();
    currentPage = 1;
    isInitialLoad = true;
    filterData();
});
// ==================== KIỂM TRA NGÀY BÁO CÁO =================

function bindDateRangeValidation() {
    const $tuNgay = $('#ngayTuNgay_BKHH');
    const $denNgay = $('#ngayDenNgay_BKHH');


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
$('#selectGiaiDoan_BKHH').change(function () {
    const selectedValue = $(this).val();
    const container = $('#selectContainer_BKHH');
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
            const typedIsAllowed = Number.isFinite(typedVal) && (values.includes(typedVal) || id === 'yearInput_BKHH');

            let highlightVal = typedVal;
            if ((id === 'quyInput_BKHH' || id === 'thangInput_BKHH') &&
                (!Number.isFinite(typedVal) ||
                (id === 'quyInput_BKHH' && (typedVal < 1 || typedVal > 4)) ||
                (id === 'thangInput_BKHH' && (typedVal < 1 || typedVal > 12)))) {

                const now = new Date();
                if (id === 'quyInput_BKHH') {
                    highlightVal = Math.ceil((now.getMonth() + 1) / 3);
                } else {
                    highlightVal = now.getMonth() + 1;
                }
            }

            let filteredValues = values.filter(v => !filter || v.toString().includes(filter));
            if (filteredValues.length === 0 && id === 'yearInput_BKHH') {
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
        $('#yearInputDropdown_BKHH').find('.dropdown-item').removeClass('active bg-primary text-white');
        const yearItem = $('#yearInputDropdown_BKHH').find(`[data-val="${year}"]`);
        if (yearItem.length) {
            yearItem.addClass('active bg-primary text-white');
            yearItem[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // ================== UPDATE DATE RANGE ==================
    function updateDates() {
        let yearRaw = parseInt($('#yearInput_BKHH').val(), 10);
        let year = Number.isFinite(yearRaw) ? yearRaw : currentYear;

        if (year < 0 || year > currentYear) {
            year = currentYear;
            $('#yearInput').val(currentYear);
            highlightYearInDropdown(currentYear);
        }

        if (selectedValue === 'Nam') {
            $('#ngayTuNgay_BKHH').val(`01-01-${year}`);
            $('#ngayDenNgay_BKHH').val(`31-12-${year}`);
        }
        else if (selectedValue === 'Quy') {
            let quy = parseInt($('#quyInput_BKHH').val(), 10);
            if (!Number.isFinite(quy)) quy = currentQuy;
            if (quy < 1) quy = 1;
            if (quy > 4) quy = 4;
            $('#quyInput').val(quy);

            const startMonth = (quy - 1) * 3 + 1;
            const endMonth = startMonth + 2;
            $('#ngayTuNgay_BKHH').val(formatDate(new Date(year, startMonth - 1, 1)));
            $('#ngayDenNgay_BKHH').val(formatDate(new Date(year, endMonth, 0)));
        }
        else if (selectedValue === 'Thang') {
            let month = parseInt($('#thangInput_BKHH').val(), 10);
            if (!Number.isFinite(month)) month = currentMonth;
            if (month < 1) month = 1;
            if (month > 12) month = 12;
            $('#thangInput_BKHH').val(month);

            const { start, end } = getMonthDateRange(year, month);
            $('#ngayTuNgay_BKHH').val(formatDate(start));
            $('#ngayDenNgay_BKHH').val(formatDate(end));
        }
        else if (selectedValue === 'Ngay') {
            const today = new Date(Date.now());
            const todayStr = formatDate(today);
            $('#ngayTuNgay_BKHH').val(todayStr);
            $('#ngayDenNgay_BKHH').val(todayStr);
        }

        if (selectedValue === 'Nam' || selectedValue === 'Quy' || selectedValue === 'Thang') {
            $('#ngayTuNgay_BKHH, #ngayDenNgay_BKHH').prop('disabled', true);
        } else {
            $('#ngayTuNgay, #ngayDenNgay').prop('disabled', false);
        }

        $('#ngayTuNgay_BKHH').datepicker('setDate', $('#ngayTuNgay_BKHH').val());
        $('#ngayDenNgay_BKHH').datepicker('setDate', $('#ngayDenNgay_BKHH').val());
    }

    const startYear = 2000;
    const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
    createDropdownInput('yearInput_BKHH', 'Năm', yearOptions, currentYear, updateDates, 4);
    $(document)
        .off('blur', '#yearInput_BKHH')
        .on('blur', '#yearInput_BKHH', function () {
            let val = parseInt($(this).val(), 10);
            if (!Number.isFinite(val) || val > currentYear || val < 0) val = currentYear;
            $(this).val(val);

            $('#quyInput_BKHHDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
            $('#quyInput_BKHHDropdown').find(`[data-val="${val}"]`).addClass('active bg-primary text-white');

            updateDates();
        });

    // ================== QUÝ ==================
    if (selectedValue === 'Quy') {
        createDropdownInput('quyInput_BKHH', 'Quý', [1, 2, 3, 4], currentQuy, updateDates, 1);

        $(document)
            .off('blur', '#quyInput_BKHH')
            .on('blur', '#quyInput_BKHH', function () {
                let val = parseInt($(this).val(), 10);
                if (!Number.isFinite(val) || val < 1 || val > 4) val = currentQuy;
                $(this).val(val);

                $('#quyInput_BKHHDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
                $('#quyInput_BKHHDropdown').find(`[data-val="${val}"]`).addClass('active bg-primary text-white');

                updateDates();
            });
    }

    // ================== THÁNG ==================
    else if (selectedValue === 'Thang') {
        createDropdownInput('thangInput_BKHH', 'Tháng', Array.from({ length: 12 }, (_, i) => i + 1), currentMonth, updateDates, 2);

        $(document)
            .off('blur', '#thangInput_BKHH')
            .on('blur', '#thangInput_BKHH', function () {
                let val = parseInt($(this).val(), 10);
                if (!Number.isFinite(val) || val < 1 || val > 12) val = currentMonth;
                $(this).val(val);

                $('#thangInput_BKHHDropdown').find('.dropdown-item').removeClass('active bg-primary text-white');
                $('#thangInput_BKHHDropdown').find(`[data-val="${val}"]`).addClass('active bg-primary text-white');

                updateDates();
            });
    }

    else if (selectedValue === 'Ngay') {
        container.empty();
    }

    updateDates();
});
//=============== GLOBAL FUNCTION =======================
function parseDMY(s) {
    const parts = s.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
function showSpinner() {
    document.getElementById("loadingSpinner_BKHH").style.display = "flex";
}
function hideSpinner() {
    document.getElementById("loadingSpinner_BKHH").style.display = "none";
}
function showToast(message, type = "success") {
    const toastEl = document.getElementById("myToast_BKHH");
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
