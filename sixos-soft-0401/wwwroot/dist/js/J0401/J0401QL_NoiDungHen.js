/* ==========================
   Event binding
========================== */
console.log("Script chạy với defer, DOM đã sẵn sàng!");
$(document).ready(function () {
    console.log("DOM ready!");
    // load danh sách loại CLS ban đầu
    loadMauNoiDung($('#idMaCLS').val(), true);
    loadCLS();

    // binding nút Lưu
    $('#btnLuuMauNoiDung').on('click', function () {
        luuMauNoiDung();
    });
        
    //Summernote textarea
    $('#huongDanNoiDung').summernote({
        lang: 'vi-VN',
        
        minHeight: 400,
        maxHeight: 400,
        placeholder: 'Nhập hướng dẫn...',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['fontsize', 'color']],
            ['para', ['ul', 'ol', 'paragraph']],
        ]
    });
});

/* ==========================
   Load danh sách Loại CLS
========================== */

// ====================== LOAD CLS FROM JSON ======================
const clsChonDropdown = $('#loaiCLSDropdown');


function loadChonCLS() {
    $.getJSON('/dist/data/json/CLS_DmLoaiCLS.json', function (data) {   // đổi path tới file JSON của bạn

        window.clsList = {};
        clsChonDropdown.empty();
        clsChonDropdown.append('<li><a class="dropdown-item disabled" href="#">--- Chọn mẫu ---</a></li>');

        // Sắp xếp danh sách tỉnh theo tên (a-z)
        const sortedData = data.sort((a, b) => {
            const tenA = a.ten.toLowerCase();
            const tenB = b.ten.toLowerCase();
            return tenA.localeCompare(tenB);
        });

        sortedData.forEach(item => {
            window.clsList[item.id] = item;

            clsChonDropdown.append(`
                <li>
                    <a class="dropdown-item" href="#" data-id="${item.id}" 
                       style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${item.ten}</span>
                        <small style="color: gray; font-size: 0.85em;">${item.viettat || ''}</small>
                    </a>
                </li>
            `);
        });
    });
}

// ====================== EVEN CLS ======================
clsChonDropdown.on('click', '.dropdown-item:not(.disabled)', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    const clsInfo = window.clsList[id];
    if (!clsInfo) return;

    $('#loaiCLSSearch').val(clsInfo.ten);
    $('#idCLS').val(clsInfo.ma);
    clsChonDropdown.removeClass('show');

    // Reset selection
    clsSelectedIndex = -1;
    clsChonDropdown.find('.dropdown-item').removeClass('active');
});

// ====================== SEARCH CHON CLS ======================
$('#loaiCLSSearch').on('input', function () {
    const searchText = $(this).val().toLowerCase().trim();
    const items = clsChonDropdown.find('.dropdown-item:not(.disabled)');

    items.each(function () {
        const id = $(this).data('id');
        const clsInfo = window.clsList[id];
        const itemText = $(this).text().toLowerCase();
        const isMatch =
            itemText.includes(searchText) ||
            clsInfo.ten.toLowerCase().includes(searchText) ||
            (clsInfo.viettat || '').toLowerCase().includes(searchText);

        $(this).toggle(isMatch);
    });

    clsChonDropdown.addClass('show');
    clsSelectedIndex = -1;
    items.removeClass('active');
});

// ====================== KEY NAVIGATION ======================
$('#loaiCLSSearch').on('keydown', function (e) {
    const items = clsChonDropdown.find('.dropdown-item:visible:not(.disabled)');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        clsSelectedIndex = (clsSelectedIndex >= items.length - 1) ? 0 : clsSelectedIndex + 1;
        updateCLSSelection(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        clsSelectedIndex = (clsSelectedIndex <= 0) ? items.length - 1 : clsSelectedIndex - 1;
        updateCLSSelection(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items.length > 0) {
            // Nếu chưa chọn thì mặc định chọn item đầu tiên
            if (clsSelectedIndex < 0 || clsSelectedIndex >= items.length) {
                clsSelectedIndex = 0;
            }

            // Bắt buộc click vào item
            items.eq(clsSelectedIndex).trigger("click");
        } 
        clsChonDropdown.removeClass('show');
    }
});

// ====================== LOAD CLS FROM JSON ======================
let clsSelectedIndex = -1;
window.clsList = {}; // Lưu danh sách CLS load từ JSON
window.clsListMapMa = {};

