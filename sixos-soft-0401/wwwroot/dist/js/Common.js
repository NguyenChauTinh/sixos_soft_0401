var urlBlobs = [];
var iframe = document.getElementById("dialogPdf");
document.addEventListener("hidden.bs.modal", function (event) {
    for (var i = 0; i < urlBlobs.length; i++) {
        URL.revokeObjectURL(urlBlobs[i]);
    }
    urlBlobs = [];
});

// Đăng ký sự kiện ajaxError để xử lý lỗi 401
$(function () {
    $(document).ajaxError(function (event, jqXHR) {
        if (jqXHR.status === 401) {
            window.location.href = "/HeThong/HT_DangNhap/login";
        }

        if (jqXHR.status === 403) {
            let err = jqXHR.responseJSON;
            if (err && err.error == "MissingUserInfo") {
                window.location.href = "/HeThong/HT_ThongTinNguoiDung";
            }

            if (err && err.error == "MissingBranch") {
                window.location.href = "/HeThong/HT_DangNhap/select-branch";
            }
        }
    });
});

// Đăng ký sự kiện "afterprint"
window.addEventListener("afterprint", function () {
    for (var i = 0; i < urlBlobs.length; i++) {
        URL.revokeObjectURL(urlBlobs[i]);
    }
    urlBlobs = [];
});
// Hiện modalFullWidth từ layout

function showModalFullWidth(title, content, beforeShow, onClose) {
    $("#modal-title-fullwidth").html(title);
    $("#modal-body-fullwidth").empty();
    $("#modal-body-fullwidth").html(content);
    $("#modal-full-width").modal("show");

    if (typeof beforeShow === "function") {
        beforeShow();
    }
    // Nếu có callback onClose thì gắn sự kiện 'hidden.bs.modal'
    if (typeof onClose === "function") {
        // Tạo handler để tự động gỡ sau khi gọi xong
        let handler = function () {
            onClose();
            $("#modal-full-width").off("hidden.bs.modal", handler);
        };
        $("#modal-full-width").on("hidden.bs.modal", handler);
    }
}
function hideModalFullWidth() {
    $("#modal-full-width").modal("hide");
}
var modalFullWidth = document.getElementById("modal-full-width");
if (modalFullWidth) {
    modalFullWidth.addEventListener("hidden.bs.modal", function (event) {
        $("#modal-body-fullwidth")
            .find("select")
            .each(function () {
                if ($(this)[0].tomselect) {
                    $(this)[0].tomselect.destroy();
                }
            });

        $("#modal-body-fullwidth").empty();
        $("#modal-title-fullwidth").text("");
        $(this).find("*").off();
    });
}

function showModalFullScreen(title, content, beforeShow, onClose) {
    $(".modal-backdrop").remove();
    $("#modal-title-fullscreen").text(title);
    $("#modal-body-fullscreen").empty();
    $("#modal-body-fullscreen").html(content);
    $("#modal-full-screen").modal("show");
    if (typeof beforeShow === "function") {
        beforeShow();
    }
    // Nếu có callback onClose thì gắn sự kiện 'hidden.bs.modal'
    if (typeof onClose === "function") {
        // Tạo handler để tự động gỡ sau khi gọi xong
        let handler = function () {
            onClose();
            $("#modal-full-screen").off("hidden.bs.modal", handler);
        };
        $("#modal-full-screen").on("hidden.bs.modal", handler);
    }
}
var modalFullWidth = document.getElementById("modal-full-width");
if (modalFullWidth) {
    modalFullWidth.addEventListener("hidden.bs.modal", function (event) {
        $("#modal-body-fullscreen").empty();
        $("#modal-title-fullscreen").text("");
        $(this).find("*").off();
    });
}

// Hiện modalLargel từ layout
function showModalLargel(title, content, beforeShow, onClose) {
    $(".modal-backdrop").remove();
    $("#modal-title-largel").text(title);
    $("#modal-body-largel").empty();
    $("#modal-body-largel").append(content);
    $("#modal-largel").modal("show");
    if (typeof beforeShow === "function") {
        beforeShow();
    }
    // Nếu có callback onClose thì gắn sự kiện 'hidden.bs.modal'
    if (typeof onClose === "function") {
        // Tạo handler để tự động gỡ sau khi gọi xong
        let handler = function () {
            onClose();
            $("#modal-largel").off("hidden.bs.modal", handler);
        };
        $("#modal-largel").on("hidden.bs.modal", handler);
    }
}
function emptyModalLargel(title, content) {
    $("#modal-title-largel").text(title);
    $("#modal-body-largel").empty();
    $("#modal-body-largel").append(content);
}
function hideModalLargel() {
    $("#modal-largel").modal("hide");
}
function showModalDate(title) {
    var myModal = new bootstrap.Modal(
        document.getElementById("modal-date"),
        {}
    );
    $(".modal-backdrop").remove();
    $("#modal-title-date").text(title);
    myModal.show();
}
function showModalJustDate(title) {
    var myModal = new bootstrap.Modal(
        document.getElementById("modal-justDate"),
        {}
    );
    $(".modal-backdrop").remove();
    $("#modal-title-justDate").text(title);
    myModal.show();
}
function emptyModalDate(title) {
    $("#modal-title-date").text(title);
}
function hideModalDate() {
    $("#modal-date").modal("hide");
}
function showModalDialog(title, content, beforeShow, onClose) {
    $(".modal-backdrop").remove();
    $("#modal-title-dialog").text(title);
    $("#modal-body-dialog").empty();
    $("#modal-body-dialog").append(content);
    $("#modal-dialog-2-3").modal("show");
    if (typeof beforeShow === "function") {
        beforeShow();
    }
    // Nếu có callback onClose thì gắn sự kiện 'hidden.bs.modal'
    if (typeof onClose === "function") {
        // Tạo handler để tự động gỡ sau khi gọi xong
        let handler = function () {
            onClose();
            $("#modal-dialog-2-3").off("hidden.bs.modal", handler);
        };
        $("#modal-dialog-2-3").on("hidden.bs.modal", handler);
    }
}
function emptyModalDialog(title, content) {
    $("#modal-title-dialog").text(title);
    $("#modal-body-dialog").empty();
    $("#modal-body-dialog").append(content);
}
function hideModalDialog() {
    $("#modal-dialog-2-3").modal("hide");
}
var modalDiaLog = document.getElementById("modal-dialog-2-3");
if (modalDiaLog) {
    modalDiaLog.addEventListener("hidden.bs.modal", function (event) {
        $("#modal-body-dialog").empty();
        $("#modal-title-dialog").text("");
        $("#formDGUpdate").removeClass("was-validated");
    });
}
var modalLargel = document.getElementById("modal-largel");
if (modalLargel) {
    modalLargel.addEventListener("hidden.bs.modal", function (event) {
        $("#modal-body-largel").empty();
        $("#modal-title-largel").text("");
        $("#formUpdate").removeClass("was-validated");
    });
}

//Hiện toast từ layout
function showToast(message, statusCode) {
    var toast =
        $(`<div class="toast mb-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${statusCode == 200 ? "1250" : "2500"
            }">
            <div class="alert alert-important ${statusCode == 200 ? "alert-success" : "alert-danger"
            } alert-dismissible mb-0" role="alert">
                <div class="d-flex">
                    <div>
                        ${statusCode == 200
                ? `<svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>`
            }
                    </div>
                    <div>
                        ${message}
                    </div>
                </div>
                <a class="btn-close" data-bs-dismiss="toast" aria-label="close"></a>
            </div>
        </div>`);

    // Append toast to container
    $("#toast-container").append(toast);

    // Initialize toast
    toast.toast("show");

    // Remove toast after it's closed
    toast.on("hidden.bs.toast", function () {
        $(this).remove();
    });
}
function showToastWithBg(message, statusCode, backgrounColor) {
    var toast =
        $(`<div class="toast mb-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${statusCode == 200 ? "1250" : "2500"
            }">
            <div class="alert alert-important ${backgrounColor} alert-dismissible mb-0" role="alert">
                <div class="d-flex">
                    <div>
                        ${statusCode == 200
                ? `<svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>`
            }
                    </div>
                    <div>
                        ${message}
                    </div>
                </div>
                <a class="btn-close" data-bs-dismiss="toast" aria-label="close"></a>
            </div>
        </div>`);

    // Append toast to container
    $("#toast-container").append(toast);

    // Initialize toast
    toast.toast("show");

    // Remove toast after it's closed
    toast.on("hidden.bs.toast", function () {
        $(this).remove();
    });
}
// Ẩn thông báo
function hideToast() {
    $("#toast").hide();
    $("#toast").removeClass("bg-success");
    $("#toast").removeClass("bg-danger");
}
//Hiện quá trình tải trang
function showProgress() {
    $("#progress").show();
}
//Ẩn quá trình tải trang
function hideProgress() {
    $("#progress").hide();
}
function showProgressWithTable(table) {
    table.prepend(`<div class="progress">
                                        <div class="progress-bar progress-bar-indeterminate bg-blue"></div>
                                    </div>`);
}
//Ẩn quá trình tải trang
function hideProgressWithTable(table) {
    table.find(".progress").remove();
}
//Hiện modal xóa
function showModalDanger(content, beforeShow, onClose) {
    $("#modal-danger-content").html(content);
    $("#modal-footer").html(`<div b-27zrlt93sg="" class="w-100">
                        <div b-27zrlt93sg="" class="row">
                            <div b-27zrlt93sg="" class="col">
                                <a b-27zrlt93sg="" href="#" class="btn w-100" data-bs-dismiss="modal">
                                    Hủy
                                </a>
                            </div>
                            <div b-27zrlt93sg="" class="col">
                                <button b-27zrlt93sg="" id="btnDanger" class="btn btn-danger w-100" data-bs-dismiss="modal">
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>`);

    $("#modal-danger").modal("show");

    if (typeof beforeShow === "function") {
        beforeShow();
    }
    // Nếu có callback onClose thì gắn sự kiện 'hidden.bs.modal'
    if (typeof onClose === "function") {
        // Tạo handler để tự động gỡ sau khi gọi xong
        let handler = function () {
            onClose();
            $("#modal-danger").off("hidden.bs.modal", handler);
        };
        $("#modal-danger").on("hidden.bs.modal", handler);
    }
}
//Hiện modal xóa có thể thay đổi title
function showModalDangerCanChangeTitle(title, content, beforeShow, onClose) {
    $("#modal-danger-title").text(title);
    $("#modal-danger-content").html(content);
    $("#modal-footer").html(`<div b-27zrlt93sg="" class="w-100">
                        <div b-27zrlt93sg="" class="row">
                            <div b-27zrlt93sg="" class="col">
                                <a b-27zrlt93sg="" href="#" class="btn w-100" data-bs-dismiss="modal">
                                    Hủy
                                </a>
                            </div>
                            <div b-27zrlt93sg="" class="col">
                                <button b-27zrlt93sg="" id="btnDanger" class="btn btn-danger w-100" data-bs-dismiss="modal">
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>`);

    $("#modal-danger").modal("show");

    if (typeof beforeShow === "function") {
        beforeShow();
    }
    // Nếu có callback onClose thì gắn sự kiện 'hidden.bs.modal'
    if (typeof onClose === "function") {
        // Tạo handler để tự động gỡ sau khi gọi xong
        let handler = function () {
            onClose();
            $("#modal-danger").off("hidden.bs.modal", handler);
        };
        $("#modal-danger").on("hidden.bs.modal", handler);
    }
}
// hiện modal cảnh báo
function showModalWarning(content) {
    var myModal = new bootstrap.Modal(
        document.getElementById("modal-warning"),
        {}
    );
    $(".modal-backdrop").remove();
    $("#modal-warning-content").html(content);
    myModal.show();
}
var modalDanger = document.getElementById("modal-danger");
if (modalDanger) {
    modalDanger.addEventListener("hidden.bs.modal", function (event) {
        $("#btnDanger").off("click");
    });
}
//Config tìm kiếm trên dropdown
function configCb(datas, callback) {
    var requests = [];
    datas.forEach((data) => {
        var request = $.ajax({
            dataType: "json",
            url: data.url || jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var arr = [];
                if ($(this).prop("required")) {
                    arr = response.map((obj) => ({ ...obj }));
                } else {
                    arr = response;
                }
                var el = this;
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    valueField: "id",
                    labelField: "ten",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: arr,
                    openOnFocus: false,
                    searchField: ["ten", "ma", "viettat"],
                    render: {
                        option: function (item, escape) {
                            return (
                                '<div class="d-flex"><span style="width: 70%;">' +
                                escape(item.ten) +
                                '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                                escape(item.viettat) +
                                "]</span></div>"
                            );
                        },
                        no_results: function (data, escape) {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                    onFocus: function () {
                        if ($(el).attr("dropdown-top")) {
                            this.popper = Popper.createPopper(
                                this.control,
                                this.dropdown,
                                {
                                    placement: "top-start", // Điều chỉnh placement theo ý muốn
                                }
                            );
                        }
                    },
                };
                if (data.moreSetting) {
                    data.moreSetting(setting);
                }
                if (!el.tomselect) {
                    var mySelect = new TomSelect(el, setting);
                    mySelect.positionDropdown();

                    $(el)
                        .next()
                        .children("div.ts-control")
                        .on("click", function () {
                            mySelect.open();
                        });
                }
                if (data.callback) {
                    data.callback();
                }
            });
        });
        requests.push(request);
    });
    if (callback) {
        $.when
            .apply($, requests)
            .done(function () {
                callback();
            })
            .fail(function () {
                console.error("Lỗi JSON");
            });
    }
}
//Config tìm kiếm trên dropdown open top
function configCbTop(datas, callback) {
    var requests = [];
    datas.forEach((data) => {
        var request = $.ajax({
            dataType: "json",
            url: jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var arr = [];
                if ($(this).prop("required")) {
                    arr = response.map((obj) => ({ ...obj }));
                } else {
                    arr = response;
                }
                var el = this;
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    valueField: "id",
                    labelField: "ten",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: arr,
                    openOnFocus: false,
                    searchField: ["ten", "ma", "viettat"],
                    render: {
                        option: function (item, escape) {
                            return (
                                `<div class="d-flex"><span style="width: 70%;">` +
                                escape(item.ten) +
                                '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                                escape(item.viettat) +
                                "]</span></div>"
                            );
                        },
                        no_results: function () {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                    onFocus: function () {
                        // giữ cho chắc Popper được tạo khi focus
                        if (!this.popper) {
                            this.popper = Popper.createPopper(
                                this.control,
                                this.dropdown,
                                {
                                    placement: "top-start",
                                }
                            );
                        } else {
                            this.popper.update();
                        }
                    },
                };

                if (data.moreSetting) {
                    data.moreSetting(setting);
                }

                if (!el.tomselect) {
                    var mySelect = new TomSelect(el, setting);

                    // 🔥 Lưu lại hàm gốc
                    var originalPositionDropdown = mySelect.positionDropdown;

                    // Ghi đè, vừa gọi gốc vừa ép Popper top
                    mySelect.positionDropdown = function () {
                        // gọi lại logic gốc của TomSelect
                        originalPositionDropdown.call(this);

                        // ép dùng Popper top-start
                        if (!this.popper) {
                            this.popper = Popper.createPopper(
                                this.control,
                                this.dropdown,
                                {
                                    placement: "top-start",
                                }
                            );
                        } else {
                            this.popper.update();
                        }
                    };

                    $(el)
                        .next()
                        .children("div.ts-control")
                        .on("click", function () {
                            mySelect.open();
                        });

                    if (data.callback) {
                        data.callback(mySelect);
                    }
                }
            });
        });
        requests.push(request);
    });
    if (callback) {
        $.when
            .apply($, requests)
            .done(function () {
                callback();
            })
            .fail(function () {
                console.error("Lỗi JSON");
            });
    }
}


