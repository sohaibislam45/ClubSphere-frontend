import Swal from 'sweetalert2';

// ClubSphere theme colors matching the UI
const theme = {
  primary: '#38e07b',
  primaryHover: '#2ccb6a',
  backgroundDark: '#111714',
  cardDark: '#1c2620',
  borderDark: '#29382f',
  textSecondary: '#9eb7a8',
  textWhite: '#ffffff',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#38e07b',
  info: '#3b82f6',
};

// Inject global styles once
if (typeof document !== 'undefined' && !document.getElementById('swal2-clubsphere-theme')) {
  const style = document.createElement('style');
  style.id = 'swal2-clubsphere-theme';
  style.textContent = `
    .swal2-popup {
      background: ${theme.cardDark} !important;
      border: 1px solid ${theme.borderDark} !important;
      border-radius: 1rem !important;
      color: ${theme.textWhite} !important;
      font-family: "Spline Sans", sans-serif !important;
    }
    .swal2-title {
      color: ${theme.textWhite} !important;
      font-weight: 700 !important;
    }
    .swal2-html-container {
      color: ${theme.textSecondary} !important;
    }
    .swal2-confirm {
      background-color: ${theme.primary} !important;
      color: ${theme.backgroundDark} !important;
      border: none !important;
      border-radius: 9999px !important;
      font-weight: 700 !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.2s !important;
    }
    .swal2-confirm:hover {
      background-color: ${theme.primaryHover} !important;
      transform: scale(1.02) !important;
    }
    .swal2-confirm:active {
      transform: scale(0.98) !important;
    }
    .swal2-cancel {
      background-color: ${theme.borderDark} !important;
      color: ${theme.textWhite} !important;
      border: none !important;
      border-radius: 9999px !important;
      font-weight: 700 !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.2s !important;
    }
    .swal2-cancel:hover {
      background-color: ${theme.borderDark}cc !important;
    }
    .swal2-close {
      color: ${theme.textSecondary} !important;
    }
    .swal2-close:hover {
      color: ${theme.textWhite} !important;
    }
    .swal2-input {
      background-color: ${theme.backgroundDark} !important;
      border: 1px solid ${theme.borderDark} !important;
      color: ${theme.textWhite} !important;
      border-radius: 9999px !important;
      padding: 0.875rem 1rem !important;
    }
    .swal2-input:focus {
      border-color: ${theme.primary} !important;
      box-shadow: 0 0 0 3px ${theme.primary}33 !important;
    }
    .swal2-input select,
    select.swal2-input {
      background-color: ${theme.backgroundDark} !important;
      border: 1px solid ${theme.borderDark} !important;
      color: ${theme.textWhite} !important;
      border-radius: 9999px !important;
      padding: 0.875rem 1rem !important;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239eb7a8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem !important;
    }
    .swal2-input select:focus,
    select.swal2-input:focus {
      border-color: ${theme.primary} !important;
      box-shadow: 0 0 0 3px ${theme.primary}33 !important;
      outline: none;
    }
    .swal2-validation-message {
      background-color: ${theme.error} !important;
      color: ${theme.textWhite} !important;
    }
    .swal2-icon.swal2-success {
      border-color: ${theme.success} !important;
      color: ${theme.success} !important;
    }
    .swal2-icon.swal2-success [class^=swal2-success-line] {
      background-color: ${theme.success} !important;
    }
    .swal2-icon.swal2-success [class^=swal2-success-ring] {
      border-color: ${theme.success} !important;
    }
    .swal2-icon.swal2-error {
      border-color: ${theme.error} !important;
      color: ${theme.error} !important;
    }
    .swal2-icon.swal2-error [class^=swal2-x-mark-line] {
      background-color: ${theme.error} !important;
    }
    .swal2-icon.swal2-warning {
      border-color: ${theme.warning} !important;
      color: ${theme.warning} !important;
    }
    .swal2-icon.swal2-info {
      border-color: ${theme.info} !important;
      color: ${theme.info} !important;
    }
    .swal2-icon.swal2-question {
      border-color: ${theme.textSecondary} !important;
      color: ${theme.textSecondary} !important;
    }
  `;
  document.head.appendChild(style);
}

// Configure SweetAlert2 with ClubSphere theme
const swalConfig = {
  color: theme.textWhite,
  background: theme.cardDark,
  backdrop: 'rgba(17, 23, 20, 0.8)',
  confirmButtonColor: theme.primary,
  cancelButtonColor: theme.borderDark,
  denyButtonColor: theme.error,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  denyButtonText: 'No',
  buttonsStyling: true,
};

// Create a custom Swal instance with default config
const SwalThemed = Swal.mixin(swalConfig);

// Export both the themed instance and theme colors
export default SwalThemed;
export { SwalThemed, theme };

