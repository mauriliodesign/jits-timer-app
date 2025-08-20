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
      packages: 'external',
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
