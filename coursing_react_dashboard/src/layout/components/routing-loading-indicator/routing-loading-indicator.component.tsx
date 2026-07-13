import { Box, LinearProgress } from "@mui/material";

const RoutingLoadingIndicator = () => (
  <Box
    component="div"
    sx={{
      width: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100000,
    }}
  >
    <LinearProgress variant="indeterminate" sx={{ padding: 0.2 }} />
  </Box>
);

export default RoutingLoadingIndicator;