const clsDropdown = $('#maLoaiCLSDropdown');

function loadCLS() {
    $.getJSON('/dist/data/json/CLS_DmLoaiCLS.json', function (data) {   // đổi path tới file JSON của bạn

        window.clsList = {};
        clsDropdown.empty();
        clsDropdown.append('<li><a class="dropdown-item disabled" href="#">--- Chọn mẫu ---</a></li>');

        //clsChonDropdown.empty();
        //clsChonDropdown.append('<li><a class="dropdown-item disabled" href="#">--- Chọn mẫu ---</a></li>');

        // Sắp xếp danh sách tỉnh theo tên (a-z)
        const sortedData = data.sort((a, b) => {
            const tenA = a.ten.toLowerCase();
            const tenB = b.ten.toLowerCase();
            return tenA.localeCompare(tenB);
        });

        // Map theo ma
        window.clsListMapMa = {};
        const sorted = data.sort((a, b) => {
            const tenA = a.ten.toLowerCase();
            const tenB = b.ten.toLowerCase();
            return tenA.localeCompare(tenB);
        });

        sorted.forEach(item => {
            window.clsListMapMa[item.ma] = item;
        })


        //=========================

        sortedData.forEach(item => {
            window.clsList[item.id] = item;

            clsDropdown.append(`
                <li>
                    <a class="dropdown-item" href="#" data-id="${item.id}" 
                       style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${item.ten}</span>
                        <small style="color: gray; font-size: 0.85em;">${item.viettat || ''}</small>
                    </a>
                </li>
            `);
        });

        //sortedData.forEach(item => {
        //    window.clsList[item.id] = item;

        //    clsChonDropdown.append(`
        //        <li>
        //            <a class="dropdown-item" href="#" data-id="${item.id}" 
        //               style="display: flex; justify-content: space-between; align-items: center;">
        //                <span>${item.ten}</span>
        //                <small style="color: gray; font-size: 0.85em;">${item.viettat || ''}</small>
        //            </a>
        //        </li>
        //    `);
        //});
    });
}

//// ====================== EVENT CHỌN CLS ======================
clsDropdown.on('click', '.dropdown-item:not(.disabled)', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    const clsInfo = window.clsList[id];
    if (!clsInfo) return;

    $('#maLoaiCLSSearch').val(clsInfo.ten);
    $('#idMaCLS').val(clsInfo.ma);
    clsDropdown.removeClass('show');

    // Reset selection
    clsSelectedIndex = -1;
    clsDropdown.find('.dropdown-item').removeClass('active');
});

// ====================== SEARCH CLS ======================
$('#maLoaiCLSSearch').on('input', function () {
    const searchText = $(this).val().toLowerCase().trim();
    const items = clsDropdown.find('.dropdown-item:not(.disabled)');

    // Lọc và hiển thị các item phù hợp
    items.each(function () {
        const id = $(this).data('id');
        const clsInfo = window.clsList[id];
        const itemText = $(this).text().toLowerCase();
        const isMatch =
            itemText.includes(searchText) ||
            clsInfo.ten.toLowerCase().includes(searchText) ||
            (clsInfo.viettat || '').toLowerCase().includes(searchText);

        $(this).toggle(isMatch);
    });

    clsDropdown.addClass('show');
    clsSelectedIndex = -1;
    items.removeClass('active');
});



// ====================== KEY NAVIGATION ======================
$('#maLoaiCLSSearch').on('keydown', function (e) {
    const items = clsDropdown.find('.dropdown-item:visible:not(.disabled)');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        clsSelectedIndex = (clsSelectedIndex >= items.length - 1) ? 0 : clsSelectedIndex + 1;
        updateCLSSelection(items);
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        clsSelectedIndex = (clsSelectedIndex <= 0) ? items.length - 1 : clsSelectedIndex - 1;
        updateCLSSelection(items);
    }
    if (e.key === 'Enter') {
        e.preventDefault();

        if (items.length > 0) {
            // Nếu chưa chọn thì mặc định chọn item đầu tiên
            if (clsSelectedIndex < 0 || clsSelectedIndex >= items.length) {
                clsSelectedIndex = 0;
            }

            // Bắt buộc click vào item
            items.eq(clsSelectedIndex).trigger("click");
        } 

        clsDropdown.removeClass('show');
    }

    
    
});

