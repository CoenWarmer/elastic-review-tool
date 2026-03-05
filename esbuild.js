const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const extensionOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node22',
  sourcemap: true,
  minify: false,
};

/** @type {import('esbuild').BuildOptions} */
const webviewOptions = {
  entryPoints: ['src/webview/index.tsx'],
  bundle: true,
  outfile: 'dist/webview.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  minify: false,
  jsx: 'automatic',
};

if (isWatch) {
  Promise.all([
    esbuild.context(extensionOptions).then((ctx) => ctx.watch()),
    esbuild.context(webviewOptions).then((ctx) => ctx.watch()),
  ]).then(() => {
    console.log('[esbuild] Watching for changes…');
  });
} else {
  Promise.all([
    esbuild.build(extensionOptions),
    esbuild.build(webviewOptions),
  ]).then(() => {
    console.log('[esbuild] Build complete.');
  }).catch(() => process.exit(1));
}
