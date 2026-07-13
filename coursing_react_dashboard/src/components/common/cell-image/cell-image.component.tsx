import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getImageServerLink } from 'utils/helpers';

function CellImage({
  imageSrc,
  cropRatio = 1,
  absoluteUrl = false,
}: {
  imageSrc: string;
  cropRatio?: number;
  absoluteUrl?: boolean;
}) {
  return (
    <LazyLoadImage
      src={absoluteUrl ? imageSrc : getImageServerLink(imageSrc)}
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
