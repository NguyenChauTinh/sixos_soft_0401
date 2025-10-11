$(document).ready(function () {
    // Lấy tham chiếu đến Modal và các element
    const lskcbModal = new bootstrap.Modal(document.getElementById('LSKCBModal'));
    const $btnXemLSKCB = $('#btnXemLSKCB');
    const $idBenhNhanInput = $('#idBenhNhanInput');
    const $lskcbContent = $('#lskcbContent');
    const $loadingIndicator = $('#loadingIndicator');
    const $alertMessage = $('#alertMessage');

    // Hàm hiển thị thông báo
    function displayAlert(message, type) {
        $alertMessage.removeClass('d-none alert-success alert-danger alert-warning').addClass(`alert-${type}`).text(message).slideDown();
        setTimeout(() => {
            $alertMessage.slideUp().addClass('d-none');
        }, 5000);
    }

    // Hàm xử lý sự kiện click nút (Giữ nguyên)
    $btnXemLSKCB.on('click', function () {
        const idBenhNhan = $idBenhNhanInput.val();

        if (!idBenhNhan || idBenhNhan <= 0) {
            displayAlert("Vui lòng nhập ID Bệnh Nhân hợp lệ (lớn hơn 0).", "warning");
            return;
        }

        // Xóa nội dung cũ và hiển thị loading
        $lskcbContent.html('');
        $loadingIndicator.removeClass('d-none');
        $btnXemLSKCB.prop('disabled', true).text('Đang tải...');
        $alertMessage.addClass('d-none');
        $('#modalBenhNhanId').text(idBenhNhan);

        // Mở modal ngay lập tức để hiển thị loading
        lskcbModal.show();

        // Chuẩn bị dữ liệu POST
        const postData = {
            IDBenhNhan: parseInt(idBenhNhan) // Đảm bảo là kiểu số nguyên
        };

        // Gọi API sử dụng AJAX
        $.ajax({
            url: '/benh_nhan/benh_nhan_xem_lskcb', // URL của hàm Controller bạn đã viết
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (response) {
                if (response.success && response.data && response.data.length > 0) {
                    // Gọi hàm xử lý và đổ dữ liệu
                    renderLSKCBData(response.data);
                } else {
                    // Xử lý trường hợp không có dữ liệu
                    $lskcbContent.html('<div class="alert alert-info text-center">Không tìm thấy lịch sử khám chữa bệnh cho ID này.</div>');
                }
            },
            error: function (xhr) {
                // Xử lý lỗi API
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

    // Hàm nhóm dữ liệu và tạo nội dung cho modal (PHẦN QUAN TRỌNG ĐÃ SỬA ĐỔI)
    // Hàm tạo nội dung cho modal (ĐÃ SỬA ĐỔI ĐỂ PHẦN DETAIL CÓ THỂ CUỘN)
    function renderLSKCBData(data) {

        // Bước 1: Nhóm dữ liệu (Giữ nguyên logic nhóm)
        const groupedData = data.reduce((acc, current) => {
            // ... (Logic grouping giữ nguyên) ...
            const key = current.ngayGioVaoVien;
            if (!acc[key]) {
                acc[key] = {
                    ngayGioVaoVien: current.ngayGioVaoVien,
                    tenKhoa: current.tenKhoa,
                    tenNhanVien: current.tenNhanVien,
                    maVaTenBenh: current.maVaTenBenh,
                    dichVuList: []
                };
            }
            acc[key].dichVuList.push({
                tenDichVu: current.tenDichVu
            });
            return acc;
        }, {});

        const finalData = Object.values(groupedData);
        let html = '';

        if (finalData.length === 0) {
            $lskcbContent.html('<div class="alert alert-info text-center">Không tìm thấy lịch sử khám chữa bệnh.</div>');
            return;
        }

        finalData.forEach((khambenh, index) => {
            // Cấu trúc Master (Hàng đầu)
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
                                        <div class="col-12"><strong class="text-primary">Chẩn đoán: </strong> ${khambenh.maVaTenBenh || ''}</div>
                                    </div>
                                </div>

                                <h6 class="mt-3"> <strong class="text-primary">Danh sách dịch vụ kỹ thuật: </strong>(${khambenh.dichVuList.length} dịch vụ)</h6>
                                
                                <div class="scrollable-detail"> 
                                    <table class="table table-sm table-hover table-bordered mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="text-center" scope="col" style="width: 5%;">STT</th>
                                                <th class="text-center" scope="col">Tên dịch vụ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                    `;

            // Lặp qua các dịch vụ (Detail) đã được nhóm
            khambenh.dichVuList.forEach((dichvu, i) => {
                html += `
                            <tr>
                                <td class="text-center">${i + 1}</td>
                                <td>${dichvu.tenDichVu || ''}</td>
                            </tr>
                        `;
            });

            // Kết thúc bảng và card
            html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;
        });

        $lskcbContent.html(html);
    }

    // Hàm định dạng ngày tháng
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year}`;
    }

});