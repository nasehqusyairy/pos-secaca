// utils/sweetAlert.js
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const showToastSuccess = (message: string) => {
    return Toast.fire({
        icon: "success",
        title: message,
    });
}

export const showToastError = (message: string) => {
    return Toast.fire({
        icon: "error",
        title: message
    });
}

export const showSuccessAlert = (message: string) => {
    return Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
    });
};

export const showErrorAlert = (message: string) => {
    return Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
    });
};

export const showConfirmationAlert = (title: string, message: string, btnTitleConfirm: string, btnTitleCancel: string, callback: any) => {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: btnTitleConfirm,
        confirmButtonColor: 'blue',
        cancelButtonText: btnTitleCancel,
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
};

export const showConfirmationDeleteAlert = (name: string, status: string, callback: any) => {
    const message = status === 'active' ? 'Non Aktifkan' : 'Mengaktifkan kembali'
    const confirmTitle = status === 'active' ? 'Archive' : 'Active'

    return Swal.fire({
        title: '',
        text: `Apakah kamu yakin ${message} ${name} ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: confirmTitle,
        cancelButtonText: 'Cancel',
        confirmButtonColor: 'red',
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
};

export const showConfirmationApprovalAlert = (name: string, action: string, callback: any) => {
    const message = action === 'approve' ? 'menyetujui' : 'Menolak'
    const confirmButtonText = action === 'approve' ? 'Setuju' : 'Tolak'
    const confirmButtonColor = action === 'approve' ? 'green' : 'red'

    return Swal.fire({
        title: '',
        text: `Apakah kamu yakin ${message} ${name} ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Batal',
        confirmButtonColor,
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
};

export const showConfirmationDeletePermanentAlert = (name: string, callback: any) => {
    return Swal.fire({
        title: '',
        text: `Apakah kamu yakin menghapus ${name} ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: 'Cancel',
        confirmButtonColor: 'red'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
};