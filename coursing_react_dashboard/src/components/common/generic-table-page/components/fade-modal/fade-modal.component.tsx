import { FC, PropsWithChildren } from 'react';
import {
  Card,
  Backdrop,
  Fade,
  Modal,
  IconButton,
  Box,
  Typography,
  SxProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingPlaceholder from '../../../loading-placeholder/loading-placeholder.component';

interface ModalProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
  onClose?: () => void;
  width?: number | string;
  padding?: number;
  keepMounted?: boolean;
  modalTitle?: string;
  isDialog?: boolean;
  isLoading?: boolean;
}

// eslint-disable-next-line react/function-component-definition
const FadeModal: FC<PropsWithChildren<ModalProps>> = ({
  open,
  setOpen,
  onClose,
  children,
  width = 400,
  padding = 4,
  keepMounted = false,
  modalTitle = '',
  isDialog,
  isLoading = false,
}) => {
  const handleClose = () => {
    onClose?.();
    if (setOpen) {
      setOpen(false);
    }
  };

  const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: '95%',
      sm: width,
    },
    borderRadius: '10px',
    border: '1px solid #666',
  };

  return (
    <Modal
      keepMounted={keepMounted}
      open={open}
      onClose={handleClose}
      // disableScrollLock
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
    >
      <Fade in={open}>
        <Card sx={style}>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              position: 'sticky',
              top: 0,
              py: 2,
              borderBottom: !isDialog ? 'solid 1px rgba(0,0,0,0.1)' : 'unset',
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 13,
                right: 13,
              }}
              onClick={handleClose}
              data-cy="close-modal-button"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              fontSize={{
                xs: 26,
                sm: 30,
              }}
            >
              {modalTitle}
            </Typography>
          </Box>
          <Box
            sx={{
              paddingX: { xs: 2, sm: padding },
              paddingBottom: { xs: 2, sm: padding },
              maxHeight: '80vh',
              overflowY: 'auto',
              pt: 2,
            }}
          >
            {isLoading ? <LoadingPlaceholder /> : children}
          </Box>
        </Card>
      </Fade>
    </Modal>
  );
};
export default FadeModal;

