import React from "react";
import { Grid } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getImageServerLink } from "utils/helpers";
import Typography from "@mui/material/Typography";

function TableImages({ images }: { images: string[] }) {
  return !images.length ? (
    <Typography variant="h6" textAlign="center">
      No Images
    </Typography>
  ) : (
    <Grid container spacing={1}>
      {images.map((image) => (
        <Grid key={image} item xs={12} md={4}>
          <LazyLoadImage
            src={getImageServerLink(image)}
            style={{
              objectFit: "cover",
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: 8,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default TableImages;
