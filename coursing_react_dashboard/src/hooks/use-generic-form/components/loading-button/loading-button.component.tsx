/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import loaderSvg from '../../../../../public/assets/svgs/loadiong-placeholder.svg';

interface LoadingButtonProps {
  isSubmitting?: boolean;
  width?: string;
  loadingSize?: number;
  text?: string;
  [key: string]: any;
  disableCancelBtn?: boolean;
  progressPercent?: number;
  onAbortClick?: () => void;
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="primary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const LoadingButton = ({
  isSubmitting,
  loadingSize,
  width,
  text,
  disableCancelBtn,
  progressPercent,
  onAbortClick,
  ...props
}: LoadingButtonProps) => {
  const LOADING_STYLE = {
    width: width || '100%',
  };

  return (
    <Box display="flex">
      <Button
        disabled={isSubmitting}
        variant="contained"
        type="submit"
        sx={LOADING_STYLE}
        {...props}
      >
        {isSubmitting && progressPercent !== undefined ? (
          <CircularProgressWithLabel value={progressPercent!} color="primary" />
        ) : isSubmitting && progressPercent === undefined ? (
          // <HashLoader color="#808080" size={loadingSize || 20} />
          <motion.div
            animate={{
              rotate: [0, 360, 360, 0, 0],
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
                width: '20px',
              }}
              src={loaderSvg}
            />
          </motion.div>
        ) : (
          text
        )}
      </Button>
      {isSubmitting && progressPercent !== undefined && (
        <Button type="submit" onClick={onAbortClick} sx={{ zIndex: 9999 }}>
          <CancelIcon />
        </Button>
      )}
    </Box>
  );
};

export default LoadingButton;
