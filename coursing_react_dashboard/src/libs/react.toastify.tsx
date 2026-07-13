import { Typography } from '@mui/material';
import { ToastOptions, toast } from 'react-hot-toast';

const componentAs = 'h6';
const variant = 'h6';
const loadingMessage = 'جار التحميل';

export const showSuccess = (message: string, _ToastOptions?: ToastOptions) =>
  toast.success(
    <div onClick={() => toast.dismiss()} aria-hidden>
      <Typography
        data-cy="success-toast"
        variant={variant}
        component={componentAs}
      >
        {message}
      </Typography>
    </div>,
    _ToastOptions,
  );

export const showError = (message: string, _ToastOptions?: ToastOptions) =>
  toast.error(
    <div onClick={() => toast.dismiss()} aria-hidden>
      <Typography
        data-cy="error-toast"
        variant={variant}
        component={componentAs}
      >
        {message}
      </Typography>
    </div>,

    _ToastOptions,
  );

// export const showWarn = (message: string, _ToastOptions?: ToastOptions) =>
//   toast.warn(
//     <div>
//       <Typography
//         data-cy="warn-toast"
//         variant={variant}
//         component={componentAs}
//       >
//         {message}
//       </Typography>
//     </div>,
//     _ToastOptions,
//   );

export const showLoading = (
  message: string = loadingMessage,
  _ToastOptions?: ToastOptions,
  autoCloseTime: number = 2000,
) => {
  setTimeout(() => {
    toast.dismiss(message);
  }, autoCloseTime);

  return toast.loading(
    <div>
      <Typography variant={variant} component={componentAs}>
        {message}
      </Typography>
    </div>,
    { id: message },
  );
};
