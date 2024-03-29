import react from '@vitejs/plugin-react-swc';
import { builtinModules } from 'module';
import { join } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { chrome } from '../../.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@/': join(PACKAGE_ROOT, 'src') + '/',
      '@domain': join(PACKAGE_ROOT, '../domain'),
    },
  },
  plugins: [react(), svgr()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        app: join(PACKAGE_ROOT, 'app.html'),
        auth: join(PACKAGE_ROOT, 'auth.html'),
        select: join(PACKAGE_ROOT, 'select.html'),
      },
      external: [...builtinModules.flatMap(p => [p, `node:${p}`])],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  test: {
    coverage: {
      all: true,
      src: join(PACKAGE_ROOT, 'src'),
      exclude: [
        '__bootstrap__',
        '**/__fixtures__',
        '**/__tests__',
        '**/*.d.ts',
        '**/*.spec.{ts,tsx}',
        '**/domain',
        '**/index.{ts,tsx}',
      ],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
});
