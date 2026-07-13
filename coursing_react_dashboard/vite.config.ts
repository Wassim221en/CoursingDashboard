import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import commonjs from '@rollup/plugin-commonjs';
// import reactRefresh from '@vitejs/plugin-react-refresh';
//
// https://vitejs.dev/config/
export default defineConfig({
  server: { host: '127.0.0.1' },
  plugins: [react(), tsconfigPaths(), commonjs()],
  optimizeDeps: {
    include: ['ckeditor5-custom-build', '@mui/icons-material'],
  },
  build: {
    commonjsOptions: { exclude: ['ckeditor5-custom-build'], include: [] },
    rollupOptions: {
      onwarn: (warning, defaultHandler) => {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        return defaultHandler(warning);
      },
    },
  },
});
