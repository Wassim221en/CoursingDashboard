import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import loaderSvg from '../../../../public/assets/svgs/loadiong-placeholder.svg';

interface ILoadingPlaceholderProps {
  height?: string;
  loadingText?: string;
}

const LoadingPlaceholder: FC<ILoadingPlaceholderProps> = ({
  height,
  loadingText,
}) => (
  <Box
    sx={{
      width: '100%',
      height: height || '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          // rotate: [0, 360, 180, 0, 0],
        }}
        transition={{
          duration: 0.7,
          ease: 'linear',
          times: [0, 0.5, 0.2, 0.2, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        <LazyLoadImage
          style={{
            margin: 'auto',
            width: '50px',
          }}
          src={loaderSvg}
        />
      </motion.div>

      {loadingText && (
        <Typography variant="h6" color="gray">
          {loadingText}
        </Typography>
      )}
    </Box>
  </Box>
);

export default LoadingPlaceholder;
