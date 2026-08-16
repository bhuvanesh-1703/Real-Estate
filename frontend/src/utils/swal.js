import Swal from 'sweetalert2';

// Dark Slate & Sapphire Blue styled SweetAlert instance
export const darkSwal = Swal.mixin({
  background: '#1E293B',
  color: '#F8FAFC',
  confirmButtonColor: '#3B82F6',
  cancelButtonColor: '#64748B',
  customClass: {
    popup: 'rounded-3xl border border-slate-700 shadow-2xl font-sans',
    title: 'font-serif-fraunces font-bold text-white',
    htmlContainer: 'text-slate-300 font-sans text-sm',
    confirmButton: 'px-5 py-2.5 rounded-xl font-bold font-sans shadow-lg shadow-blue-500/25',
    cancelButton: 'px-5 py-2.5 rounded-xl font-bold font-sans'
  }
});

/**
 * Toast Notification Popup
 */
export const showToast = (title, icon = 'success') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#0F172A',
    color: '#F8FAFC',
    customClass: {
      popup: 'rounded-2xl border border-slate-700 shadow-xl font-mono text-xs'
    }
  });
};

/**
 * Custom Styled Alert Modal
 */
export const showAlert = ({ title, text, icon = 'info', confirmButtonText = 'OK' }) => {
  return darkSwal.fire({
    title,
    text,
    icon,
    confirmButtonText
  });
};

/**
 * Custom Confirmation Modal for Deletions / Action Prompts
 */
export const confirmAction = ({ title, text, confirmButtonText = 'Yes, Proceed', cancelButtonText = 'Cancel', icon = 'warning' }) => {
  return darkSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true
  });
};
