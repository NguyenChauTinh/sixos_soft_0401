$(document).ready(function () {
    // Tham chiếu các element
    const $btnXemLSKCB = $('#btnXemLSKCB');
    const $idBenhNhanInput = $('#idBenhNhanInput');
    const $lskcbContent = $('#lskcbContent');
    const $loadingIndicator = $('#loadingIndicator');
    const $alertMessage = $('#alertMessage');
    const $modalEl = $('#LSKCBModal');

    // Hàm hiển thị thông báo
    function displayAlert(message, type) {
        $alertMessage
            .removeClass('d-none alert-success alert-danger alert-warning')
            .addClass(`alert-${type}`)
            .text(message)
            .slideDown();

        setTimeout(() => {
            $alertMessage.slideUp().addClass('d-none');
        }, 4000);
    }

    // Sự kiện click nút xem lịch sử
    $btnXemLSKCB.on('click', function () {
        const idBenhNhan = $idBenhNhanInput.val()?.trim();

        if (!idBenhNhan || isNaN(idBenhNhan) || idBenhNhan <= 0) {
            displayAlert("Vui lòng nhập ID Bệnh Nhân hợp lệ (số > 0).", "warning");
            return;
        }

        // Làm sạch nội dung modal, hiển thị loading
        $lskcbContent.html('');
        $lskcbContent.html('');
        $loadingIndicator.removeClass('d-none');
        $btnXemLSKCB.prop('disabled', true).text('Đang tải...');
        $alertMessage.addClass('d-none');

        // Cập nhật ID trong modal (nếu có phần hiển thị ID)
        $('#modalBenhNhanId').text(idBenhNhan);

        // Khi modal hiển thị xong, mới gọi API (Bootstrap tự mở modal do HTML data-bs-toggle)
        $modalEl.one('shown.bs.modal', function () {
            // Chuẩn bị dữ liệu POST
            const postData = { IDBenhNhan: parseInt(idBenhNhan) };

            $.ajax({
                url: '/benh_nhan/benh_nhan_xem_lskcb',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                success: function (response) {
                    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                        renderLSKCBData(response.data);

                        console.log("Respone: ", response.data)
                    } else {
                        $lskcbContent.html('<div class="alert alert-info text-center">Không tìm thấy lịch sử khám chữa bệnh cho ID này.</div>');
                    }
                },
                error: function (xhr) {
                    const errorMsg = xhr.responseJSON?.message || "Lỗi không xác định khi gọi API.";
                    $lskcbContent.html(`<div class="alert alert-danger">Lỗi: ${errorMsg}</div>`);
                    displayAlert("Truy vấn thất bại: " + errorMsg, "danger");
                },
                complete: function () {
                    // Tắt loading và mở lại nút
                    $loadingIndicator.addClass('d-none');
                    $btnXemLSKCB.prop('disabled', false).text('Xem Lịch Sử Khám Chữa Bệnh');
                }
            });
        });
    });

    // Hàm render dữ liệu lịch sử KCB
    function renderLSKCBData(data) {
        const groupedData = data.reduce((acc, current) => {
            const key = current.ngayGioVaoVien;
            if (!acc[key]) {
                acc[key] = {
                    ngayGioVaoVien: current.ngayGioVaoVien,
                    tenKhoa: current.tenKhoa,
                    tenNhanVien: current.tenNhanVien,
                    maVaTenBenh: current.maVaTenBenh,
                    dichVuList: [],
                    thuocList: []
                };
            }

            // Nếu có dịch vụ
            if (current.tenDichVu) {
                acc[key].dichVuList.push({
                    tenDichVu: current.tenDichVu
                });
            }

            // Nếu có thuốc
            if (current.tenHangHoa) {
                acc[key].thuocList.push({
                    idToaThuoc: current.idToaThuoc,
                    tenHangHoa: current.tenHangHoa,
                    hoatChat: current.hoatChat,
                    tenDVT: current.tenDVT,
                    tongSoLuong: current.tongSoLuong,
                    isBHYT: current.isBHYT,
                    ngayHetThuoc: current.ngayHetThuoc
                });
            }

            return acc;
        }, {});

        const finalData = Object.values(groupedData);
        if (finalData.length === 0) {
            $lskcbContent.html('<div class="alert alert-info text-center">Không có dữ liệu lịch sử khám chữa bệnh.</div>');
            return;
        }

        let html = '';
        finalData.forEach((khambenh) => {
            html += `
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <div class="master-info border-bottom mb-3 pb-2">
                        <div class="row mb-2">
                            <div class="col-md-4"><strong class="text-primary">Ngày:</strong> ${formatDate(khambenh.ngayGioVaoVien)}</div>
                            <div class="col-md-4"><strong class="text-primary">Khoa:</strong> ${khambenh.tenKhoa || ''}</div>
                            <div class="col-md-4"><strong class="text-primary">Bác sĩ:</strong> ${khambenh.tenNhanVien || ''}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12"><strong class="text-primary">Chẩn đoán:</strong> ${khambenh.maVaTenBenh || ''}</div>
                        </div>
                    </div>

                    <div class="mt-3 pb-2"><strong class="text-primary ">Danh sách dịch vụ kỹ thuật:</strong> (${khambenh.dichVuList.length} dịch vụ)</div>
                    <div class="scrollable-detail">
                        <table class="table table-sm table-hover table-bordered mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-center" style="width: 5%;">STT</th>
                                    <th class="text-center">Tên dịch vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${khambenh.dichVuList.map((dv, i) => `
                                    <tr>
                                        <td class="text-center">${i + 1}</td>
                                        <td>${dv.tenDichVu || ''}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-3 pb-2"><strong class="text-primary">Thuốc:</strong></div>
                    <div class="scrollable-detail mt-2">
                        <table class="table table-sm table-hover table-bordered mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-center" style="width: 5%;">STT</th>
                                    <th class="text-center" style="width: 30%;">Tên thuốc</th>
                                    <th class="text-center" >Hoạt chất</th>
                                    <th class="text-center">DVT</th>
                                    <th class="text-center">SL</th>
                                    <th class="text-center">BHYT</th>
                                    <th class="text-center">Ngày hết thuốc</th>
                                 
                                </tr>
                            </thead>
                            <tbody>
                                ${(() => {
                                        const groupedThuoc = groupThuocByToa(khambenh.thuocList);
                                        let htmlRows = '';
                                        let toaCounter = 0;

                                        Object.entries(groupedThuoc).forEach(([toaId, list]) => {
                                            toaCounter++;
                                            htmlRows += `
                                            <tr class="table-secondary">
                                                <td colspan="8" class="fw-bold text-primary">Toa thuốc #${toaCounter}</td>
                                            </tr>
                                        `;

                                            list.forEach((thuoc, i) => {
                                                htmlRows += `
                                                <tr>
                                                    <td class="text-center">${i + 1}</td>
                                                    <td>${thuoc.tenHangHoa || ''}</td>
                                                    <td>${thuoc.hoatChat || ''}</td>
                                                    <td class="text-center">${thuoc.tenDVT || ''}</td>
                                                    <td class="text-center">${thuoc.tongSoLuong || ''}</td>
                                                    <td class="text-center">
                                                        <input type="checkbox" class="form-check-input" ${thuoc.isBHYT ? 'checked' : ''} disabled>
                                                    </td>
                                                    <td class="text-center">${formatDate(thuoc.ngayHetThuoc) || ''}</td>
                                                    
                                                </tr>
                                            `;
                                            });
                                        });

                                        return htmlRows;
                                    })()}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        `;
        });

        $lskcbContent.html(html);
    }

    function groupThuocByToa(data) {
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.idToaThuoc]) grouped[item.idToaThuoc] = [];
            grouped[item.idToaThuoc].push(item);
        });

        return grouped;
    }


    // Hàm định dạng ngày
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
});
