import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

module.exports = {
  input: './client/admin.js',
  output: {
    file: './public/dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      sourceMaps: true,
      presets: [
        [
          '@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 2,
            targets: '> 0.25%, not dead'
          },
        ],
      ],
    }),
    resolve(),
    commonjs(),
  ],
};