//config với "valueField: mã"
function configCbWithCode(datas, callback) {
    var requests = [];
    datas.forEach((data) => {
        var request = $.ajax({
            dataType: "json",
            url: jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var arr = [];
                if ($(this).prop("required")) {
                    arr = response.map((obj) => ({ ...obj }));
                } else {
                    arr = response;
                }
                var el = this;
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    valueField: "ma",
                    labelField: "ten",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: arr,
                    openOnFocus: false,
                    searchField: ["ten", "ma", "viettat"],
                    render: {
                        option: function (item, escape) {
                            return (
                                '<div class="d-flex"><span style="width: 70%;">' +
                                escape(item.ten) +
                                '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                                escape(toEmpty(item.viettat)) +
                                "]</span></div>"
                            );
                        },
                        no_results: function (data, escape) {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                };
                var mySelect = new TomSelect(el, setting);
                mySelect.positionDropdown();

                $(el)
                    .next()
                    .children("div.ts-control")
                    .on("click", function () {
                        mySelect.open();
                    });
                if (data.callback) {
                    data.callback();
                }
            });
        });
        requests.push(request);
    });
    if (callback) {
        $.when
            .apply($, requests)
            .done(function () {
                callback();
            })
            .fail(function () {
                console.error("Lỗi JSON");
            });
    }
}

