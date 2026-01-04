import Swal from 'sweetalert2';

// ClubSphere theme colors for light and dark modes
const lightTheme = {
  primary: '#38e07b',
  primaryHover: '#2ccb6a',
  background: '#ffffff',
  backgroundLight: '#f6f8f7',
  card: '#ffffff',
  border: '#e2e8f0',
  textMain: '#111714',
  textMuted: '#64748b',
  textWhite: '#ffffff',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#38e07b',
  info: '#3b82f6',
};

const darkTheme = {
  primary: '#38e07b',
  primaryHover: '#2ccb6a',
  background: '#111714',
  backgroundLight: '#111714',
  card: '#1c2620',
  border: '#29382f',
  textMain: '#ffffff',
  textMuted: '#9eb7a8',
  textWhite: '#ffffff',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#38e07b',
  info: '#3b82f6',
};

// Function to get current theme
const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

// Function to get theme colors
const getTheme = () => {
  return getCurrentTheme() === 'dark' ? darkTheme : lightTheme;
};

// Function to create styles based on theme
const createStyles = (theme) => {
  return `
    .swal2-popup {
      background: ${theme.card} !important;
      border: 1px solid ${theme.border} !important;
      border-radius: 1rem !important;
      color: ${theme.textMain} !important;
      font-family: "Spline Sans", sans-serif !important;
    }
    .swal2-title {
      color: ${theme.textMain} !important;
      font-weight: 700 !important;
    }
    .swal2-html-container {
      color: ${theme.textMuted} !important;
    }
    .swal2-confirm {
      background-color: ${theme.primary} !important;
      color: #111714 !important;
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
      background-color: ${theme.border} !important;
      color: ${theme.textMain} !important;
      border: none !important;
      border-radius: 9999px !important;
      font-weight: 700 !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.2s !important;
    }
    .swal2-cancel:hover {
      background-color: ${theme.border}cc !important;
    }
    .swal2-close {
      color: ${theme.textMuted} !important;
    }
    .swal2-close:hover {
      color: ${theme.textMain} !important;
    }
    .swal2-input {
      background-color: ${theme.background} !important;
      border: 1px solid ${theme.border} !important;
      color: ${theme.textMain} !important;
      border-radius: 9999px !important;
      padding: 0.875rem 1rem !important;
    }
    .swal2-input:focus {
      border-color: ${theme.primary} !important;
      box-shadow: 0 0 0 3px ${theme.primary}33 !important;
    }
    .swal2-input select,
    select.swal2-input {
      background-color: ${theme.background} !important;
      border: 1px solid ${theme.border} !important;
      color: ${theme.textMain} !important;
      border-radius: 9999px !important;
      padding: 0.875rem 1rem !important;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
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
      border-color: ${theme.textMuted} !important;
      color: ${theme.textMuted} !important;
    }
  `;
};

// Function to update styles
const updateStyles = () => {
  const styleId = 'swal2-clubsphere-theme';
  let styleElement = document.getElementById(styleId);
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  const currentTheme = getTheme();
  styleElement.textContent = createStyles(currentTheme);
};

// Initialize styles
if (typeof document !== 'undefined') {
  updateStyles();
  
  // Watch for theme changes
  const observer = new MutationObserver(() => {
    updateStyles();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

// Configure SweetAlert2 with ClubSphere theme
const getSwalConfig = () => {
  const theme = getTheme();
  return {
    color: theme.textMain,
    background: theme.card,
    backdrop: getCurrentTheme() === 'dark' 
      ? 'rgba(17, 23, 20, 0.8)' 
      : 'rgba(0, 0, 0, 0.5)',
    confirmButtonColor: theme.primary,
    cancelButtonColor: theme.border,
    denyButtonColor: theme.error,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    denyButtonText: 'No',
    buttonsStyling: true,
  };
};

// Create a custom Swal instance with default config
const SwalThemed = Swal.mixin(getSwalConfig());

// Export both the themed instance and theme colors
export default SwalThemed;
export { SwalThemed, lightTheme, darkTheme, getTheme, getCurrentTheme };
