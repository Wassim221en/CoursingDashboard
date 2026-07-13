import { Box, Dialog } from '@mui/material';
import React from 'react';
import QRCode from 'react-qr-code';

type TYoutubeModalProps = {
  open: boolean;
  Link: string;
  handleClose: () => void;
};

function QrModal({ open, Link, handleClose }: TYoutubeModalProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      sx={{
        backgroundColor: '#fff0',
        '.mui-style-rtl-11x7d9l-MuiPaper-root-MuiDialog-paper': {
          boxShadow: 'none',
          backgroundColor: '#fff0',
        },
        '.MuiPaper-root': {
          boxShadow: 'none',
          backgroundColor: '#fff0',
        },
      }}
    >
      <Box
        component="div"
        py={2}
        sx={{
          boxShadow: 'none',
          '.mui-style-rtl-11x7d9l-MuiPaper-root-MuiDialog-paper': {
            boxShadow: 'none',
            backgroundColor: '#fff0',
          },
          overflow: 'hidden',
          borderRadius: '5px',
        }}
      >
        <QRCode size={350} value={Link} bgColor="#fff" />;
      </Box>
    </Dialog>
  );
}

export default QrModal;
