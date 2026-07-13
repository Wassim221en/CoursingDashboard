import React from "react";
import { Box, Typography } from "@mui/material";

const primary = "#85AED0";
function NotFoundPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: primary,
      }}
    >
      <Typography variant="h6" style={{ color: "white", textAlign: "center" }}>
        OH NO !!!
      </Typography>
      <Typography variant="h1" style={{ color: "white" }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      {/* <Button variant="contained">Back Home</Button> */}
    </Box>
  );
}

export default NotFoundPage;
