import { build } from 'esbuild';

async function buildServer() {
  try {
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: 'dist',
      external: [
        // Firebase
        'firebase',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/analytics',
        // Express and middleware
        'express',
        'ws',
        'cors',
        'helmet',
        'compression',
        'morgan',
        'dotenv',
        // Node.js built-ins
        'fs',
        'path',
        'url',
        'http',
        'https',
        'crypto',
        'util',
        'events',
        'stream',
        'buffer',
        'querystring',
        'os',
        'child_process',
        'cluster',
        'dns',
        'net',
        'tls',
        'zlib',
        'readline',
        'repl',
        'tty',
        'vm',
        'worker_threads',
        // Development dependencies
        '@babel/*',
        'lightningcss',
        'postcss',
        'tailwindcss',
        'vite',
        '@vitejs/*',
        'esbuild'
      ],
      sourcemap: true,
      minify: false,
      keepNames: true,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log('✅ Server build completed successfully');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

buildServer();
