import { Box, SxProps, Typography } from '@mui/material';
import React, { CSSProperties, FC } from 'react';

const CONTAINER_STYLES: SxProps = {
  width: '100%',
  background: 'rgba(0,0,0,0.7)',
  display: 'grid',
  alignItems: 'center',
  borderRadius: 1,
  opacity: 0.9,
};

interface IIFrameContainerProps {
  url: string | null;
  noUrlMessage?: string;
  height?: string;
  width?: string;
  styles?: CSSProperties;
  title?: string;
}
const IFrameContainer: FC<IIFrameContainerProps> = ({
  url,
  height = '450px',
  width = '100%',
  noUrlMessage,
  styles = {},
  title = 'YouTube video player',
}) => {
  if (!url) {
    return (
      <Box sx={{ ...CONTAINER_STYLES, height }} component="div">
        <Typography
          textAlign="center"
          variant="h6"
          component="h6"
          color="white"
        >
          {noUrlMessage || 'N/A'}
        </Typography>
      </Box>
    );
  }

  return (
    <iframe
      width={width}
      height={height}
      src={url}
      title={title}
      frameBorder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ borderRadius: '10px', ...styles }}
    />
  );
};

export default IFrameContainer;
