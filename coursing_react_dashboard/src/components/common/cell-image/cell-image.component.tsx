import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function CellImage({
  imageSrc,
  cropRatio = 1,
}: {
  imageSrc: string;
  cropRatio?: number;
}) {
  return (
    <LazyLoadImage
      src={imageSrc}
      style={{
        objectFit: 'cover',
        aspectRatio: cropRatio,
        width: 50,
        height: 50,
        borderRadius: 4,
      }}
    />
  );
}

export default CellImage;