function configCbWithOption(elements, options) {
    elements.forEach((el) => {
        let settings = {
            valueField: "ma",
            searchField: [
                { field: "ma", weight: 2 },
                { field: "ten", weight: 0.5 },
            ],
            allowEmptyOption: true,
            options: options,
            selectOnTab: true,
            render: {
                option: function (data, escape) {
                    return (
                        "<div>" +
                        '<span class="title text-black">[' +
                        escape(data.ma) +
                        "] - </span>" +
                        '<span class="title">' +
                        escape(data.ten) +
                        "</span>" +
                        "</div>"
                    );
                },
                item: function (data, escape) {
                    return "<div class=''>" + escape(data.ten) + "</div> ";
                },
            },
        };
        new TomSelect(el, settings);
    });
}
function configCbWithOptionId(elements, options) {
    $(elements.className).each(function () {
        var arr = [];
        if ($(this).prop("required")) {
            arr = options.map((obj) => ({ ...obj }));
        } else {
            arr = options;
        }
        var el = this;
        let setting = {
            selectOnTab: true,
            loadingClass: "Đang tìm kiếm...",
            valueField: "id",
            labelField: "ten",
            placeholder: elements.placeholder,
            options: arr,
            openOnFocus: false,
            searchField: ["ten", "ma", "viettat"],
            render: {
                option: function (item, escape) {
                    return (
                        '<div class="d-flex"><span style="width: 70%;">' +
                        escape(item.ten) +
                        '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                        escape(item.viettat) +
                        "]</span></div>"
                    );
                },
                no_results: function (data, escape) {
                    return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                },
            },
            loadThrottle: 400,
        };
        var mySelect = new TomSelect(el, setting);
        mySelect.positionDropdown();

        $(el)
            .next()
            .children("div.ts-control")
            .on("click", function () {
                mySelect.open();
            });
    });
}
function configCbBenhAn(datas, callback) {
    var requests = [];
    datas.forEach((data) => {
        var request = $.ajax({
            dataType: "json",
            url: jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var el = this;
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    valueField: "ma",
                    labelField: "ten",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: response,
                    openOnFocus: false,
                    searchField: ["ten", "ma", "viettat"],
                    render: {
                        no_results: function (data, escape) {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                };
                var mySelect = new TomSelect(el, setting);
                mySelect.positionDropdown();

                $(el)
                    .next()
                    .children("div.ts-control")
                    .on("click", function () {
                        mySelect.open();
                    });
                if (data.callback) {
                    data.callback();
                }
            });
        });
        requests.push(request);
    });
    if (callback) {
        $.when
            .apply($, requests)
            .done(function () {
                callback();
            })
            .fail(function () {
                console.error("Lỗi JSON");
            });
    }
}
function configCbWithMa(datas) {
    datas.forEach((data) => {
        $.ajax({
            dataType: "json",
            url: jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var el = this;
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    maxOptions: 50,
                    valueField: "ma",
                    labelField: "ten",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: response,
                    openOnFocus: false,
                    searchField: ["ma", "ten"],
                    render: {
                        option: function (item, escape) {
                            return (
                                '<div class="d-flex"><span style="width: 70%;">' +
                                escape(item.ten) +
                                '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                                escape(item.ma) +
                                "]</span></div>"
                            );
                        },
                        no_results: function (data, escape) {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                };
                var mySelect = new TomSelect(el, setting);
                mySelect.positionDropdown();

                $(el)
                    .next()
                    .children("div.ts-control")
                    .on("click", function () {
                        mySelect.open();
                    });
            });
        });
    });
}
//Config chọn ngày
function configDate() {
    $(".input-date").datetimepicker({
        locale: "vi",
        format: "DD-MM-yyyy",
        useStrict: true,
        widgetPositioning: {
            horizontal: "auto",
            vertical: "bottom",
        },
        extraFormats: ["DD-MM-yyyy", "DD/MM/yyyy", "yyyy"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        showClose: true,
    });
}
function configDateDefault() {
    var today = new Date();
    $(".input-date-default").datetimepicker({
        locale: "vi",
        useStrict: true,
        defaultDate: today,
        format: "DD-MM-yyyy",
        extraFormats: ["DD-MM-yyyy", "DD/MM/yyyy", "yyyy"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        showClose: true,
    });
}
document.addEventListener("DOMContentLoaded", function () {
    // Get the modal
    var modal = document.getElementById("imageModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementsByClassName("image-modal");
    var modalImg = document.getElementById("imageHHModal");
    var captionText = document.getElementById("imageModelCaption");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("closeImageModal")[0];

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        };
    }

    $(document).on("click", ".image-modal", function (e) {
        e.stopPropagation();
        e.preventDefault();
        const imgG = new Image();
        imgG.src = $(this).attr("src");

        imgG.onload = function () {
            modal.style.display = "block";
            modalImg.src = imgG.src;
            captionText.innerHTML = imgG.alt;
        };
    });
    $("#TimKiemChucNang").on("focus", function () {
        $(this).nextAll(".input-icon-addon").addClass("text-black");
        $(this).nextAll(".input-icon-addon").removeClass("text-white");
    });
    $("#TimKiemChucNang").on("blur", function () {
        $(this).nextAll(".input-icon-addon").addClass("text-white");
        $(this).nextAll(".input-icon-addon").removeClass("text-black");
    });
    $("#TimKiemChucNang").on("keydown", function (event) {
        var value = removeAccents($(this).val().toLowerCase());
        var listItem = $("#divDropdownSearch .list-group-item");
        listItem.filter(function () {
            var have =
                removeAccents($(this).text().toLowerCase()).indexOf(value) > -1;
            $(this).toggle(have);
        });
        if (
            event.keyCode === 40 ||
            event.keyCode === 38 ||
            event.keyCode === 13 ||
            event.keyCode === 39 ||
            event.keyCode === 37
        ) {
            var itemActive = $("#divDropdownSearch .list-group-item.active");
            // nhấn xuống dưới
            if (event.keyCode === 40) {
                // nếu chưa có cái nào active
                if (!listItem.hasClass("active")) {
                    $(
                        "#divDropdownSearch .list-group-item:visible:first"
                    ).addClass("active");
                } else {
                    if (
                        itemActive[0] !=
                        $(
                            "#divDropdownSearch .list-group-item:visible"
                        ).last()[0]
                    ) {
                        var nextActive = itemActive.nextAll(":visible").first();
                        nextActive.addClass("active");
                        itemActive.removeClass("active");
                        updatePositionCardDropdownSearch(nextActive);
                    }
                }
            }

            if (event.keyCode === 38) {
                if (
                    itemActive[0] !=
                    $("#divDropdownSearch .list-group-item:visible").first()[0]
                ) {
                    var prevActive = itemActive.prevAll(":visible").first();
                    prevActive.addClass("active");
                    itemActive.removeClass("active");
                    updatePositionCardDropdownSearch(prevActive);
                }
            }
            if (event.keyCode === 13) {
                if (itemActive.length > 0) {
                    window.location.href = itemActive.find("a").prop("href");
                }
            }
        } else {
            $("#divDropdownSearch .list-group-item").removeClass("active");
        }
    });
    function updatePositionCardDropdownSearch(element) {
        if (element.length > 0) {
            var scrollableContainer = $("#cardDropdownSearch");
            var containerScrollTop = scrollableContainer.scrollTop();
            var elementTop = element.position().top;
            scrollableContainer.scrollTop(containerScrollTop + elementTop);
        }
    }

    $("input").prop("autocomplete", "off");
    $("textarea").prop("autocomplete", "off");
    $(document).on("click", "tbody tr", function (event) {
        event.stopPropagation();
        if (!$(this).hasClass("table-active")) {
            $(this).parent().children().removeClass("table-active");
            $(this).addClass("table-active");
        }
    });

    $(document).on(
        "focus",
        ".input-date-default, .input-date, .input-date-long-mask, .input-date-short-mask, .input-time-short-mask",
        function () {
            if ($(this).val() != "") {
                this.setSelectionRange(0, 2);
            }
        }
    );
    $(document).on("focus", ".input-date-time-short-mask", function () {
        if ($(this).val() != "") {
            this.setSelectionRange(9, 11);
        }
    });
    $(document).on("click", ".input-date-default, .input-date", function () {
        var index = this.selectionStart;
        if (index >= 0 && index <= 2) {
            this.setSelectionRange(0, 2);
        } else if (index >= 3 && index <= 5) {
            this.setSelectionRange(3, 5);
        } else if (index >= 3 && index <= 5) {
            this.setSelectionRange(3, 5);
        } else if (index >= 6 && index <= 10) {
            this.setSelectionRange(6, 10);
        }
    });
    $(document).on("input", ".input-date-default, .input-date", function () {
        if (this.selectionStart == 2) {
            this.setSelectionRange(3, 5);
        }
        if (this.selectionStart == 5) {
            this.setSelectionRange(6, 10);
        }
    });
    $(document).on(
        "keydown",
        ".input-date-default, .input-date",
        function (event) {
            var input = this;
            if (event.key === "ArrowLeft") {
                var index = input.selectionStart;
                if (index === 3) {
                    input.setSelectionRange(0, 2);
                    event.preventDefault();
                } else if (index === 6) {
                    input.setSelectionRange(3, 5);
                    event.preventDefault();
                }
            }
            if (event.key === "ArrowRight") {
                var index = input.selectionEnd;

                if (index === 2) {
                    input.setSelectionRange(3, 5);
                    event.preventDefault();
                } else if (index === 5) {
                    input.setSelectionRange(6, 10);
                    event.preventDefault();
                }
            }
        }
    );

    $(document).on(
        "focus",
        ".input-date-time-default, .input-date-time",
        function () {
            if ($(this).val() != "") {
                this.setSelectionRange(0, 2);
            }
        }
    );
    $(document).on(
        "click",
        ".input-date-time-default, .input-date-time",
        function () {
            var index = this.selectionStart;
            if (index >= 0 && index <= 2) {
                this.setSelectionRange(0, 2);
            } else if (index >= 3 && index <= 5) {
                this.setSelectionRange(3, 5);
            } else if (index >= 3 && index <= 5) {
                this.setSelectionRange(3, 5);
            } else if (index >= 6 && index <= 10) {
                this.setSelectionRange(6, 10);
            } else if (index >= 11 && index <= 13) {
                this.setSelectionRange(11, 13);
            } else if (index >= 14 && index <= 16) {
                this.setSelectionRange(14, 16);
            }
        }
    );
    $(document).on(
        "input",
        ".input-date-time-default, .input-date-time",
        function () {
            if (this.selectionStart == 2) {
                this.setSelectionRange(3, 5);
            }
            if (this.selectionStart == 5) {
                this.setSelectionRange(6, 10);
            }
            if (this.selectionStart == 10) {
                this.setSelectionRange(11, 13);
            }
            if (this.selectionStart == 13) {
                this.setSelectionRange(14, 16);
            }
        }
    );
    $(document).on(
        "keydown",
        ".input-date-time-default, .input-date-time",
        function (event) {
            var input = this;
            if (event.key === "ArrowLeft") {
                var index = input.selectionStart;
                if (index === 3) {
                    input.setSelectionRange(0, 2);
                    event.preventDefault();
                } else if (index === 6) {
                    input.setSelectionRange(3, 5);
                    event.preventDefault();
                } else if (index === 11) {
                    input.setSelectionRange(6, 10);
                    event.preventDefault();
                } else if (index === 14) {
                    input.setSelectionRange(11, 13);
                    event.preventDefault();
                }
            }
            if (event.key === "ArrowRight") {
                var index = input.selectionEnd;
                if (index === 2) {
                    input.setSelectionRange(3, 5);
                    event.preventDefault();
                } else if (index === 5) {
                    input.setSelectionRange(6, 10);
                    event.preventDefault();
                } else if (index === 10) {
                    input.setSelectionRange(11, 13);
                    event.preventDefault();
                } else if (index === 13) {
                    input.setSelectionRange(14, 16);
                    event.preventDefault();
                }
            }
        }
    );

    $(document).on("change", 'form input[type="checkbox"]', function () {
        var isChecked = $(this).is(":checked");
        $(this).val(isChecked);
    });
    $(document).on("input", "#content textarea", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
});
function configDateTimeDefault() {
    var today = new Date();
    $(".input-date-time-default").datetimepicker({
        locale: "vi",
        useStrict: true,
        defaultDate: today,
        format: "DD-MM-yyyy HH:mm",
        extraFormats: ["DD-MM-yyyy HH:mm", "DD/MM/yyyy HH:mm", "yyyy"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        sideBySide: true,
        showClose: true,
    });
}

function configDateTime() {
    $(".input-date-time").datetimepicker({
        locale: "vi",
        useStrict: true,
        format: "DD-MM-yyyy HH:mm",
        extraFormats: ["DD-MM-yyyy HH:mm", "DD/MM/yyyy HH:mm", "yyyy"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        sideBySide: true,
        showClose: true,
    });
}

function configDateTimeMin() {
    $(".input-date-time-min").datetimepicker({
        locale: "vi",
        useStrict: true,
        format: "DD-MM-yy HH:mm",
        extraFormats: ["DD-MM-yy HH:mm", "DD/MM/yy HH:mm", "yy"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        sideBySide: true,
        showClose: true,
    });
}

function configTime() {
    $(".input-time").datetimepicker({
        locale: "vi",
        useStrict: true,
        format: "HH:mm",
        extraFormats: ["HH:mm", "HH:mm"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        showClose: true,
    });
}
function configTimeDefault() {
    var today = new Date();
    $(".input-time-default").datetimepicker({
        locale: "vi",
        useStrict: true,
        defaultDate: today,
        format: "HH:mm",
        extraFormats: ["HH:mm", "HH:mm"],
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        showClose: true,
    });
}
function configDateMask() {
    $(".input-date-mask").inputmask({
        alias: "datetime",
        inputFormat: "dd-mm-yyyy",
        placeholder: "__-__-____",
    });
}
function configDateShortMask() {
    $(".input-date-short-mask").inputmask({
        alias: "datetime",
        inputFormat: "dd-mm-yy",
        placeholder: "__-__-__",
    });
}

function configDateTimeMask() {
    $(".input-date-time-mask").inputmask({
        alias: "datetime",
        inputFormat: "dd-mm-yyyy HH:MM",
        placeholder: "__-__-____ __:__",
    });
}
function configDateMaskWithElement(el, format, pla) {
    el.inputmask({
        alias: "datetime",
        inputFormat: format,
        placeholder: pla,
    });
}
function configDateWithElement(el, format, date) {
    if (date) {
        el.val(date);
    }
    el.datetimepicker({
        locale: "vi",
        useStrict: true,
        format: format,
        icons: {
            date: "ti ti-calendar",
            up: "ti ti-chevron-up",
            down: "ti ti-chevron-down",
            previous: "ti ti-chevron-left",
            next: "ti ti-chevron-right",
            time: "ti ti-alarm",
            close: "ti ti-x",
        },
        keyBinds: {
            left: null,
            right: null,
        },
        sideBySide: true,
        showClose: true,
    });
}
function configTimeMask() {
    $(".input-time-mask").inputmask({
        alias: "datetime",
        inputFormat: "HH:MM",
        placeholder: "__:__",
    });
}
function configDateTimeShortMask() {
    $(".input-date-time-short-mask").inputmask({
        alias: "datetime",
        inputFormat: "dd-mm-yy HH:MM",
        placeholder: "__-__-__ __:__",
    });
}
function configDateTimeShortMaskwithElement(element) {
    element.inputmask({
        alias: "datetime",
        inputFormat: "dd-mm-yy HH:MM",
        placeholder: "__-__-__ __:__",
    });
}
function configDateLongMask() {
    $(".input-date-long-mask").inputmask({
        alias: "datetime",
        inputFormat: "dd-mm-yyyy",
        placeholder: "__-__-__",
    });
}

function configTimeShortMask() {
    $(".input-time-short-mask").inputmask({
        alias: "datetime",
        inputFormat: "HH:MM",
        placeholder: "__:__",
    });
}
function configTimeShortMaskWithElement(el) {
    el.inputmask({
        alias: "datetime",
        inputFormat: "HH:MM",
        placeholder: "__:__",
    });
}

/*function showPageloader() {
  $("#Pageloader").addClass("show");
  $("#Pageloader").css("z-index", "10");
}
function hidePageloader() {
  $("#Pageloader").removeClass("show");
  $("#Pageloader").css("z-index", "-1");
}
*/
function showAlert(message, bg) {
    $("#alert").addClass(bg);
    $("#alert").show();
    $("#messageAlert").text(message);
}

function queryStringToData(queryString) {
    // Phân tích cú pháp và xử lý chuỗi query string
    var params = new URLSearchParams(queryString);
    var jsonData = {};

    // Lặp qua các cặp key-value trong chuỗi query string
    for (var pair of params.entries()) {
        var key = pair[0];
        var value = pair[1];

        // Gán giá trị vào đối tượng JSON
        jsonData[key] = value?.trim();
    }
    return jsonData;
}
// function downLoadFile(file, fileName) {
//   var a = document.createElement('a');
//             var url = window.URL.createObjectURL(file);
//             a.href = url;
//             a.download = fileName;
//             document.body.appendChild(a);
//             a.click();
//             setTimeout(function () {
//                 document.body.removeChild(a);
//                 window.URL.revokeObjectURL(url);
//             }, 0);
// }

function formatDay(inputString) {
    if (inputString) {
        var inputDate = new Date(inputString);
        var day = inputDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month = inputDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var year = inputDate.getFullYear();
        return day + "-" + month + "-" + year;
    } else {
        return "";
    }
}
function formatDayTime(inputString) {
    if (inputString) {
        var inputDate = new Date(inputString);
        var day = inputDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month = inputDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var year = inputDate.getFullYear();
        var hour = inputDate.getHours();
        if (hour < 10) {
            hour = "0" + hour;
        }
        var minute = inputDate.getMinutes();
        if (minute < 10) {
            minute = "0" + minute;
        }
        return day + "-" + month + "-" + year + " " + hour + ":" + minute;
    } else {
        return "";
    }
}
function formatDateTimeShort(inputString) {
    if (inputString) {
        var inputDate = new Date(inputString);
        var day = inputDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month = inputDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var year = inputDate.getFullYear().toString().padStart(2, "0");
        var hour = inputDate.getHours();
        if (hour < 10) {
            hour = "0" + hour;
        }
        var minute = inputDate.getMinutes();
        if (minute < 10) {
            minute = "0" + minute;
        }
        return day + "-" + month + "-" + year + " " + hour + ":" + minute;
    } else {
        return "";
    }
}
function formatSoftDate(inputString) {
    if (inputString) {
        var inputDate = new Date(inputString);
        var day = inputDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month = inputDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var year = inputDate.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm
        return day + "-" + month + "-" + year;
    }
}
function formatDateTime(inputDate) {
    if (inputDate) {
        const date = new Date(inputDate);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } else {
        return "";
    }
}

//input: DateTime -> output: DD-MM-YY HH:mm
function formatDateTimeShort(inputDate) {
    if (inputDate) {
        const date = new Date(inputDate);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } else {
        return "";
    }
}

//input: DD-MM-YYYY HH:mm -> output: DD-MM-YY HH:mm
function formatDateTimeShortWithNotDateTime(inputDate) {
    if (inputDate) {
        const dateParts = inputDate.split(" ");
        const datePart = dateParts[0]; // Phần ngày tháng năm
        const timePart = dateParts[1]; // Phần giờ phút

        const dateComponents = datePart.split("-");
        const day = dateComponents[0];
        const month = dateComponents[1];
        const year = dateComponents[2].slice(-2); // Lấy hai số cuối của năm

        return `${day}-${month}-${year} ${timePart}`;
    } else {
        return "";
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatTime(inputDate) {
    if (inputDate) {
        const date = new Date(inputDate);

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${hours}:${minutes}`;
    } else {
        return "";
    }
}
// format lại số lúc nhập thành dạng 100,000,000
function formatNumberInput() {
    // Áp dụng inputmask cho các phần tử có lớp 'formatted-number' và giá trị khác 0
    $(".formatted-number").each(function () {
        $(this).inputmask({
            alias: "numeric",
            groupSeparator: ",",
            autoGroup: true,
            digits: 0,
            allowMinus: false,
            digitsOptional: false,
            placeholder: "",
            // Định dạng đặc biệt nếu giá trị là 0
            onBeforeMask: function (value, opts) {
                if (value === "0") {
                    return "0\\";
                }
                return value;
            },
        });
    });
}
// format lại số lúc nhập thành dạng 100,000,000.00
function formatNumber() {
    $(".formatted-number-float").inputmask({
        alias: "numeric",
        radixPoint: ".",
        groupSeparator: ",",
        autoGroup: true,
        digits: 2,
        digitsOptional: true,
        allowMinus: false,
        prefix: "",
        placeholder: "",
    });
}
// format lại số lúc nhập thành dạng 100,000,000.00
function formatNumberDigitThree(number) {
    if (number) {
        if (Number.isInteger(number)) {
            return number.toLocaleString("en-US");
        } else {
            return number.toLocaleString("en-US", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
            });
        }
    } else {
        return "";
    }
}
/// không cho phép nhập chữ
function formatOnlyNumber() {
    $(".number-only").inputmask({
        alias: "integer", // Sử dụng alias "integer" thay vì "numeric"
        radixPoint: "", // Xóa dấu thập phân
        autoGroup: false, // Không sử dụng dấu phân cách
        digits: 0, // Số chữ số tối đa sau dấu thập phân (0 để không có số thập phân)
        allowMinus: true,
        prefix: "",
        placeholder: "",
    });
}

function formatNumberWithElement(inputs) {
    inputs.each(function () {
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var placeholder = $(this).attr("placeholder");
        var input = $(this).inputmask({
            alias: "numeric",
            radixPoint: ".",
            groupSeparator: ",",
            autoGroup: true,
            digits: 0,
            digitsOptional: true,
            allowMinus: false,
            prefix: "",
            min: min ? parseFloat(min) : 0,
            max: parseFloat(max),
            placeholder: "",
        });
        input.on("blur", function () {
            $(this).trigger("keyup");
        });
    });
}
// format lại số lúc nhập thành dạng 100,000,000.00
function formatNumberFloatWithElement(inputs) {
    inputs.each(function () {
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var placeholder = $(this).attr("placeholder");
        var input = $(this).inputmask({
            alias: "numeric",
            radixPoint: ".",
            groupSeparator: ",",
            autoGroup: true,
            digits: 2,
            digitsOptional: true,
            allowMinus: false,
            prefix: "",
            min: min ? parseFloat(min) : 0,
            max: parseFloat(max),
            placeholder: "",
        });
        input.on("blur", function () {
            $(this).trigger("keyup");
        });
    });
}
function formatNumberDigit3WithElement(inputs) {
    inputs.each(function () {
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var placeholder = $(this).attr("placeholder");
        var input = $(this).inputmask({
            alias: "numeric",
            radixPoint: ".",
            groupSeparator: ",",
            autoGroup: true,
            digits: 3,
            digitsOptional: true,
            allowMinus: false,
            prefix: "",
            min: min ? parseFloat(min) : 0,
            max: parseFloat(max),
            placeholder: "",
        });
        var lamTron = $(this).data("lamtron");
        input.on("blur", function () {
            $(this).trigger("keyup");
            let val = parseFloat($(this).inputmask("unmaskedvalue"));
            //if (val && lamTron && lamTron > 0 && (val %1 != 0)) {
            if (val && lamTron && lamTron > 0) {
                $(this).val(val.toFixed(lamTron));
            }
        });
    });
}
function formatNumberWithElementDk(inputs) {
    inputs.each(function () {
        $(this).inputmask({
            alias: "numeric",
            radixPoint: ".",
            groupSeparator: ",",
            autoGroup: true,
            digits: 2,
            digitsOptional: true,
            allowMinus: false,
            prefix: "",
            placeholder: "",
            min: 100,
        });
    });
}
// 1,000,000
function formatEvenNumber(number) {
    if (number == null) return 0;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function layChuoiChucVu(chucVu) {
    if (!chucVu || typeof chucVu !== "object") {
        return "";
    }
    return Object.values(chucVu)
        .filter((value) => value && value.trim() != "")
        .join(", ");
}

// 1,000,000.00
function formatOddNumber(number) {
    if (number) {
        if (Number.isInteger(number)) {
            return number.toLocaleString("en-US");
        } else {
            return number.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    } else {
        return "";
    }
}
function formatOddNumberToZero(number) {
    if (number) {
        if (Number.isInteger(number)) {
            return number.toLocaleString("en-US");
        } else {
            return number.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    } else {
        return 0;
    }
}

function showInputIconSpinner(element) {
    $(element)
        .parent(".input-icon")
        .find(".input-icon-addon")
        .html(
            '<div class="spinner-border spinner-border-sm text-muted" role="status"></div>'
        );
}
function hideInputIconSearchSpinner(element) {
    $(element)
        .parent(".input-icon")
        .find(".input-icon-addon")
        .html(
            '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>'
        );
}

function getDateTimeNow() {
    // Lấy ngày giờ hiện tại
    var currentDate = new Date();

    // Lấy các thành phần ngày, tháng, năm, giờ và phút
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, cần +1 để đúng
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    // Chuyển đổi thành định dạng "dd-MM-yyyy HH:mm"
    return (
        ("0" + day).slice(-2) +
        "-" +
        ("0" + month).slice(-2) +
        "-" +
        year +
        " " +
        ("0" + hours).slice(-2) +
        ":" +
        ("0" + minutes).slice(-2)
    );
}

function getDateNow() {
    // Lấy ngày giờ hiện tại
    var currentDate = new Date();

    // Lấy các thành phần ngày, tháng và năm
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // Ghi chú: Tháng trong JavaScript bắt đầu từ 0
    var year = currentDate.getFullYear();

    // Định dạng chuỗi ngày tháng
    return (
        (day < 10 ? "0" : "") +
        day +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        year
    );
}

function clearForm(formName) {
    var form = $("#" + formName);
    // các input text = ""
    form.find("input.form-control").val("");
    form.find("textarea").text("");
    form.find("textarea").val("");

    form.find('input[type="text"][readonly].form-control.input-date-time').val(
        ""
    );
    form.find('input[type="text"].form-control.input-date-time').val(
        getDateTimeNow()
    );

    form.find('input[type="text"][readonly].form-control.input-date').val("");
    form.find('input[type="text"].form-control.input-date').val();
    form.find('input[type="text"].form-control.input-date-default').val(
        getDateNow()
    );
    form.find('input[type="text"].form-control.input-date-time-default').val(
        getDateTimeNow()
    );
    var selects = document.getElementById(formName).querySelectorAll("select");

    selects.forEach(function (select) {
        if (select.tomselect) {
            select.tomselect.clear();
        } else {
            select.selectedIndex = 0;
        }
    });

    form.find('input[type="checkbox"]')
        .prop("checked", false)
        .trigger("change");
    form.find('input[type="checkbox"]').val("false");
}

function getFirstChar(str) {
    if (str == "") {
        return "";
    }
    // Tách các từ trong tên
    var nameParts = str.split(" ").filter((part) => part.trim() !== "");

    // Lấy chữ cái đầu của mỗi từ và kết hợp thành chuỗi viết tắt
    var abbreviation = nameParts.map((name) => name[0]).join("");

    // Chuyển thành chữ hoa
    abbreviation = abbreviation.toUpperCase().replace(/Đ/g, "D");

    var normalized = abbreviation.normalize("NFD");
    var output = Array.from(normalized)
        .filter((c) => !/[.,;!?]/.test(c))
        .join("");
    var outp = output.split("(").filter((part) => part.trim() !== "");
    return outp[0].replace("-", "");
}

// hàm viết tắt
// để sử dụng hàm này đặt id = "inputGoiY" và data-idvitri được quy định sẵn
let selectedSuggestionIndex = -1;
let activeSuggestionIndex = -1;
var Suggestions = [];
var inputElement;
var maxLength = 1;

function showSuggestions() {
    $(document).on("input", ".inputGoiY", function () {
        var inputValue = $(this).val().trim(); // Lấy giá trị đang nhập trong ô input
        var IdViTri = $(this).data("idvitri"); // Lấy data-IDViTri của ô input
        // Cắt khoảng trắng ở đầu và cuối chuỗi
        Suggestions = [];
        // Lấy ô input đang được thao tác
        var input = $(this);
        // Chuyển ô input thành đối tượng trong DOM
        inputElement = input[0];
        // Kiểm tra nếu người dùng nhập các ký tự ",", "." thì chỉ xét từ sau dấu ","
        if (inputValue.includes(",") || inputValue.includes(".")) {
            const words = inputValue.split(/,|\./);
            inputValue = words[words.length - 1].trim();
        }
        if (inputValue.length > maxLength) {
            return;
        }
        if (inputValue === "") {
            clearSuggestions(suggestionBoxElement);
            return;
        }
        $.ajax({
            url: `${jsonUrl}CC_NoiDungVietTat.json`,
            cache: false,
            dataType: "json",
            success: function (data) {
                const suggestions = data.filter(
                    (item) =>
                        item.vietTat
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) &&
                        item.idViTri == IdViTri &&
                        item.idNhanVien == _idNVDN
                );
                for (var i = 0; i < suggestions.length; i++) {
                    // So sánh và cập nhật độ dài lớn nhất
                    maxLength = Math.max(
                        maxLength,
                        suggestions[i].vietTat.length
                    );
                }
                suggestionBox.empty();
                if (suggestions.length === 0) {
                    clearSuggestions(suggestionBoxElement);
                } else {
                    suggestions.forEach((suggestion, index) => {
                        const suggestionItem = $(
                            `<div class="suggestion-item gray">${suggestion.noiDung}</div>`
                        );
                        Suggestions.push(suggestionItem);
                        if (index === 0) {
                            suggestionItem.addClass("active"); // Thêm lớp active cho gợi ý đầu tiên
                            activeSuggestionIndex = 0;
                        }
                        if (index === activeSuggestionIndex) {
                            suggestionItem.addClass("active");
                        }
                        suggestionItem.on("click", function () {
                            // Xử lý sự kiện khi người dùng click vào gợi ý
                            // khi người dùng chọn 1 gợi ý thì thực hiện hàm
                            replaceInputValue(inputElement, suggestion.noiDung);
                            // Xóa hộp gợi ý sau khi người dùng chọn
                            clearSuggestions(suggestionBoxElement);
                            activeSuggestionIndex = -1;
                        });

                        suggestionBox.append(suggestionItem);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX error:", error);
            },
        });
        const inputRect = inputElement.getBoundingClientRect();
        calculateSuggestionPosition(inputRect, suggestionBoxElement);
        // lắng nghe sự kiện nút lên xuống nút tab và nút enter
    });
    $(document).on("click", function (event) {
        const clickedElement = event.target;
        if (
            !$(clickedElement).hasClass("suggestion-item") &&
            !$(clickedElement).hasClass("inputGoiY")
        ) {
            // Người dùng click vào vị trí ngoài dropdown
            clearSuggestions($(".suggestionBox")[0]);
        }
    });
}
$(document).on("keydown", ".inputGoiY", function (event) {
    const suggestionBox = $(".suggestionBox");
    const suggestionBoxElement = suggestionBox[0];

    if (
        (event.key === "ArrowDown" || event.key === "ArrowUp") &&
        suggestionBoxElement.style.display === "block"
    ) {
        if (event.key === "ArrowDown") {
            event.preventDefault(); // Ngăn người dùng cuộn trang khi nhấn mũi tên xuống
            clearActiveSuggestions();
            if (
                activeSuggestionIndex ==
                $(".suggestionBox .suggestion-item").length - 1
            ) {
                const activeSuggestion = $(suggestionBoxElement)
                    .children(".suggestion-item")
                    .eq(activeSuggestionIndex);
                activeSuggestion.addClass("active");
                return;
            }
            if (activeSuggestionIndex < Suggestions.length - 1) {
                activeSuggestionIndex++;

                const suggestionBox = $(".suggestionBox");
                const activeSuggestion = $(suggestionBoxElement)
                    .children(".suggestion-item")
                    .eq(activeSuggestionIndex);
                activeSuggestion.addClass("active");
                // Kiểm tra xem có cuộn được hay không
                if (
                    suggestionBox.prop("scrollHeight") >
                    suggestionBox.height() &&
                    activeSuggestion &&
                    activeSuggestion.length > 0
                ) {
                    const suggestionItemHeight = activeSuggestion.outerHeight();
                    const suggestionItemTop = activeSuggestion.position().top;

                    if (
                        suggestionItemTop + suggestionItemHeight >
                        suggestionBox.height()
                    ) {
                        suggestionBox.scrollTop(
                            suggestionBox.scrollTop() +
                            suggestionItemTop +
                            suggestionItemHeight -
                            suggestionBox.height()
                        );
                    }
                }
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault(); // Ngăn người dùng cuộn trang khi nhấn mũi tên lên
            clearActiveSuggestions();

            if (activeSuggestionIndex > 0) {
                activeSuggestionIndex--;
            }

            const suggestionBox = $(".suggestionBox");
            const activeSuggestion = $(suggestionBoxElement)
                .children(".suggestion-item")
                .eq(activeSuggestionIndex);
            activeSuggestion.addClass("active");

            // Kiểm tra xem có cuộn được hay không
            if (suggestionBox.prop("scrollHeight") > suggestionBox.height()) {
                const suggestionItemTop = activeSuggestion.position().top;

                if (suggestionItemTop < 0) {
                    suggestionBox.scrollTop(
                        suggestionBox.scrollTop() + suggestionItemTop
                    );
                }
            }
        }
    }

    if (event.key === "Enter") {
        if ($(suggestionBoxElement).find(".suggestion-item").length != 0) {
            event.preventDefault();
            handleEnterKey(event, suggestionBoxElement, inputElement);
        }
    }
    if (event.key === "Tab") {
        handleEnterKey(event, suggestionBoxElement, inputElement);
    }
});

// tắt active các gợi ý
function clearSuggestions(element) {
    try {
        if (!element || typeof element.innerHTML === "undefined") {
            console.warn("⚠️ clearSuggestions: element is undefined or invalid");
            return;
        }
        element.innerHTML = "";
        element.style.display = "none";
    } catch (err) {
        console.error("❌ clearSuggestions error:", err);
    }
}

// ẩn các gợi ý
function clearSuggestions(suggestionBox) {
    try {
        if (!element || typeof element.innerHTML === "undefined") {
            console.warn("⚠️ clearSuggestions: element is undefined or invalid");
            return;
        }
        element.innerHTML = "";
        element.style.display = "none";
    } catch (err) {
        console.error("❌ clearSuggestions error:", err);
    }
}
// hàm chọn gợi ý khi nhấn chọn enter hoặc tab
function handleEnterKey(event, suggestionBox, inputGoiY) {
    const activeSuggestion = suggestionBox.querySelector(
        ".suggestion-item.active"
    );

    if (activeSuggestion) {
        replaceInputValue(inputGoiY, activeSuggestion.textContent);
        clearSuggestions(suggestionBox);
        activeSuggestionIndex = -1;
    }
}
// hàm thêm giá trị gợi ý vào ô input
function replaceInputValue(inputElement, newValue) {
    let originalValue = inputElement.value.trim();
    if (originalValue.endsWith(", ")) {
        inputElement.value = newValue;
    } else {
        const lastIndexCham = originalValue.lastIndexOf(".") + 1;
        const lastIndexPhay = originalValue.lastIndexOf(",") + 1;
        var lastIndex = 0;
        if (lastIndexCham > lastIndexPhay) {
            lastIndex = lastIndexCham;
        } else {
            lastIndex = lastIndexPhay;
        }

        if (originalValue.includes(",") || originalValue.includes(".")) {
            inputElement.value =
                originalValue.substring(0, lastIndex) + " " + newValue;
        } else {
            inputElement.value =
                originalValue.substring(0, lastIndex) + "" + newValue;
        }
    }
} // xác định vị trí của ô input để hiển thị gợi ý
function calculateSuggestionPosition(inputRect, suggestionBox) {
    suggestionBox.style.display = "block";
    const inputBottom =
        inputRect.bottom + suggestionBox.offsetHeight + window.scrollY; // Thêm window.scrollY vào tính toán vị trí

    if (inputBottom > window.innerHeight + window.scrollY) {
        suggestionBox.style.top =
            inputRect.top - suggestionBox.offsetHeight + window.scrollY + "px";
    } else {
        suggestionBox.style.top = inputRect.bottom + window.scrollY + "px";
    }

    suggestionBox.style.left = inputRect.left + "px";
    suggestionBox.style.width = inputRect.width + "px";
}
// Gọi hàm showSuggestions khi cần thiết
showSuggestions();

// hàm click chuột phải
let currentIdViTri;
let currentValue; // Biến lưu trữ giá trị idViTri khi chuột phải được kích hoạt
function RightClickMenu() {
    const contextMenu = $("#contextMenu");
    const contentElements = $(".right-click");
    const menu = $(".list-menu");

    contentElements.on("contextmenu", function (event) {
        event.preventDefault();
        currentIdViTri = $(this).data("idvitri");
        currentValue = $(this).val();
        const menuWidth = menu.outerWidth();
        const menuHeight = menu.outerHeight();

        const clickX = event.pageX;
        const clickY = event.pageY;
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();

        let x = clickX;
        let y = clickY;

        // Kiểm tra xem menu có vượt quá chiều rộng của cửa sổ không
        if (clickX + menuWidth > windowWidth) {
            x = windowWidth - menuWidth;
        }

        // Kiểm tra xem menu có vượt quá chiều cao của cửa sổ không
        if (clickY + menuHeight > windowHeight) {
            y = windowHeight - menuHeight;
        }

        // Hiển thị context menu
        menu.css({
            left: `${x}px`,
            top: `${y}px`,
            display: "block",
        });
    });

    $(document).on("click", function () {
        $(".list-menu").css("display", "none");
    });
}
RightClickMenu();
function showDropdownMenu(select, dropdownElement) {
    var dropdown = $(dropdownElement.dropdown);
    // set chiều rộng cho dropdown menu theo select
    var ts_wapper = select.next();
    $("#dropdow-show").css("width", ts_wapper.outerWidth(true) + "px");
    var td = select.parent();
    // lấy kiểu position của thẻ chứa nó
    var parentPosition = td.css("position");

    // lấy vị trí theo chiều dọc và tính toán vị trí cho thẻ dropdown
    const screenHeight = $(window).height();
    const offset = select.position();
    var scrollTop = $(window).scrollTop();
    var relativeTopWindow = offset.top - scrollTop;

    const dropdownHeight = dropdown.outerHeight(true) + relativeTopWindow;
    const height = ts_wapper.outerHeight(true);

    var tableScrollTop = select.closest(".table-responsive").scrollTop();
    var relativeTop = offset.top - tableScrollTop;

    if (parentPosition === "sticky") {
        if (dropdownHeight + height < screenHeight + tableScrollTop) {
            $("#dropdow-show").css("top", relativeTop + height);
            $("#dropdow-show").css("left", ts_wapper.offset().left);
        } else {
            $("#dropdow-show").css(
                "top",
                relativeTop - dropdown.outerHeight(true)
            );
            $("#dropdow-show").css("left", ts_wapper.offset().left);
        }
    } else {
        var tableScrollLeft = select.closest(".table-responsive").scrollLeft();
        var relativeLeft = offset.left - tableScrollLeft;

        if (dropdownHeight + height < screenHeight + tableScrollTop) {
            $("#dropdow-show").css("top", relativeTop + height);
            $("#dropdow-show").css("left", relativeLeft);
        } else {
            $("#dropdow-show").css(
                "top",
                relativeTop - dropdown.outerHeight(true)
            );
            $("#dropdow-show").css("left", relativeLeft);
        }
    }
}

function tuoiTreEm(ngaySinh) {
    if (!ngaySinh) {
        return false;
    }
    // Chuyển đổi chuỗi ngày sinh thành đối tượng Date
    const parts = ngaySinh.split("-");
    const ngay = parseInt(parts[0], 10);
    const thang = parseInt(parts[1], 10) - 1; // Trừ 1 vì tháng trong JavaScript bắt đầu từ 0
    const nam = parseInt(parts[2], 10);

    const ngaySinhDate = new Date(nam, thang, ngay);

    // Lấy ngày hiện tại
    const ngayHienTai = new Date();

    // Tính tuổi bằng cách trừ ngày sinh từ ngày hiện tại
    var tuoi = ngayHienTai.getFullYear() - ngaySinhDate.getFullYear();

    // Kiểm tra nếu ngày sinh chưa đến ngày hiện tại trong năm, trừ đi 1 năm
    if (
        ngayHienTai.getMonth() < ngaySinhDate.getMonth() ||
        (ngayHienTai.getMonth() === ngaySinhDate.getMonth() &&
            ngayHienTai.getDate() < ngaySinhDate.getDate())
    ) {
        tuoi--;
    }

    return tuoi < 6;
}

function setValueDropDown(tomselect, id, linkJson, callback) {
    if (id) {
        tomselect.setValue(id);
        if (tomselect.getOption(id)) {
        } else {
            $.ajax({
                dataType: "json",
                url: linkJson,
            }).done(function (response) {
                var itemFound = callback(response, id);

                tomselect.addOption(itemFound);
                tomselect.setValue(id);
            });
        }
    } else {
        tomselect.clear();
    }
}
function spinnerBtn(btn) {
    btn.prop("disabled", true);
    btn.html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
    );
}
function showBtn(btn, text) {
    btn.prop("disabled", false);
    btn.html(text);
}
function showLoader(table) {
    table.after(`<div id="loader">
                                        <div class="d-flex justify-content-center">
                                            <div class="spinner-grow text-primary" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </div>`);
}
function hideLoader() {
    $("#loader").remove();
}
function randomThreeDigitNumber() {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    return randomNumber;
}

function cleanSelect(nameClass) {
    var selectElements = document.querySelectorAll(nameClass);
    selectElements.forEach(function (selectElement) {
        if (selectElement.tomselect) {
            selectElement.tomselect.clear();
            //selectElement.tomselect.clearOptions();
        } else {
            selectElement.selectedIndex = 0;
        }
    });
}
function toEmpty(data) {
    if (data == null || data == undefined) {
        return "";
    } else {
        return data;
    }
}

//vd: tBodyPhieuChiDinh, divPhieuChiDinh
function scrollAutoTableWithNameTBody(nameBody, nameDiv) {
    if ($(`#${nameBody} tr`).length > 0) {
        var rowpos = $(`#${nameBody} tr:last`).position();
        $(`#${nameDiv}`).scrollTop(rowpos.top);
    }
}

function getBackgroundColorBasedOnIdKhoaBacSi(indexColor) {
    var mauNenTheoIdKhoaBacSi = {
        1: "#2bcbba", //xanh
        2: "#ffaa6a", //cam
        3: "#f66d9b", //hồng
        4: "#f1c40f", //vàng
    };
    var mauNen = mauNenTheoIdKhoaBacSi[indexColor];
    return mauNen;
}

function clearFormTimKiem() {
    $("#formSearch");
    var form = $("#formSearch");
    // các input text = ""
    form.find('input[type="text"].form-control').val("");
    form.find('input[type="number"].form-control').val("");
    form.find('input[type="email"].form-control').val("");
    form.find('input[tyoe="hidden"]').val("");
    form.find("textarea").text("");
    form.find("textarea").val("");

    form.find('input[type="text"].form-control.input-date-time').val("");
    form.find('input[type="text"].form-control.input-date-time').val(
        getDateTimeNow()
    );

    form.find('input[type="text"].form-control.input-date').val("");
    form.find('input[type="text"].form-control.input-date-default').val(
        getDateNow()
    );
    form.find('input[type="text"].form-control.input-date-time-default').val(
        getDateTimeNow()
    );
    var selects = document
        .getElementById("formSearch")
        .querySelectorAll("select");

    selects.forEach(function (select) {
        if (select.tomselect) {
            select.tomselect.clear();
        } else {
            select.selectedIndex = 0;
        }
    });
    form.find('input[type="checkbox"]')
        .prop("checked", false)
        .trigger("change");
    form.find('input[type="checkbox"]').val("false");
    var selectElement = form.find($(".form-select[name='Active']"));
    selectElement.find("option[value='true']").prop("selected", true);
}

function hamKiemTraThemSua(id) {
    var isCheck = false;
    if (id > 0) {
        isCheck = true;
    }
    return isCheck;
}

function hamKiemTraQuyenThemSuaKhiUpdate(id, _qThem, _qSua) {
    var isCheck = false;
    if (hamKiemTraThemSua(Number(id))) {
        if (_qSua) {
            isCheck = true;
        }
    } else {
        if (_qThem) {
            isCheck = true;
        }
    }
    return isCheck;
}

//function hamKiemTraQuyenSuaHayThemVoiBienCheck(isOld) {
//  var isCheck = false;
//  if (isOld) {
//    if (_qSua) {
//      isCheck = true;
//    }
//  } else {
//    if (_qThem) {
//      isCheck = true;
//    }
//  }
//  return isCheck;
//}

//function disabledFullTable(tbody) {
//  tbody.find('tr input').prop('disabled', false);
// // tbody.find('tr select').prop('disabled', false);
//  tbody.find('tr select').each(function () {
//    if ($(this)[0].tomselect) {
//      $(this)[0].tomselect.disable();
//    } else {
//      $(this).prop('disabled', true);
//    }
//  });

//  tbody.find('tr button').prop('disabled', false);

//  //btn.prop('disabled', false);
//  //btn.html(text);
//}

function hamCapNhatButtonLuu(id, them, sua, nameIdBtn) {
    var isCheck = hamKiemTraQuyenThemSuaKhiUpdate(id, them, sua);
    var btn = $("#" + nameIdBtn);
    btn.prop("disabled", !isCheck);
}

function showPageloader() {
    $("#page-loader-body").addClass("show");
    $("#page-loader-body").css("z-index", "5555");
}
function hidePageloader() {
    $("#page-loader-body").removeClass("show");
    $("#page-loader-body").css("z-index", "-1");
}
// thay thế dữ liệu trống gửi về từ formselatal() bằng %%
function replacedata(formData) {
    // Tách chuỗi formData thành các cặp key-value
    var pairs = formData.split("&");

    // Lặp qua từng cặp key-value để kiểm tra và thay thế giá trị null hoặc rỗng bằng "%%"
    for (var i = 0; i < pairs.length; i++) {
        var keyValue = pairs[i].split("=");
        var value = decodeURIComponent(keyValue[1].replace(/\+/g, " ")); // Giải mã giá trị

        // Kiểm tra nếu giá trị là null hoặc rỗng, thay thế bằng "%%"
        if (value === null || value === "") {
            pairs[i] = keyValue[0] + "=%%";
        }
    }
    // Tạo lại chuỗi formData từ các cặp key-value đã được xử lý và trả về kết quả
    return pairs.join("&");
}
function replacemodelMap(modelMap) {
    for (var key in modelMap) {
        if (modelMap.hasOwnProperty(key)) {
            if (modelMap[key] === null || modelMap[key] === "") {
                modelMap[key] = "%%";
            }
        }
    }
    return modelMap;
}

var dataUrl = `${jsonUrl}CC_NoiDungVietTat.json`;
// lấy cụm từ viết tắt từ file json hiển thị lên modal
function getCumTuVT(idViTri, callback) {
    $.ajax({
        url: dataUrl,
        cache: false,
        success: function (data) {
            const listVt = data.filter(
                (item) => item.idViTri === idViTri && item.idNhanVien == _idNVDN
            );
            callback(listVt);
        },
        error: function (xhr, status, error) {
            console.error("Error loading JSON file:", error);
        },
    });
}
// từ đây đến hết của Lộc
// Tạo cụm từ viết tắt và hiển thị bảng trong modal
function CreatVT(idViTri, value) {
    getCumTuVT(idViTri, function (listVt) {
        const tbody = $('<tbody id="tbody-cumtuVT">');
        // Thêm trường dữ liệu ẩn để lưu trữ idViTri
        const hiddenInput = `<input type="hidden" id="hiddenIdViTri" value="${idViTri}">`;
        tbody.append(hiddenInput);
        // Thêm một hàng rỗng vào đầu tbody và điền giá trị hiện có vào
        const emptyRow = `
          <tr>
              <td class="text-start p-0"><input autocomplete="off" class="form-control" value=""></td>
              <td class="text-start p-0"><textarea rows="1" autocomplete="off" class="form-control" value="">${value ? value : ""
            }</textarea></td>
              <td class="text-center p-0"><a href="#" class="list-group-item-actions xoahangVT p-2 px-3"><svg xmlns="http://www.w3.org/2000/svg" style="color:red" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg></a></td>
          </tr>`;
        tbody.append(emptyRow);
        // Thêm dữ liệu từ file JSON vào tbody
        listVt.forEach((item) => {
            const row = `<tr data-id="">
                  <td class="text-start p-0"><input autocomplete="off" class="form-control" value="${item.vietTat}"></td>
                  <td class="text-start p-0"><textarea rows="1" autocomplete="off" class="form-control" value="">${item.noiDung}</textarea></td>
                  <td class="text-center p-0"><a href="#" class="list-group-item-actions p-2 px-3 xoahangVT"><svg xmlns="http://www.w3.org/2000/svg" style="color:red" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg></a></td>
              </tr>`;
            tbody.append(row);
        });

        const table = `
              <div class="row justify-content-end">
              <div class="col-auto mb-1">
                  <a class="btn btn-primary btn-add-new">Thêm mới</a>
                  </div>
              </div>
              <div class="card">
                  <div class="table-responsive" style="height: 60vh;" id="tableVT">
                      <table class="table table-vcenter border">
                          <thead>
                              <tr data-id="">
                                  <th class="text-center w-15 px-0">Viết tắt</th>
                                  <th class="text-center">Cụm từ viết tắt</th>
                                  <th class="text-center w-1">Xóa</th>
                              </tr>
                          </thead>
                          ${tbody.prop("outerHTML")}
                      </table>
                  </div>
              </div>
              <div class="row justify-content-end pt-2">
                <div class="col-auto">
                  <a class="btn btn-primary" id="btnluuVT">Lưu</a>
                </div>
                <div class="col-auto">
                  <button type="button" class="btn me-auto" data-bs-dismiss="modal">Đóng</button>
                </div>
              </div>
          `;

        showModalLargel("Tạo cụm từ viết tắt", table);
        setTimeout(function () {
            $("#tbody-cumtuVT  input:first").focus();
        }, 500);
    });
}
// tạo hàng mới trong modal
function addNewRow() {
    const newRow = `
          <tr data-id="">
              <td class="text-start p-0"><input autocomplete="off" class="form-control" value=""></td>
              <td class="text-start p-0"><textarea rows="1" autocomplete="off" class="form-control" value=""></textarea></td>
              <td class="text-center p-0"><a href="#" class="list-group-item-actions xoahangVT p-2 px-3"><svg xmlns="http://www.w3.org/2000/svg" style="color:red" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg></a></td>
          </tr>`;
    $("#tbody-cumtuVT").prepend(newRow);
}

// thêm một hàng viết tắt mới trong modal
$("#formUpdate").on("click", ".btn-add-new", function () {
    addNewRow();
});
// xóa một hàng viết tắt trong modal
$("#formUpdate").on("click", ".xoahangVT", function () {
    if ($("#tbody-cumtuVT tr").length > 1) {
        $(this).closest("tr").remove();
    }
});
// lưu các từ viết tắt vào file json
$("#formUpdate").on("click", "#btnluuVT", function (event) {
    event.preventDefault();
    const tableData = [];
    var idViTri = null;
    $("#tableVT tbody tr").each(function () {
        idViTri = $("#hiddenIdViTri").val();
        const vietTat = $(this).find("input:eq(0)").val();
        const noiDung = $(this).find("textarea:eq(0)").val();
        tableData.push({
            IdviTri: Number(idViTri),
            VietTat: vietTat,
            NoiDung: noiDung,
        });
    });
    $.ajax({
        type: "post",
        url: "/CongCu/CC_NoiDungVietTat/themTuVietTat",
        data: {
            listNDVT: tableData,
            idViTri: idViTri,
        },
        success: function (response) {
            showToast(response.message, response.statusCode);
        },
        error: function (error) {
            console.log(error);
        },
    });
});
//
function formatNumberAs() {
    $(".formatted-number-as").each(function () {
        var $input = $(this);

        $input.inputmask({
            alias: "numeric",
            groupSeparator: ",",
            autoGroup: true,
            digits: 0,
            allowMinus: false,
            digitsOptional: false,
            placeholder: "",
            onBeforeMask: function (value, opts) {
                if (value === "0") {
                    return "0\\";
                }
                return value;
            },
            onKeyDown: function (e, buffer, caretPos, opts) {
                // Allow '/' character without processing it
                if (e.key === "/" || e.keyCode === 191) {
                    e.preventDefault();
                    var currentValue = $input.val();
                    var currentCaret = $input[0].selectionStart;

                    // Insert '/' at the caret position
                    $input.val(
                        currentValue.substring(0, currentCaret) +
                        "/" +
                        currentValue.substring(currentCaret)
                    );
                    $input[0].setSelectionRange(
                        currentCaret + 1,
                        currentCaret + 1
                    );
                }
            },
        });
    });
}

function showProgressWithID(nameID) {
    $(`#${nameID}`).show();
}

function hideProgressWithID(nameID) {
    $(`#${nameID}`).hide();
}

function convertDateEmpty(string) {
    if (string == null || string == "") {
        return "";
    }
    return string;
}
function convertDateFormat(inputDate) {
    if (!inputDate) {
        return ""; // Return empty string for empty input
    }
    var parts = inputDate.split("-");
    var dateObject = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObject.getTime())) {
        return ""; // Return empty string for invalid date
    }
    var formattedDate =
        ("0" + dateObject.getDate()).slice(-2) +
        "/" +
        ("0" + (dateObject.getMonth() + 1)).slice(-2) +
        "/" +
        dateObject.getFullYear();

    return formattedDate;
}
function convertToZero(id) {
    if (id) {
        return Number(id);
    }
    return 0;
}
function convertToPT(string) {
    if (string) {
        return string;
    }
    return "%%";
}

function formatTotal(number) {
    var roundedNumber = parseFloat(number).toFixed(2);
    var formattedNumber = roundedNumber
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Kiểm tra nếu có phần thập phân là .00 thì loại bỏ nó
    if (formattedNumber.endsWith(".00")) {
        formattedNumber = formattedNumber.slice(0, -3);
    }

    return formattedNumber;
}
function updatePagi(
    el,
    prePage,
    nextPage,
    pageNumber,
    functionChange = "changePage"
) {
    function nameFunction(pageNumber) {
        return functionChange + "(" + pageNumber + ")";
    }
    var pagi = `<ul class="pagination m-2 justify-content-end" id="${el.get(0).id
        }">
      <li class="page-item ${prePage == 0 ? "disabled" : ""
        }"><button onclick="${nameFunction(
            1
        )}" class="page-link"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M11 7l-5 5l5 5"></path>
        <path d="M17 7l-5 5l5 5"></path>
     </svg></button></li>
      <li class="page-item ${prePage == 0 ? "disabled" : ""}">
        <button class="page-link" tabindex="-1" aria-disabled="true" onclick="${prePage == 0 ? "" : nameFunction(prePage)
        }">
          <!-- Download SVG icon from http://tabler-icons.io/i/chevron-left -->
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15 6l-6 6l6 6"></path>
          </svg>
        </button>
      </li>
      ${prePage != 0
            ? "<li class='page-item'><button class='page-link' onclick='" +
            nameFunction(prePage) +
            "'>" +
            prePage +
            "</button></li>"
            : ""
        }
      <li class="page-item active"><button class="page-link">${prePage + 1
        }</button></li>
      ${nextPage !== 0
            ? "<li class='page-item'><button class='page-link' onclick='" +
            nameFunction(nextPage) +
            "'>" +
            nextPage +
            "</button></li>"
            : ""
        }
      <li class="page-item ${nextPage == 0 ? "disabled" : ""}">
        <button class="page-link" onclick="${nextPage == 0 ? "" : nameFunction(pageNumber + 1)
        }"">
          <!-- Download SVG icon from http://tabler-icons.io/i/chevron-right -->
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg></button></li>
      <li class="page-item  ${nextPage == 0 ? "disabled" : ""
        }"><button class="page-link" onclick="${nameFunction(
            -1
        )}"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M7 7l5 5l-5 5"></path>
        <path d="M13 7l5 5l-5 5"></path>
     </svg></button></li>
    </ul>`;
    el.replaceWith(pagi);
}
function getDataFromTr(tr) {
    var formData = {};
    tr.find("input, select, textarea").each(function () {
        if (this.name) {
            if (this.type == "file") {
                formData[this.name] = $(this).get(0).files[0];
            } else {
                if (this.tagName == "SELECT") {
                    if (this.tomselect) {
                        formData[this.name] = this.tomselect.getValue() ?? null;
                    } else {
                        formData[this.name] = this.value ?? null;
                    }
                } else {
                    if (this.inputmask) {
                        formData[this.name] =
                            $(this).inputmask("unmaskedvalue");
                    } else {
                        formData[this.name] = this.value ?? null;
                    }
                }
            }
        }
    });

    // Chuyển đối tượng formData thành chuỗi serialized
    return formData;
}
var userInteracted = false;
function playAudioWithString(mp3String, callback) {
    // Chuyển chuỗi thành ArrayBuffer
    var arrayBuffer = Uint8Array.from(atob(mp3String), (c) =>
        c.charCodeAt(0)
    ).buffer;

    // Tạo Blob từ ArrayBuffer
    var blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

    // Tạo URL cho Blob
    var url = URL.createObjectURL(blob);

    // Tạo một thẻ audio để phát file mp3
    var audio = new Audio(url);

    audio.onended = function () {
        if (callback) {
            callback();
        }
    };
    // Phát file mp3
    if (userInteracted) {
        audio.play();
    } else {
        callback();
    }
}
function formatPhoneNumber() {
    $(".phone").inputmask({
        mask: "9999 999 999",
        allowMinus: false, // Chắc chắn không cho phép dấu trừ
        allowPlus: false, // Chắc chắn không cho phép dấu cộng
        onBeforeMask: function (value, opts) {
            // Xử lý giá trị trước khi áp dụng mask (nếu cần)
            return value;
        },
    });
}
function getDataFromBenhAn(form) {
    // Lấy tất cả các phần tử input trong trang
    var inputElements = form.find("input[name], select[name], textarea[name]");

    // Khởi tạo đối tượng để lưu trữ dữ liệu
    var formData = {};

    // Duyệt qua từng phần tử input và thêm dữ liệu vào đối tượng
    inputElements.each(function () {
        var inputName = $(this).prop("name");
        let input = $(this);
        var inputValue;
        var inputType = this.type;
        var checkTomselect = false;
        var inputLabel = "";
        if (this.tagName == "SELECT") {
            if (this.tomselect) {
                checkTomselect = true;
                inputValue = this.tomselect.getValue();
                if (Array.isArray(inputValue)) {
                    inputLabel = [];
                    var tom = this.tomselect;
                    inputValue.forEach(function (i) {
                        var ob = Object.values(tom.options).find(function (
                            data
                        ) {
                            return data.ma == i;
                        });
                        if (ob) {
                            inputLabel.push(ob.ten.trim());
                        }
                    });
                } else {
                    var ob = Object.values(this.tomselect.options).find(
                        function (data) {
                            return data.ma == inputValue;
                        }
                    );
                    if (ob) {
                        inputLabel = ob.ten.trim();
                    }
                }
            } else {
                inputValue = $(this).val();
            }
        } else {
            if (inputType == "checkbox") {
                inputValue = this.checked;
            } else {
                inputValue = $(this).val();
            }
        }
        var nameParts = inputName.split(".");
        var currentObject = formData;
        if (inputType === "radio") {
            for (var i = 0; i < nameParts.length; i++) {
                var part = nameParts[i];

                if (i === nameParts.length - 1) {
                    if (this.checked) {
                        currentObject[part] = inputValue;
                    } else {
                        if (!currentObject[part]) {
                            currentObject[part] = "";
                        }
                    }
                } else {
                    currentObject[part] = currentObject[part] || {};
                    currentObject = currentObject[part];
                }
            }
        } else if (inputType !== "radio") {
            for (var i = 0; i < nameParts.length; i++) {
                var part = nameParts[i];
                if (i === nameParts.length - 1) {
                    if (!currentObject[part]) {
                        if (
                            input.hasClass("input-benh") ||
                            input.hasClass("input-benhkemtheo")
                        ) {
                            if (input.hasClass("input-benh")) {
                                currentObject["t_" + part] = inputValue.trim();
                                currentObject[part] = input
                                    .prev("span.input-group-text")
                                    .text()
                                    .trim();
                            } else {
                                currentObject["t_" + part] = input
                                    .val()
                                    .trim()
                                    .split(";")
                                    .filter((x) => x);
                                currentObject[part] = input
                                    .prev("span.input-group-text")
                                    .text()
                                    .trim()
                                    .split(";")
                                    .filter((x) => x);
                            }
                        } else {
                            currentObject[part] = inputValue;
                        }
                    }
                    if (checkTomselect) {
                        currentObject["t_" + part] = inputLabel;
                    }
                } else {
                    currentObject[part] = currentObject[part] || {};
                    currentObject = currentObject[part];
                }
            }
        }
    });

    // Trả về đối tượng đã tạo
    return formData;
}
function traverseObject(obj, prefix = "", form = "") {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const currentKey = prefix ? `${prefix}.${key}` : key;
            obj[key] = obj[key] ? obj[key] : "";
            if (Array.isArray(obj[key])) {
                const element = document.querySelector(
                    `${form} [name="${currentKey}"]`
                );
                let te = $(element);
                if (element) {
                    if (element.tomselect) {
                        element.tomselect.setValue(obj[key]);
                    } else if (te.hasClass("input-benhkemtheo")) {
                        te.prev("span.input-group-text").text(
                            obj[key].join(";")
                        );
                        element.textContent = obj["t_" + key].join(";");
                        $(element).trigger("input");
                    } else {
                        element.value = obj[key];
                    }
                }
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                // Nếu là đối tượng, đệ quy duyệt qua các thuộc tính bên trong
                traverseObject(obj[key], currentKey);
            } else {
                const elements = document.querySelectorAll(
                    `${form} [name="${currentKey}"]`
                );
                elements.forEach(function (element) {
                    if (element) {
                        if (element.tagName == "SELECT") {
                            if (element.tomselect) {
                                element.tomselect.setValue(obj[key]);
                            } else {
                                element.value = obj[key];
                            }
                        } else {
                            if (element.type == "checkbox") {
                                element.checked = obj[key];
                            }
                            if (element.type == "radio") {
                                var r = $(
                                    `${form} input[name="${currentKey}"]`
                                );
                                r.each(function () {
                                    if (this.value == obj[key]) {
                                        this.checked = true;
                                    }
                                });
                            } else {
                                let te = $(element);
                                if (te.hasClass("input-benh")) {
                                    te.prev("span.input-group-text").text(
                                        obj[key]
                                    );
                                    element.textContent = obj["t_" + key];
                                } else {
                                    element.value = obj[key];
                                }
                                if (element.tagName === "TEXTAREA") {
                                    $(element).trigger("input");
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}
function appendDataFirst(obj) {
    for (let key in obj) {
        var data = obj[key];
        data = data == null ? "" : data;
        if (data != null) {
            data = data.toString().trim();
            const elements = document.querySelectorAll(
                `[name="${key.replaceAll("_", ".")}"]`
            );
            elements.forEach((element) => {
                if (element.tagName === "INPUT") {
                    if (element.type === "checkbox") {
                        element.checked = parseInt(data);
                    } else if (element.type === "radio") {
                        if (element.value == data.trim()) {
                            element.checked = true;
                        } else {
                            element.checked = false;
                        }
                    } else {
                        element.value = data;
                    }
                }
                if (element.tagName === "SELECT") {
                    if (element.tomselect) {
                        if (key.indexOf("benhKemTheo") >= 0) {
                            element.tomselect.setValue(data.split(";"));
                        } else {
                            if (data) {
                                element.tomselect.setValue(data);
                            } else {
                                element.tomselect.clear();
                            }
                        }
                    } else {
                        element.value = data;
                    }
                }
                if (element.tagName === "TEXTAREA") {
                    let te = $(element);
                    if (
                        te.hasClass("input-benh") ||
                        te.hasClass("input-benhkemtheo")
                    ) {
                        te.prev("span.input-group-text").text(data);
                        element.textContent = obj[key + "_t"];
                    } else {
                        element.textContent = data;
                    }
                    $(element).trigger("input");
                }
            });
        }
    }
}
function _handleClick() {
    userInteracted = true;
    document.body.removeEventListener("click", _handleClick);
}
document.body.addEventListener("click", _handleClick);

function toEmptyNumber(data) {
    if (data == null || data == undefined) {
        return "0";
    } else {
        return data;
    }
}

function getSLTonHangHoa(option) {
    $.ajax({
        type: "post",
        url: "/QuanLy/QL_ToaThuoc/getHangHoaWithId",
        data: "id=" + option.data("value"),
        success: function (response) {
            option.find(".content").html(`
              <p class="mb-0">Số lượng tồn: <b class="slTon">${response?.tongTon ? formatOddNumber(response?.tongTon) : 0
                }</b></p>
              <p class="mb-0">Giá DV: <b>${response?.giaBanLe ? formatOddNumber(response?.giaBanLe) : 0
                }</b></p>
              <p class="mb-0">Giá BHYT: <b>${response?.giaBHYT ? formatOddNumber(response?.giaBHYT) : 0
                }</b></p>
             
          `);
            // <p class="mb-0">Phụ thu: <b>${
            //   response?.phuThu ? formatOddNumber(response?.phuThu) : 0
            // }</b></p>
        },
        error: function (error) {
            console.log(error);
        },
    });
}
function getOptionDropdownHangHoa(item) {
    return `<div class="row option-hh" style="font-size: smaller;">
                              <div class="col-9">
                                  <table class="w-100">
                                      <tr>
                                          <th class="text-truncate" colspan="4" style="font-size: larger; max-width:440px">${item.ten
        }</th>
                                          <th style="width:5%">HL:</th>
                                          <th class="text-truncate" style="max-width:120px" title="${toEmpty(
            item.hamluong
        )}">${toEmpty(item.hamluong)}</th>
                                      </tr>
                                      <tr>
                                          <td style="width:5%">HC:</td>
                                          <td class="text-truncate" style="max-width:180px" title="${toEmpty(
            item.hoatchat
        )}">${toEmpty(item.hoatchat)}</td>
                                          <td style="width:10%">ĐVT:</td>
                                          <td>${toEmpty(item.tendvtxuat)}</td>
                                          <td style="width:5%">ĐD:</td>
                                          <td>${toEmpty(item.duongdung)}</td>
                                      </tr>
                                      <tr>
                                          <td style="width:5%">BHYT:</td>
                                          <td class="${item.bhyt == true
            ? "text-blue"
            : ""
        }"><b>${item.bhyt == true ? "Có" : "Không"
        }</b></td>
                                          <td style="width: 20%">Dạng bào chế:</td>
                                          <td>${toEmpty(item.dangbaoche)}</td>
                                          <td colspan="2" class="text-danger"><b>${item.candate == true
            ? "Cận date"
            : ""
        }</b></td>
                                      </tr>
                                      <tr>
                                          <td style="width:15%">TT Thầu:</td>
                                          <td class="text-truncate" style="max-width:220px" title="${toEmpty(
            item.thongtinthau
        )}">${toEmpty(item.thongtinthau)}</td>
                                          
                                      </tr>
                                  </table>
                              </div>
                              <div class="col-3">
                                  <div class="card bg-azure-lt px-1">
                                      <div class="content"></div>
                                      <div class="spinner-border m-auto" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                      </div>
                                  </div>
                              </div>
                          </div>`;
}
function handlerDropdownOpen(t) {
    var hoverTimer;

    setTimeout(function () {
        getSLTonHangHoa($(t.activeOption));
    }, 100);
    $(document).on("keydown", t.control_input, function (event) {
        if (event.key == "ArrowDown" || event.key == "ArrowUp") {
            clearTimeout(hoverTimer);
            $(t.activeOption).find(".content").empty();
            hoverTimer = setTimeout(function () {
                getSLTonHangHoa($(t.activeOption));
                clearTimeout(hoverTimer);
            }, 300);
        }
    });
    $(document).on("mouseenter", "div.option.option-hh", function () {
        $(t.activeOption).find(".content").empty();
        hoverTimer = setTimeout(function () {
            getSLTonHangHoa($(t.activeOption));
            clearTimeout(hoverTimer);
        }, 300);
    });
    $(document).on("mouseleave", "div.option.option-hh", function () {
        clearTimeout(hoverTimer);
    });
}
function handlerDropdownClose(t) {
    $(document).off("keydown", t.control_input);
    $(document).off("mouseenter", "div.option.option-hh");
    $(document).off("mouseleave", "div.option.option-hh");
}

function handlerDropdownType(t) {
    var hoverTimer;
    clearTimeout(hoverTimer);
    $(t.activeOption).find(".content").empty();
    hoverTimer = setTimeout(function () {
        getSLTonHangHoa($(t.activeOption));
    }, 300);
}

// Hiển thị overlay và spinner trong một div cụ thể
function showTableLoader(selector) {
    var $element = $(selector);
    if ($element.length > 0) {
        var $overlay = $(`<div id="overlay" class="overlay">
      <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
  </div>`);
        $element.append($overlay);
        $overlay.css("display", "flex");

        // Đặt kích thước của spinner là 3/4 chiều rộng của div
        var $spinner = $overlay.find(".spinner");
        $spinner.css("width", $element.width() * 0.75);
        $spinner.css("height", $element.width() * 0.75);
    }
}

function hideTableLoader() {
    $(".overlay").remove();
}

function disableOnTable(tbody) {
    tbody.find("input").prop("disabled", true);
    tbody.find("select").each(function () {
        var $select = $(this);
        if ($select[0].tomselect) {
            $select[0].tomselect.disable();
        } else {
            $select.prop("disabled", true);
        }
    });
    tbody.find("[class*=delete]").removeClass(function (index, className) {
        return (className.match(/\bdelete\S+/g) || []).join(" ");
    });
}

function getDataForm(form) {
    // Lấy tất cả các phần tử input trong trang
    var inputElements = form.find("input[name], select[name], textarea[name]");

    // Khởi tạo đối tượng để lưu trữ dữ liệu
    var formData = {};

    // Duyệt qua từng phần tử input và thêm dữ liệu vào đối tượng
    inputElements.each(function () {
        var inputName = $(this).prop("name");
        var inputValue;
        var inputType = this.type;
        var checkTomselect = false;
        var inputLabel = "";
        if (this.tagName == "SELECT") {
            if (this.tomselect) {
                checkTomselect = true;
                inputValue = this.tomselect.getValue();
                if (Array.isArray(inputValue)) {
                    inputLabel = [];
                    var tom = this.tomselect;
                    inputValue.forEach(function (i) {
                        var ob = Object.values(tom.options).find(function (
                            data
                        ) {
                            return data.ma == i;
                        });
                        if (ob) {
                            inputLabel.push(ob.ten.trim());
                        }
                    });
                } else {
                    var ob = Object.values(this.tomselect.options).find(
                        function (data) {
                            return data.ma == inputValue;
                        }
                    );
                    if (ob) {
                        inputLabel = ob.ten.trim();
                    }
                }
            } else {
                inputValue = $(this).val();
            }
        } else {
            if (inputType == "checkbox") {
                inputValue = this.checked;
            } else {
                inputValue = $(this).val();
            }
        }
        var nameParts = inputName.split(".");
        var currentObject = formData;
        if (inputType === "radio") {
            for (var i = 0; i < nameParts.length; i++) {
                var part = nameParts[i];

                if (i === nameParts.length - 1) {
                    if (this.checked) {
                        currentObject[part] = inputValue;
                    } else {
                        if (!currentObject[part]) {
                            currentObject[part] = "";
                        }
                    }
                } else {
                    currentObject[part] = currentObject[part] || {};
                    currentObject = currentObject[part];
                }
            }
        } else if (inputType !== "radio") {
            for (var i = 0; i < nameParts.length; i++) {
                var part = nameParts[i];

                if (i === nameParts.length - 1) {
                    if (!currentObject[part]) {
                        currentObject[part] = inputValue;
                    }
                    //if (checkTomselect) {
                    //  currentObject["t_" + part] = inputLabel;
                    //}
                } else {
                    currentObject[part] = currentObject[part] || {};
                    currentObject = currentObject[part];
                }
            }
        }
    });

    // Trả về đối tượng đã tạo
    return formData;
}

function hamTinhChiSoBMI(canNang, chieuCao) {
    var kq = (canNang / Math.pow(chieuCao, 2)).toFixed(2); //Kg/m²
    return kq;
}

function hamChuyenDoiDonViChieuDai(giaTri, donViBanDau, donViChuyenDoi) {
    var kq = 0;
    if (giaTri) {
        //const meters = {
        //  meter: 1,
        //  kilometer: 1000,
        //  centimeter: 0.01,
        //  millimeter: 0.001,
        //  mile: 1609.34,
        //  yard: 0.9144,
        //  foot: 0.3048,
        //  inch: 0.0254
        //};
        //const giaTriBanDau = parseFloat(giaTri) * meters[donViBanDau];
        //kq = giaTriBanDau / meters[donViChuyenDoi];

        if (donViBanDau == "cm" && donViChuyenDoi == "m") {
            kq = parseFloat(giaTri) * 0.01;
        }
    }
    return kq;
}
$.fn.checkValidity = function () {
    var isValid = true;
    this.each(function () {
        if (!this.validity.valid) {
            isValid = false;
            return false; // Dừng vòng lặp khi gặp lỗi đầu tiên
        }
    });
    return isValid;
};
function singlecheckbox() {
    $(document).on("change", ".single-checkbox", function () {
        var $siblings = $(this)
            .closest(".group-checkbox")
            .find(".single-checkbox");
        $siblings.not(this).prop("checked", false);
    });
}
function downloadPdf(response) {
    var blob = new Blob([response], { type: "application/pdf" }); //this make the magic
    var blobURL = URL.createObjectURL(blob);

    iframe = document.getElementById("dialogPdf"); //load content in an iframe to print later
    iframe.src = blobURL;
    iframe.onload = function () {
        setTimeout(function () {
            iframe.focus();

            iframe.contentWindow.print();

            setTimeout(function () {
                URL.revokeObjectURL(blobURL);
            }, 1);
        }, 1);
        setTimeout(function () {
            $("#Pageloader").removeClass("show");
            $("#Pageloader").css("z-index", "-1");
        }, 3000);
    };
}
function optionDropdownHangHoa(item, escape) {
    return `<div class="row" style="white-space: normal;font-size:smaller;">
                                <div class="col-12">
                                    <h4 class="mb-1">${item.ten} [${item.viettat
        }]</h4>
                                    <div class="row justify-content-between">
                                        <p class="col-6 mb-0"><strong>Mã</strong>: ${toEmpty(
            item.ma
        )}</p>
                                        <p class="col-6 mb-0"><strong>Nhóm</strong>: ${toEmpty(
            item.tennhomhang
        )}</p>
                                    </div>
                                    <div class="row justify-content-between">
                                        <p class="col-4 mb-0"><strong>ĐVT nhập</strong>: ${toEmpty(
            item.tendvtnhap
        )}</p>
                                        <p class="col-4 mb-0"><strong>SLQĐ</strong>: ${toEmpty(
            item.slqd
        )}</p>
                                        <p class="col-4 mb-0"><strong>ĐVT xuất</strong>: ${toEmpty(
            item.tendvtxuat
        )}</p>
                                    </div>
                                    <div class="row justify-content-between">
                                        <p class="col-6 mb-0"><strong>Đường dùng</strong>: ${toEmpty(
            item.duongdung
        )}</p>
                                        <p class="col-6 mb-0 overflow-hidden text-nowrap" style="max-width: 250px; text-overflow:ellipsis;"><strong>Hoạt chất</strong>: <span class="mb-0">${toEmpty(
            item.hoatchat
        )}</span></p>
                                    </div>
                                    <div class="row justify-content-between">
                                        <p class="col-6 mb-0 overflow-hidden text-nowrap" style="max-width: 250px; text-overflow:ellipsis;"><strong>Hàm lượng</strong>: ${toEmpty(
            item.hamluong
        )}</p>
                                    </div>
                                    <div class="row justify-content-between">
                                        <p class="col-6 mb-0"><strong>TT thầu</strong>: ${toEmpty(
            item.thongtinthau
        )}</p>
                                        <p class="col-6 mb-0"><strong>Giá thầu</strong>: ${toEmpty(
            item.giathau
        )}</p>
                                    </div>
                                </div>
                            </div>`;
}

function convertToDayFromDate() {
    date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
$("#date-modal").datetimepicker({
    inline: true,
    sideBySide: true,
    locale: "vi",
    useStrict: true,
    defaultDate: new Date(),
    extraFormats: [
        "DD-MM-yyyy HH:mm",
        "DD/MM/yyyy HH:mm",
        "DD-MM-yy HH:mm",
        "DD/MM/yy HH:mm",
    ],
    icons: {
        date: "ti ti-calendar",
        up: "ti ti-chevron-up",
        down: "ti ti-chevron-down",
        previous: "ti ti-chevron-left",
        next: "ti ti-chevron-right",
        time: "ti ti-alarm",
    },
});

function parseDateTimeString(dateTimeString, formatString) {
    // Sử dụng moment để phân tích chuỗi ngày tháng/thời gian theo định dạng chỉ định
    const parsedMoment = moment(dateTimeString, formatString, true);

    // Kiểm tra xem kết quả có phải là một đối tượng Date hợp lệ hay không
    if (!parsedMoment.isValid()) {
        throw new Error("Invalid date/time string or format");
    }

    // Trả về đối tượng Date của JavaScript
    return parsedMoment.toDate();
}
document
    .getElementById("modal-date")
    .addEventListener("hidden.bs.modal", function (event) {
        $("#btnModalDate").off("click");
    });
document
    .getElementById("modal-justDate")
    .addEventListener("hidden.bs.modal", function (event) {
        $("#btnModalDate").off("click");
    });
/*function configInputDateModal(elements, format, callback) {
  $(document).on('focus', elements, function () {
    let val = $(this).val();
        if (val && !$(this).prop('disabled')) {
            let result = parseDateTimeString(val, format);
            $('#date-modal').data("DateTimePicker").date(result);
            showModalDate();
            let input = $(this);
            $('#btnModalDate').click(function () {
                if (callback) {
                    let dateStr = $('#date-modal').data("DateTimePicker").date().format(format);
                    input.val(dateStr);
                    callback(val, input);
                }
            })
        }
    });
}*/
function configInputDateModal(elements, format, callback) {
    let oldValue = "";
    $(document).on("focus", elements, function (event) {
        let input = $(this);
        oldValue = input.val();
        if (oldValue) {
            input.prop("readonly", false);
            let indexTg = oldValue.indexOf(":");
            if (indexTg > 0) {
                this.setSelectionRange(indexTg - 2, indexTg);
            } else {
                this.setSelectionRange(0, 2);
            }
            var offset = input.offset();

            $("#dropdown-date").css("top", offset.top);
            $("#dropdown-date").css("left", offset.left);

            if (!input.data("DateTimePicker")) {
                input.datetimepicker({
                    locale: "vi",
                    format: format,
                    useStrict: true,
                    icons: {
                        date: "ti ti-calendar",
                        up: "ti ti-chevron-up",
                        down: "ti ti-chevron-down",
                        previous: "ti ti-chevron-left",
                        next: "ti ti-chevron-right",
                        time: "ti ti-alarm",
                        close: "ti ti-x",
                    },
                    keyBinds: {
                        left: null,
                        right: null,
                        up: null,
                        down: null,
                    },
                    sideBySide: true,
                    ignoreReadonly: true,
                    widgetParent: $("#dropdown-date"),
                    focusOnShow: false,
                });
            }
        } else {
            input.prop("readonly", true);
        }
    });
    $(document).on("dp.hide", elements, function () {
        let input = $(this);
        let newValue = input.val();

        if (callback && oldValue != newValue && newValue) {
            callback(oldValue, input, function () {
                $("#dropdown-date").empty();
            });
        } else {
            if (!newValue) {
                input.val(oldValue);
            }
        }
        $(this).data("DateTimePicker").destroy();
    });

    $(document).on("click", elements, function (event) {
        var index = this.selectionStart;
        if (index >= 0 && index <= 2) {
            this.setSelectionRange(0, 2);
        } else if (index >= 3 && index <= 5) {
            this.setSelectionRange(3, 5);
        } else if (index >= 3 && index <= 5) {
            this.setSelectionRange(3, 5);
        } else if (index >= 6 && index <= 10 && format.includes("YYYY")) {
            this.setSelectionRange(6, 10);
        } else if (index >= 11 && index <= 13 && format.includes("YYYY")) {
            this.setSelectionRange(11, 13);
        } else if (index >= 14 && index <= 16 && format.includes("YYYY")) {
            this.setSelectionRange(14, 16);
        } else if (index >= 6 && index <= 8 && format.includes("YY")) {
            this.setSelectionRange(6, 8);
        } else if (index >= 9 && index <= 11 && format.includes("YY")) {
            this.setSelectionRange(9, 11);
        } else if (index >= 12 && index <= 14 && format.includes("YY")) {
            this.setSelectionRange(12, 14);
        }
    });
    $(document).on("input", elements, function () {
        if (this.selectionStart == 2) {
            this.setSelectionRange(3, 5);
        }
        if (format.includes("YYYY")) {
            if (this.selectionStart == 5) {
                this.setSelectionRange(6, 10);
            }
            if (this.selectionStart == 10) {
                this.setSelectionRange(11, 13);
            }
            if (this.selectionStart == 13) {
                this.setSelectionRange(14, 16);
            }
        } else {
            if (this.selectionStart == 5) {
                this.setSelectionRange(6, 8);
            }
            if (this.selectionStart == 8) {
                this.setSelectionRange(9, 11);
            }
            if (this.selectionStart == 11) {
                this.setSelectionRange(12, 14);
            }
        }
    });
    $(document).on("keydown", elements, function (event) {
        var input = this;
        if (!this.value) {
            $(this).val("");
            return;
        }
        if (event.key === "ArrowLeft") {
            var index = input.selectionStart;
            if (index === 3) {
                input.setSelectionRange(0, 2);
                event.preventDefault();
            } else if (index === 6) {
                input.setSelectionRange(3, 5);
                event.preventDefault();
            } else if (index === 11 && format.includes("YYYY")) {
                input.setSelectionRange(6, 10);
                event.preventDefault();
            } else if (index === 14 && format.includes("YYYY")) {
                input.setSelectionRange(11, 13);
                event.preventDefault();
            } else if (index === 9 && format.includes("YY")) {
                input.setSelectionRange(6, 8);
                event.preventDefault();
            } else if (index === 12 && format.includes("YY")) {
                input.setSelectionRange(9, 11);
                event.preventDefault();
            }
        }
        if (event.key === "ArrowRight") {
            var index = input.selectionEnd;
            if (index === 2) {
                input.setSelectionRange(3, 5);
                event.preventDefault();
            } else if (index === 5 && format.includes("YYYY")) {
                input.setSelectionRange(6, 10);
                event.preventDefault();
            } else if (index === 10 && format.includes("YYYY")) {
                input.setSelectionRange(11, 13);
                event.preventDefault();
            } else if (index === 13 && format.includes("YYYY")) {
                input.setSelectionRange(14, 16);
                event.preventDefault();
            } else if (index === 5 && format.includes("YY")) {
                input.setSelectionRange(6, 8);
                event.preventDefault();
            } else if (index === 8 && format.includes("YY")) {
                input.setSelectionRange(9, 11);
                event.preventDefault();
            } else if (index === 11 && format.includes("YY")) {
                input.setSelectionRange(12, 14);
                event.preventDefault();
            }
        }
    });
}
function convertToDayTimeFromDate() {
    date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month bắt đầu từ 0
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hour}:${minute}`;
}

function convertToDayTimeFromDateShort() {
    date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month bắt đầu từ 0
    const year = date.getFullYear().toString().slice(-2);
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hour}:${minute}`;
}

function subtractMonthsFromDate(dateString, months) {
    const parts = dateString.split("-");
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month bắt đầu từ 0
    const year = parseInt(parts[2]);

    const date = new Date(year, month, day);
    date.setMonth(date.getMonth() - months);

    const newDay = String(date.getDate()).padStart(2, "0");
    const newMonth = String(date.getMonth() + 1).padStart(2, "0");
    const newYear = date.getFullYear();
    return `${newDay}-${newMonth}-${newYear}`;
}

document.addEventListener("DOMContentLoaded", function () {
    var suggestionBox = $(".suggestionBox");
    var suggestionBoxElement = suggestionBox[0];

    let navItemsLength = $("ul.navbar-nav li").length;
    let dropdownColumns = $(".dropdown-dm .dropdown-menu-column").length;

    if (navItemsLength == 1) {
        $(".dropdown-dm").css({ left: "0%" });
    }
    if (navItemsLength == 2 && dropdownColumns > 1) {
        $(".dropdown-dm").css({ left: "-50%" });
    }
    if (navItemsLength == 3 && dropdownColumns > 1) {
        $(".dropdown-dm").css({ left: "-200%" });
    }
    if (navItemsLength >= 4 && dropdownColumns > 1) {
        $(".dropdown-dm").css({ left: "-240%" });
    }
});

function showModalKetQuaChiDinh(id, maCLS, elm, tbodyId) {
    if (_qXuat) {
        var isXetNghiem = maCLS == "XN" ? true : false;
        var href = isXetNghiem
            ? "/CLS/CLS_PhieuXN/getPDFKetQuaXN"
            : "/CLS/CLS_PhieuCLS/getPDFKetQuaCLS";
        var listPhieu = [];
        if (isXetNghiem) {
            var idLoaiXn = elm.attr("data-idloaixn");
            var matching = $(
                "#" + tbodyId + " tr[data-idloaixn=" + idLoaiXn + "]"
            );
            matching.each(function (index, item) {
                var idPhieuIn = $(item).attr("data-id-pketqua");
                listPhieu.push(idPhieuIn);
            });
        } else {
            listPhieu.push(id);
        }
        if (listPhieu.length > 0) {
            $.ajax({
                url: href,
                method: "POST",
                data: isXetNghiem ? { listID: listPhieu } : "idKQ=" + id,
                xhrFields: {
                    responseType: "blob",
                },
                success: function (response) {
                    var blob = new Blob([response], {
                        type: "application/pdf",
                    }); //this make the magic
                    var blobURL = URL.createObjectURL(blob);
                    iframe.src = blobURL;
                    iframe.onload = function () {
                        setTimeout(function () {
                            iframe.focus();
                            iframe.contentWindow.print();
                            setTimeout(function () {
                                URL.revokeObjectURL(blobURL);
                            }, 1);
                        }, 1);
                    };
                },
                error: function (xhr, status, error) {
                    console.error(error);
                },
            });
        }
    }
}
function isN(a, b) {
    if (a === null || a === undefined || isNaN(a)) {
        return b;
    }
    return a;
}

function convertStringDateTimeLongtoShort(input) {
    // Split the input into date and time parts
    var parts = input.split(" ");
    var datePart = parts[0];
    var timePart = parts[1];

    // Split the date part into day, month, and year
    var dateParts = datePart.split("-");
    var day = dateParts[0];
    var month = dateParts[1];
    var year = dateParts[2];

    // Get the last two digits of the year
    var shortYear = year.slice(-2);

    // Combine the parts into the desired format
    var formattedDate = day + "-" + month + "-" + shortYear;
    var formattedDateTime = formattedDate + " " + timePart;

    return formattedDateTime;
}

function getTenGioiTinhWithMaGioiTinh(maGT) {
    switch (Number(maGT)) {
        case 1:
            return "Nam";
        case 2:
            return "Nữ";
        case 3:
            return "Chưa xác định";
        default:
            return "";
    }
}

//chuỗi string day
function formatStringDayToDay(yyyymmdd) {
    if (!yyyymmdd || yyyymmdd.length !== 8) return "";

    var year = yyyymmdd.substring(0, 4);
    var month = yyyymmdd.substring(4, 6);
    var day = yyyymmdd.substring(6, 8);

    return `${day}-${month}-${year}`;
}

function formatStringNgaySinhToDay(dateString) {
    if (!dateString || dateString.length !== 12) return "";

    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    var hour = dateString.substring(8, 10);
    var minute = dateString.substring(10, 12);

    // Kiểm tra và xử lý các trường hợp
    if (day === "00" && month === "00") {
        return year; // Chỉ lấy năm
    } else {
        if (day === "00") {
            // Lấy tháng-năm
            return `${month}-${year}`;
        } else {
            // Lấy ngày-tháng-năm
            return `${day}-${month}-${year}`;
        }
    }
}
function changeDateTimeFormat(formatInput, formatOutput, dateString) {
    var dateTimeMoment = moment(dateString, formatInput);
    return dateTimeMoment.format(formatOutput);
}

function kiemTra_SLHS_KCB(elements, loaikcb, ngay, url, macls) {
    if (elements[0].tomselect) {
        let idbs = elements[0].tomselect.getValue();
        if (idbs) {
            $.ajax({
                type: "post",
                url: url,
                data: {
                    idbacsi: idbs,
                    loaikcb: loaikcb,
                    ngay: ngay,
                    macls: macls,
                },
                success: function (response) {
                    if (response.statusCode != 200) {
                        showToastWithBg(
                            response.message,
                            response.statusCode,
                            response.color
                        );
                    }
                    if (response.statusCode == 500) {
                        elements[0].tomselect.clear();
                    }
                },
            });
        }
    }
}

$(document).on("keydown", "table .form-table", function (event) {
    var tr = $(this).closest("tr");
    var index = $(this).closest("td").index();
    let checkNextTr = false;
    let key = event.key;
    if ($(this).hasClass("next-row") && key == "Enter") key = "ArrowDown";
    function nextTr(trN) {
        return trN.next().find("td").length != tr.find("td").length
            ? nextTr(trN.next())
            : trN.next();
    }
    function prevTr(trP) {
        return trP.prev().find("td").length != tr.find("td").length
            ? prevTr(trP.prev())
            : trP.prev();
    }
    switch (key) {
        case "ArrowUp":
            if ($(this).hasClass("ts-wrapper")) return;
            tr = prevTr(tr);
            tr.find("td")
                .eq(index)
                .find('input:not([type="checkbox"]), textarea, select')
                .not(":hidden")
                .focus();
            event.preventDefault();
            break;
        case "ArrowDown":
            if ($(this).hasClass("ts-wrapper")) return;
            tr = nextTr(tr);
            tr.find("td")
                .eq(index)
                .find('input:not([type="checkbox"]), textarea, select')
                .not(":hidden")
                .focus();
            event.preventDefault();
            break;
        case "ArrowLeft":
            let checkPrevTr = false;
            if (
                $(this).hasClass("ts-wrapper") ||
                this.tagName == "SELECT" ||
                this.selectionStart == 0
            ) {
                var td = $(this).parent("td");
                td.prevAll().each(function () {
                    if (
                        $(this)
                            .find(
                                'input:not([type="checkbox"]), textarea, select'
                            )
                            .not(":hidden")
                            .not("[readonly]")
                            .not("[disabled]").length > 0
                    ) {
                        $(this)
                            .find(
                                'input:not([type="checkbox"]), textarea, select'
                            )
                            .not(":hidden")
                            .not("[readonly]")
                            .not("[disabled]")
                            .focus();
                        checkPrevTr = true;
                        return false;
                    }
                });
                // nếu là phần tử đầu thì chuyển sang row ở trên mới nếu có
                if (!checkPrevTr && tr.prev().length > 0) {
                    $($.makeArray(tr.prev().find("td")).reverse()).each(
                        function () {
                            if (
                                $(this)
                                    .find(
                                        'input:not([type="checkbox"]), textarea, select'
                                    )
                                    .not(":hidden")
                                    .not("[readonly]")
                                    .not("[disabled]").length > 0
                            ) {
                                $(this)
                                    .find(
                                        'input:not([type="checkbox"]), textarea, select'
                                    )
                                    .not(":hidden")
                                    .not("[readonly]")
                                    .not("[disabled]")
                                    .focus();
                                return false;
                            }
                        }
                    );
                }
                event.preventDefault();
            }
            break;
        case "ArrowRight":
            if (
                $(this).hasClass("ts-wrapper") ||
                this.tagName == "SELECT" ||
                this.selectionStart == this.value.length ||
                !this.value
            ) {
                var td = $(this).parent("td");
                let checkTableThuoc = td
                    .closest("table")
                    .hasClass("tableToaThuoc");
                td.nextAll().each(function () {
                    let elemt = $(this)
                        .find('input:not([type="checkbox"]), textarea, select')
                        .not(":hidden")
                        .not("[readonly]")
                        .not("[disabled]");
                    if (elemt.length > 0) {
                        if (checkTableThuoc) {
                            if ($(this).css("position") != "sticky") {
                                elemt.focus();
                                checkNextTr = true;
                                return false;
                            }
                        } else {
                            elemt.focus();
                            checkNextTr = true;
                            return false;
                        }
                    }
                });
                // nếu là phần tử cuối thì chuyển sang row mới nếu có
                if (!checkNextTr && tr.next().length > 0) {
                    tr.next()
                        .find("td")
                        .each(function () {
                            let elemt = $(this)
                                .find(
                                    'input:not([type="checkbox"]), textarea, select'
                                )
                                .not(":hidden")
                                .not("[readonly]")
                                .not("[disabled]");
                            if (elemt.length > 0) {
                                if (checkTableThuoc) {
                                    if (
                                        $(this).css("position") != "sticky" &&
                                        !elemt.hasClass("gioCTTT")
                                    ) {
                                        elemt.focus();
                                        return false;
                                    }
                                } else {
                                    elemt.focus();
                                    return false;
                                }
                            }
                        });
                }
                event.preventDefault();
            }
            break;
        case "Enter":
            if (
                $(this).hasClass("ts-wrapper") ||
                this.tagName == "SELECT" ||
                this.selectionStart == this.value.length ||
                !this.value
            ) {
                var td = $(this).parent("td");
                let checkTableThuoc = td
                    .closest("table")
                    .hasClass("tableToaThuoc");
                td.nextAll().each(function () {
                    let elemt = $(this)
                        .find('input:not([type="checkbox"]), textarea, select')
                        .not(":hidden")
                        .not("[readonly]")
                        .not("[disabled]");
                    if (elemt.length > 0) {
                        if (checkTableThuoc) {
                            if ($(this).css("position") != "sticky") {
                                elemt.focus();
                                checkNextTr = true;
                                return false;
                            }
                        } else {
                            elemt.focus();
                            checkNextTr = true;
                            return false;
                        }
                    }
                });
                // nếu là phần tử cuối thì chuyển sang row mới nếu có
                if (!checkNextTr && tr.next().length > 0) {
                    tr.next()
                        .find("td")
                        .each(function () {
                            let elemt = $(this)
                                .find(
                                    'input:not([type="checkbox"]), textarea, select'
                                )
                                .not(":hidden")
                                .not("[readonly]")
                                .not("[disabled]");
                            if (elemt.length > 0) {
                                if (checkTableThuoc) {
                                    if (
                                        $(this).css("position") != "sticky" &&
                                        !elemt.hasClass("gioCTTT")
                                    ) {
                                        elemt.focus();
                                        return false;
                                    }
                                } else {
                                    elemt.focus();
                                    return false;
                                }
                            }
                        });
                }
                event.preventDefault();
            }
            break;
        default:
            break;
    }
});

function isSpecificDate(dateString) {
    // Định dạng ngày mục tiêu
    const targetDate = moment("01-01-1900", "DD-MM-YYYY");

    // Định dạng chuỗi ngày đầu vào
    const inputDate = moment(dateString, "DD-MM-YYYY");

    // So sánh ngày
    return inputDate.isSame(targetDate, "day");
}

function configCbCode(datas, callback) {
    var requests = [];
    datas.forEach((data) => {
        var request = $.ajax({
            dataType: "json",
            url: jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var el = this;
                if (el.tomselect) {
                    el.tomselect.destroy();
                }
                var arr = response.map((obj) => ({ ...obj })); // Mỗi TomSelect có options riêng
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    valueField: "ma",
                    labelField: "ma",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: arr,
                    openOnFocus: false,
                    searchField: ["ten", "ma", "viettat"],
                    render: {
                        option: function (item, escape) {
                            return (
                                '<div class="d-flex"><span style="width: 70%;">' +
                                escape(item.ten) +
                                '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                                escape(item.ma) +
                                "]</span></div>"
                            );
                        },
                        no_results: function (data, escape) {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                };
                var mySelect = new TomSelect(el, setting);
                el.tomselect = mySelect;
                mySelect.positionDropdown();
                $(el)
                    .next()
                    .find(".ts-dropdown.single")
                    .css("min-width", "20vw");
                $(el)
                    .next()
                    .children("div.ts-control")
                    .on("click", function () {
                        mySelect.open();
                    });
                if (data.callback) {
                    data.callback();
                }
            });
        });
        requests.push(request);
    });

    if (callback) {
        $.when
            .apply($, requests)
            .done(function () {
                callback();
            })
            .fail(function () {
                console.error("Lỗi JSON");
            });
    }
}
function showModalHinhCls(idVaoVien) {
    showPageloader();
    $.ajax({
        type: "post",
        url: "/CLS/CLS_PhieuCLS/getListHinhCLSXQuang",
        data: {
            idVaoVien: idVaoVien,
        },
        success: function (response) {
            hidePageloader();
            if (response.length > 0) {
                showModalDialog(
                    "Hình ảnh XQuang",
                    `
            <div class="row mb-1" id="photoXquang">
                
            </div>
            `
                );
                response.forEach(function (data) {
                    $(
                        "#photoXquang"
                    ).append(`<div class="col-6 col-sm-2 newPhoto">
													<label class="form-imagecheck mb-2">
														<span class="form-imagecheck-figure">
																	<img src="${data}" class="image-modal form-imagecheck-image">
														</span>
													</label>
										    </div>`);
                });
            } else {
                showToast("Không có hình ảnh");
            }
        },
    });
}

function getPDFLichSuCLS(
    id,
    maCLS,
    elm,
    tbodyId,
    idvv,
    ngaykq,
    qXuat,
    view = false,
    idView
) {
    console.log(id, maCLS, elm, tbodyId, idvv, ngaykq, qXuat);
    if (qXuat) {
        showPageloader();
        var isXetNghiem = maCLS == "XN" ? true : false;
        var href = isXetNghiem
            ? "/CLS/CLS_PhieuXN/getPDFKetQuaXN"
            : "/CLS/CLS_PhieuCLS/getPDFKetQuaCLS";
        var listPhieu = [];
        if (isXetNghiem) {
            var idLoaiXn = elm.attr("data-idloaixn");
            //var matching = $('#' + tbodyId + ' tr[data-idloaixn=' + idLoaiXn + ']');
            var matching = $(
                "#" +
                tbodyId +
                " tr[data-idloaixn=" +
                idLoaiXn +
                "][data-idvv=" +
                idvv +
                "][data-ngaykq=" +
                ngaykq +
                "]"
            );
            matching.each(function (index, item) {
                var idPhieuIn = $(item).attr("data-id-pketqua");
                listPhieu.push(idPhieuIn);
            });
        } else {
            listPhieu.push(id);
        }
        if (listPhieu.length > 0) {
            $.ajax({
                url: href,
                method: "POST",
                data: isXetNghiem ? { listID: listPhieu } : "idKQ=" + id,
                xhrFields: {
                    responseType: "blob",
                },
                success: function (response) {
                    if (response.statusCode == 500) {
                        showToast(response.message, response.statusCode);
                    } else {
                        if (view) {
                            var url = URL.createObjectURL(response);
                            var embedElement = document.querySelector(
                                "#" + idView
                            );
                            embedElement.src = url;
                        } else {
                            var blob = new Blob([response], {
                                type: "application/pdf",
                            }); //this make the magic
                            var blobURL = URL.createObjectURL(blob);
                            iframe.src = blobURL;
                            iframe.onload = function () {
                                setTimeout(function () {
                                    iframe.focus();
                                    iframe.contentWindow.print();
                                    setTimeout(function () {
                                        URL.revokeObjectURL(blobURL);
                                    }, 1);
                                }, 1);
                            };
                        }
                    }
                    hidePageloader();
                },
                error: function (xhr, status, error) {
                    console.error(error);
                },
            });
        } else {
            hidePageloader();
        }
    }
}
function removeAccents(str) {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ",
        "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ",
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}

function getStartAndEndDate(month, quarter, year) {
    let startDate, endDate;
    if (quarter) {
        switch (parseInt(quarter)) {
            case 1:
                startDate = new Date(year, 0, 1); // Tháng 1
                endDate = new Date(year, 3, 0); // Kết thúc ngày 31/3
                break;
            case 2:
                startDate = new Date(year, 3, 1); // Tháng 4
                endDate = new Date(year, 6, 0); // Kết thúc ngày 30/6
                break;
            case 3:
                startDate = new Date(year, 6, 1); // Tháng 7
                endDate = new Date(year, 9, 0); // Kết thúc ngày 30/9
                break;
            case 4:
                startDate = new Date(year, 9, 1); // Tháng 10
                endDate = new Date(year, 12, 0); // Kết thúc ngày 31/12
                break;
            default:
                return { error: "Quý không hợp lệ" };
        }
    }
    // Nếu không có quý, xử lý theo tháng
    else if (month) {
        startDate = new Date(year, month - 1, 1); // Tháng bắt đầu (JS đếm từ 0)
        endDate = new Date(year, month, 0); // Lấy ngày cuối cùng của tháng
    }

    return {
        startDate: startDate,
        endDate: endDate,
    };
}
//on table
function configCbWithOptionElm(datas, callback) {
    datas.forEach((data) => {
        var el = data.elm;
        let setting = {
            selectOnTab: true,
            loadingClass: "Đang tìm kiếm...",
            valueField: "id",
            labelField: "ten",
            placeholder: data.placeholder,
            options: data.options,
            openOnFocus: false,
            searchField: ["ten", "ma", "viettat"],
            dropdownParent: "#dropdow-show",
            onDropdownOpen: function () {
                showDropdownMenu(el, mySelect);
            },
            render: {
                option: function (item, escape) {
                    return (
                        '<div class="d-flex"><span style="width: 70%;">' +
                        escape(item.ten) +
                        '</span><span style="width: 30%; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;text-align: end;" class="ms-auto text-muted">[' +
                        escape(item.viettat) +
                        "]</span></div>"
                    );
                },
                no_results: function (data, escape) {
                    return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                },
            },
            loadThrottle: 400,
        };
        if (data.moreSetting) {
            data.moreSetting(setting);
        }
        if (!el.tomselect) {
            var mySelect = new TomSelect(el, setting);
            mySelect.positionDropdown();

            $(el)
                .next()
                .children("div.ts-control")
                .on("click", function () {
                    mySelect.open();
                });
            if (data.callback) {
                data.callback(mySelect);
            }
        }
    });
}
function tinhTuoi(ngaysinh) {
    if (!ngaysinh) {
        return "Ngày sinh không hợp lệ";
    }

    // Trường hợp nếu chỉ có 4 ký tự (năm sinh)
    if (ngaysinh.length === 4) {
        const yearOfBirth = parseInt(ngaysinh, 10);
        const currentYear = new Date().getFullYear();
        return currentYear - yearOfBirth; // Tính tuổi theo năm
    }

    // Trường hợp ngày sinh đầy đủ (dd-MM-yyyy)
    if (ngaysinh.length === 10) {
        const day = parseInt(ngaysinh.substring(0, 2), 10);
        const month = parseInt(ngaysinh.substring(3, 5), 10) - 1; // Tháng tính từ 0
        const year = parseInt(ngaysinh.substring(6), 10);

        const birthDate = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        // Nếu tuổi nhỏ hơn 1, tính số tháng
        if (age < 1) {
            const months =
                today.getMonth() -
                birthDate.getMonth() +
                (today.getFullYear() - birthDate.getFullYear()) * 12;
            return months + 1; // +1 để tính từ tháng sinh
        }

        return age; // Trả về tuổi tính bằng năm
    }

    return "Định dạng ngày sinh không hợp lệ";
}

function configCbExtensions(datas, callback) {
    var requests = [];
    datas.forEach((data) => {
        var request = $.ajax({
            dataType: "json",
            url: jsonUrl + data.action + ".json",
        }).done(function (response) {
            if (data.dieuKien) {
                response = data.dieuKien(response);
            }
            $(data.className).each(function () {
                var arr = [];
                if ($(this).prop("required")) {
                    arr = response.map((obj) => ({ ...obj }));
                } else {
                    arr = response;
                }
                var el = this;
                let setting = {
                    selectOnTab: true,
                    loadingClass: "Đang tìm kiếm...",
                    valueField: data.code == true ? "ma" : "id", //config code ? truyền (code: true).
                    labelField: "ten",
                    placeholder:
                        data.placeholder == ""
                            ? $(el).attr("placeholder")
                            : data.placeholder,
                    options: arr,
                    openOnFocus: false,
                    searchField: ["ten", "ma", "viettat"],
                    render: {
                        option: function (item, escape) {
                            return `<div class="d-flex  justify-content-between"><span class="w-80">${escape(
                                item.ten
                            )}</span>
                                    <div class="w-20 d-flex justify-content-end">
                                    ${item.active == true
                                    ? `<span class="ms-auto me-2">
                                            <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-edit text-primary UpdateCB"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>
                                        </span>
                                        <span class="ms-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash text-red DeleteCB" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">&lt;
				                                path stroke = "none" d = "M0 0h24v24H0z" fill = "none" & gt;<path d="M4 7l16 0"></path>
				                                <path d="M10 11l0 6"></path><path d="M14 11l0 6"></path>
				                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
				                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                            </svg >
                                        </span>`
                                    : `<span class="ms-auto">
                                            <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back ReturnCB" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" />
                                            </svg>
                                        </span>`
                                }
                                    </div>
                                 </div>`;
                        },
                        no_results: function (data, escape) {
                            return '<div class="no-results">Không tìm thấy dữ liệu </div>';
                        },
                    },
                    loadThrottle: 400,
                    onFocus: function () {
                        if ($(el).attr("dropdown-top")) {
                            this.popper = Popper.createPopper(
                                this.control,
                                this.dropdown,
                                {
                                    placement: "top-start", // Điều chỉnh placement theo ý muốn
                                }
                            );
                        }
                    },
                    onDropdownOpen: function (dropdown) {
                        $(dropdown).find(".custom-footer").remove();
                        let $footer = $(`
                            <div class="custom-footer px-2 py-2 border-top">
                                <div class="row">
                                    <div class="col-8">
                                        <select class="form-select w-100" id="cb_TrangThai">
                                            <option value="1" selected>Đang sử dụng</option>
                                            <option value="0">Đã xoá</option>
                                        </select>
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-primary me-2 w-100" id="btn-ThemMoi">Thêm mới</button>
                                    </div>
                                </div>
                            </div>
                        `);
                        $(dropdown).append($footer);

                        $footer
                            .find("#btn-ThemMoi")
                            .off("click")
                            .on("click", function () {
                                let nameFunction = data.functionEx.add;
                                if (
                                    typeof window[nameFunction] === "function"
                                ) {
                                    window[nameFunction]();
                                }
                            });

                        //$footer.find('#cb_TrangThai').on('change', function () {

                        //});

                        let trangThai =
                            $footer.find("#cb_TrangThai").val() == 1
                                ? true
                                : false;
                        let options = Object.values(
                            $(el)[0].tomselect.options
                        ).filter((x) => x.active == trangThai);
                        $(el)[0].tomselect.clearOptions();
                        $(el)[0].tomselect.addOption(options);
                    },

                    onInitialize: function () {
                        const self = this;
                        $(self.dropdown).on(
                            "mousedown",
                            ".UpdateCB",
                            function (e) {
                                let id = $(this)
                                    .closest(".option")
                                    .data("value");
                                let nameFunction = data.functionEx.update;
                                if (
                                    typeof window[nameFunction] === "function"
                                ) {
                                    window[nameFunction](id);
                                }
                            }
                        );
                        $(self.dropdown).on(
                            "mousedown",
                            ".DeleteCB",
                            function (e) {
                                let id = $(this)
                                    .closest(".option")
                                    .data("value");
                                let nameFunction = data.functionEx.delete;
                                if (
                                    typeof window[nameFunction] === "function"
                                ) {
                                    window[nameFunction](id);
                                }
                            }
                        );
                        $(self.dropdown).on(
                            "mousedown",
                            ".ReturnCB",
                            function (e) {
                                let id = $(this)
                                    .closest(".option")
                                    .data("value");
                                let nameFunction = data.functionEx.delete;
                                if (
                                    typeof window[nameFunction] === "function"
                                ) {
                                    window[nameFunction](id);
                                }
                            }
                        );
                    },
                };
                if (data.moreSetting) {
                    data.moreSetting(setting);
                }
                if (!el.tomselect) {
                    var mySelect = new TomSelect(el, setting);
                    mySelect.positionDropdown();

                    $(el)
                        .next()
                        .children("div.ts-control")
                        .on("click", function () {
                            mySelect.open();
                        });

                    //mySelect.on("mousedown", ".updateCB", function (e) {
                    //    console.log(nameFunction);

                    //    let nameFunction = data.functionEx.update;
                    //    if (typeof window[nameFunction] === 'function') {
                    //        window[nameFunction]();
                    //    }
                    //});
                    //mySelect.on("mousedown", ".deleteCB", function (e) {
                    //    let nameFunction = data.functionEx.delete;
                    //    console.log(nameFunction);

                    //    if (typeof window[nameFunction] === 'function') {
                    //        window[nameFunction]();
                    //    }
                    //});
                }
                if (data.callback) {
                    data.callback();
                }
            });
        });
        requests.push(request);
    });
    if (callback) {
        $.when
            .apply($, requests)
            .done(function () {
                callback();
            })
            .fail(function () {
                console.error("Lỗi JSON");
            });
    }
}

function showModalSuccess(content, firstChoice, secondChoice) {
    $("#modal-success").off("click", "#modal-success-first-choice");
    $("#modal-success").off("click", "#modal-success-second-choice");

    $("#modal-success-content").html(content);
    $("#modal-success-first-choice").text(firstChoice);
    $("#modal-success-second-choice").text(secondChoice);

    $("#modal-success").modal("show");
}

function showModalNotiQr(content, firstChoice, secondChoice) {
    $("#modal-noti-qr").off("click", "#modal-noti-qr-first-choice");
    $("#modal-noti-qr").off("click", "#modal-noti-qr-second-choice");

    $(".vcb-qr-section img").attr("src", content);
    $("#modal-noti-qr-first-choice").text(firstChoice);
    $("#modal-noti-qr-second-choice").text(secondChoice);

    $("#modal-noti-qr").modal("show");
    $(".modal-backdrop").remove();
}

function showModalNotiOneBtn(content, btnChoice, status, onClose) {
    $(".modal-backdrop").remove();
    $("#modal-noti-oneBtn-content").html(content);
    $("#modal-noti-oneBtn-choice").text(btnChoice);

    const header = $("#modal-noti-oneBtn-header");
    header
        .removeClass("bg-danger bg-warning bg-success")
        .addClass(
            status === 500
                ? "bg-danger"
                : status === 400
                    ? "bg-warning"
                    : "bg-success"
        );

    $("#modal-noti-oneBtn").modal("show");

    if (typeof onClose === "function") {
        let handler = function () {
            onClose();
            $("#modal-noti-oneBtn").off("hidden.bs.modal", handler);
        };
        $("#modal-noti-oneBtn").on("hidden.bs.modal", handler);
    }
}
function showModalNotiOneBtnSweetalert(content, btnChoice, status, onClose) {
    Swal.fire({
        title:
            status === 500 ? "Lỗi" : status === 400 ? "Cảnh báo" : "Thông báo",
        text: content,
        icon: status === 500 ? "error" : status === 400 ? "warning" : "success",
        showCancelButton: false,
        confirmButtonText: btnChoice,
    }).then((result) => {
        if (result.isConfirmed && typeof onClose === "function") {
            onClose();
        }
    });
}

function showModalInfoRegisterPackage() {
    $(".modal-backdrop").remove();

    $("#modal-info-registerPackage").modal("show");
}

function formatChucVuList(callback) {
    $.ajax({
        dataType: "json",
        url: `${jsonUrl}Dm_NhanVien.json`,
    }).done(function (data) {
        const result = data.map((item) => {
            const chucVuObj = item.chucVu;

            if (!chucVuObj || typeof chucVuObj !== "object") {
                item.chucVu = null;
            } else {
                const chucVuStr = Object.values(chucVuObj)
                    .filter((val) => val && val.trim() !== "")
                    .join(", ");
                item.chucVu = chucVuStr === "" ? null : chucVuStr;
            }

            return item;
        });
        callback(result);
    });
}
