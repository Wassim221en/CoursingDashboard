/* eslint-disable jsx-a11y/media-has-caption */
import { Box } from '@mui/material';
import React, { useRef, useState } from 'react';

const VideoThumbnailGenerator: React.FC<{ videoUrl: string }> = ({
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  const generateThumbnail = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame onto canvas
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL and set as thumbnail URL
      setThumbnailUrl(canvas.toDataURL());
    }
  };

  return (
    <Box>
      <video
        style={{ width: '100%', height: '100%' }}
        ref={videoRef}
        src={videoUrl}
        onLoadedData={generateThumbnail}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* {thumbnailUrl && <img src={thumbnailUrl} alt="video thumbnail" />} */}
    </Box>
  );
};

export default VideoThumbnailGenerator;