// ====================== UPDATE SELECTION ======================
function updateCLSSelection(items) {
    items.removeClass('active');
    if (clsSelectedIndex >= 0) {
        items.eq(clsSelectedIndex).addClass('active');
        items.eq(clsSelectedIndex)[0].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// ====================== CLICK RA NGOÀI -> ĐÓNG DROPDOWN ======================
$(document).on('click', function (e) {
    if (!$(e.target).closest('#maLoaiCLSSearch, #maLoaiCLSDropdown, #loaiCLSDropdown, #loaiCLSSearch').length) {
        clsDropdown.removeClass('show');
    }
});


// ====================== VALIDATE ======================


/* ==========================
   Load danh sách mẫu nội dung hẹn
========================== */
async function loadMauNoiDung(maCLS = "", reload = false) {
    const $tbody = $('#mauNoiDungTable tbody');
    $tbody.empty();
    try {

        let url;
        if (maCLS === "" && reload === true) {
            url = `/quan_li_noi_dung_hen/active`;
        }

        if (maCLS !== "" && reload === false) {
            url = `/quan_li_noi_dung_hen/by-maloaicls/${maCLS}`;
        }

        const response = await $.get(url);
        const data = response;

        data.sort((a, b) => b.id - a.id);

        console.log(response);


        for (const item of data) {
            $tbody.append(`
                <tr>
                    <td class="text-left" style="width: 80%;">${item.tenMau}</td>
                    <td class="text-center" style="width: 10%;">
                        <!-- Nút chỉnh sửa -->
                            <button class="btn btn-warning btn-sm"
                            ${quyenSua ? "" : "disabled"}
                            onclick="openEditModal(${item.id})" title="Chỉnh sửa">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" >
                                    <path d="M14.06 9.02L15 9.96L5.92 19.04H5V18.12L14.06 9.02ZM17.66 
                                             3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 
                                             8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 
                                             5.63L18.37 3.29C18.18 3.1 17.92 3 17.66 3ZM14.06 
                                             6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z"/>
                                </svg>
                            </button>
                    </td>
                    <td class="text-center" style="width: 10%;">
                        <!-- Nút xóa -->
                            <button class="btn btn-danger btn-sm" 
                            ${quyenXoa ? "" : "disabled"}
                            onclick="xoaMauNoiDung(${item.id})" title="Xóa">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" >
                                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 
                                             18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 
                                             6 9V19ZM19 4H15.5L14.79 3.29C14.61 3.11 
                                             14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 
                                             9.21 3.29L8.5 4H5V6H19V4Z"/>
                                </svg>
                            </button>
                    </td>
                </tr>
            `);
        }

    } catch (xhr) { 
        //console.error('Error fetching students:', xhr);
        $tbody.html('<tr><td colspan="3" class="text-center">Không có dữ liệu dữ liệu</td></tr>');
    }
    paginateTable('mauNoiDungTable', 'pagination');
}

/* ==========================
   CRUD Mẫu nội dung hẹn
========================== */
function luuMauNoiDung() {

    const isVal_CLS = validateLoaiCLS();
    const isVal_TenMau = validateLoaiTenMau();
    const isVal_HuongDan = validateLoaiHuongDan();

    if (!isVal_CLS || !isVal_TenMau || !isVal_HuongDan) {
        console.log("Validation");
        return;
    }

    console.log("Run save");

    const id = $('#id').val();
    const maCLS = $('#idCLS').val();
    const tenMau = $('#tenMauNoiDung').val();
    const huongDan = $('#huongDanNoiDung').val() || "";

    if (id) {
        // update
        const data = {
            id: parseInt(id),
            maLoaiCLS: maCLS,
            tenMau: tenMau,
            huongDan: huongDan,
            active: true
        };

        console.log("data update", data);

        $.ajax({
            url: `/quan_li_noi_dung_hen/update/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                $('#mauNoiDungModal').modal('hide');
                $('#danhSachMau').text(`Tất cả mẫu loại " ${$('#loaiCLSSearch').val()} "`);
                loadMauNoiDung(maCLS, false);
            }
        });
    }

    if (!id) {
        // create
        const data = {
            maLoaiCLS: maCLS,
            tenMau: tenMau,
            huongDan: huongDan,
            active: true
        };

        console.log("data create", data);

        $.ajax({
            url: `/quan_li_noi_dung_hen/create`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                $('#mauNoiDungModal').modal('hide');
                $('#danhSachMau').text(`Tất cả mẫu loại " ${$('#loaiCLSSearch').val()} "`);
                loadMauNoiDung(maCLS, false);
            }
        });
    }
}

// ================================ MO MODAL ADD ================================
function openAddModal() {
    clsSelectedIndex = -1;
    loadChonCLS();
    $('#id').val('');
    $('#loaiCLSSearch').val('');
    $('#idCLS').val('');
    $('#tenMauNoiDung').val('');
    $('#huongDanNoiDung').summernote('reset');
    $('#modalTitle').text('Thêm mẫu');
}

// ================================ MO MODAL EDIT ================================
function openEditModal(id) {

    $.get(`/quan_li_noi_dung_hen/get/${id}`, function (item) {
        $('#id').val(item.id);
        // Lấy thông tin CLS từ mã

        const clsInfo = window.clsListMapMa[item.maLoaiCLS];  // maLoaiCLS phải là "C", "M", ...
        if (clsInfo) {
            $('#loaiCLSSearch').val(clsInfo.ten);
        } else {
            console.warn('Không tìm thấy CLS với mã:', item.maLoaiCLS);
        }

        $('#idCLS').val(item.maLoaiCLS);
        $('#tenMauNoiDung').val(item.tenMau);
        // Dùng Summernote API để hiển thị HTML đúng
        $('#huongDanNoiDung').summernote('code', item.huongDan);
        $('#modalTitle').text('Sửa mẫu');
        $('#mauNoiDungModal').modal('show');
    });
}

// ================================ XOA MAU ================================
function xoaMauNoiDung(id) {
    if (confirm("Bạn có chắc muốn xóa (ẩn) mẫu này?")) {
        $.ajax({
            url: `/quan_li_noi_dung_hen/softdelete/${id}`,
            type: "PUT",
            success: function () {
                let maCLS = $('#id').val();

                loadMauNoiDung($('#idMaCLS').val());
            }
        });
    }
}

// ================================ TIM THEO TEN LOAI CLS ================================
function timCLSTheoTen(tenCanTim) {
    if (!tenCanTim) return null;

    // Nếu window.clsList là Array
    if (Array.isArray(window.clsList)) {
        return window.clsList.find(item => item.ten === tenCanTim) || null;
    }

    // Nếu window.clsList là Object
    for (const key in window.clsList) {
        if (window.clsList[key].ten === tenCanTim) {
            return window.clsList[key];
        }
    }
    return null;
}

// ================================ LOC CLS ================================
function locMauNoiDung() {
    const clsSearch = $('#maLoaiCLSSearch').val().trim();

    const clsObj = timCLSTheoTen(clsSearch);

    const $danhSachMau = $('#danhSachMau');
    console.log('Element found:', $danhSachMau.length > 0);

    if (clsObj) {
        console.log("Tìm thấy CLS:", clsObj);
        $('#danhSachMau').text(`Tất cả mẫu loại " ${clsObj.ten} "`);
        loadMauNoiDung(clsObj.ma, false)
        return;
    } 

    if (!clsObj) {
        console.log("Không tìm thấy CLS:", clsObj);
        $('#danhSachMau').text('Tât cả mẫu')
        loadMauNoiDung("", true);
        return;
    }

}

// ================================ VALIDATION ================================

function validateLoaiCLS() {

    const loaiCLS = $('#loaiCLSSearch').val().trim();
    // Kiểm tra rỗng
    if (!loaiCLS) {
        $('#loaiCLSSearch').addClass('is-invalid');
        $('#error-cls').text('Vui lòng chọn loại chuẩn lâm sàng!');
        return false;
    }

    // Tìm CLS theo tên
    const clsObj = timCLSTheoTen(loaiCLS);

    // Kiểm tra nếu không tìm thấy CLS
    if (!clsObj) {
        $('#loaiCLSSearch').addClass('is-invalid');
        $('#error-cls').text('Loại chuẩn lâm sàng không hợp lệ!');
        return false;
    }
    $('#loaiCLSSearch').removeClass('is-invalid');
    $('#error-cls').text('');
    return true;
}

function validateLoaiTenMau() {

    const tenMau = $('#tenMauNoiDung').val().trim();

    // Kiểm tra rỗng
    if (!tenMau) {
        $('#tenMauNoiDung').addClass('is-invalid');
        $('#error-tenMau').text('Vui lòng nhập tên mẫu!');
        return false;
    }

    $('#tenMauNoiDung').removeClass('is-invalid');
    $('#error-tenMau').text('');
    return true;
}

function validateLoaiHuongDan() {

    const huongDan = $('#huongDanNoiDung').val().trim();

    // Kiểm tra rỗng
    if (!huongDan) {
        $('#huongDanNoiDung').addClass('is-invalid');
        $('#error-huongDan').text('Vui lòng nhập hướng dẫn!');
        return false;
    }

    $('#huongDanNoiDung').removeClass('is-invalid');
    $('#error-huongDan').text('');
    return true;
}


// ======================================== PHAN TRANG =======================================
const rowsPerPage = 10; // Số dòng hiển thị mỗi trang

//paginateTable('mauNoiDungTable', 'pagination');
function paginateTable(tableId, paginationId) {
    // Đảm bảo table tồn tại
    const $table = $(`#${tableId}`);
    if ($table.length === 0) {
        console.error(`Table #${tableId} not found`);
        return;
    }

    // Lấy tất cả các dòng dữ liệu (trừ hàng thông báo)
    const $rows = $table.find('tbody tr:not(.no-records)');
    const totalRows = $rows.length;

    // Kiểm tra nếu không có dữ liệu
    if (totalRows === 0) {
        $table.find('tbody').html('<tr class="no-records"><td colspan="100" class="text-center">Không có dữ liệu</td></tr>');
        $(`#${paginationId}`).empty();
        $(`#${paginationId}`).append(`<div class="total-records">Tổng số bản ghi: 0</div>`);
        return;
    }

    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let currentPage = 1;

    // Hiển thị trang cụ thể
    const showPage = (page) => {
        currentPage = Math.max(1, Math.min(page, totalPages));
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        // Ẩn tất cả các dòng, sau đó hiển thị các dòng trong phạm vi
        $rows.hide().slice(start, end).show();

        // Cập nhật lại phân trang
        updatePaginationControls();
    };

    // Cập nhật controls phân trang
    const updatePaginationControls = () => {
        const $pagination = $(`#${paginationId}`);
        if ($pagination.length === 0) {
            console.error(`Pagination #${paginationId} not found`);
            return;
        }

        $pagination.empty();

        // Hiển thị tổng số bản ghi và thông tin trang
        $pagination.append(`
            <div class="pagination-infoo me-auto">
                <span class="total-records">Tổng số bản ghi: ${totalRows}</span>
                <span class="page-info px-4">Trang ${currentPage} / ${totalPages}</span>
            </div>
        `);

        // Tạo container cho các nút phân trang
        const $paginationList = $('<ul class="pagination pagination-sm pagination-center "></ul>');
        $pagination.append($paginationList);

        // Tạo nút First
        $paginationList.append(`
            <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="First" data-page="first">
                    <span aria-hidden="true">&laquo;&laquo;</span>
                </a>
            </li>
        `);

        // Tạo nút Previous
        $paginationList.append(`
            <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Previous" data-page="prev">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `);

        // Hiển thị các trang
        const maxVisible = 5; // Số trang tối đa hiển thị
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Điều chỉnh nếu gần đầu/cuối
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        // Thêm trang đầu tiên và dấu ... nếu cần
        if (startPage > 1) {
            $paginationList.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
                ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            `);
        }

        // Thêm các trang
        for (let i = startPage; i <= endPage; i++) {
            $paginationList.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Thêm trang cuối và dấu ... nếu cần
        if (endPage < totalPages) {
            $paginationList.append(`
                ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `);
        }

        // Tạo nút Next
        $paginationList.append(`
            <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Next" data-page="next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `);

        // Tạo nút Last
        $paginationList.append(`
            <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Last" data-page="last">
                    <span aria-hidden="true">&raquo;&raquo;</span>
                </a>
            </li>
        `);

        // Bind sự kiện click
        $pagination.off('click', '.page-link').on('click', '.page-link', function (e) {
            e.preventDefault();
            const action = $(this).data('page');

            if (action === 'first') {
                showPage(1);
            } else if (action === 'prev' && currentPage > 1) {
                showPage(currentPage - 1);
            } else if (action === 'next' && currentPage < totalPages) {
                showPage(currentPage + 1);
            } else if (action === 'last') {
                showPage(totalPages);
            } else if (!isNaN(action)) {
                showPage(parseInt(action));
            }
        });
    };

    // Khởi tạo hiển thị trang đầu tiên
    showPage(1);
} 