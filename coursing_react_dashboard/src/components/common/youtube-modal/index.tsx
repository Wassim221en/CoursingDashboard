import { Box, Dialog } from '@mui/material';
import React from 'react';
import IFrameContainer from '../i-frame-container';
import LoadingPlaceholder from '../loading-placeholder/loading-placeholder.component';

type TYoutubeModalProps = {
  open: boolean;
  Link: string;
  handleClose: () => void;
};

function YoutubeModal({ open, Link, handleClose }: TYoutubeModalProps) {
  return Link ? (
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
        <IFrameContainer
          styles={{
            aspectRatio: '16 / 9',
          }}
          url={Link}
        />
      </Box>
    </Dialog>
  ) : (
    <LoadingPlaceholder />
  );
}

export default YoutubeModal;
