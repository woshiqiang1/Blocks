import uglify from 'rollup-plugin-uglify';
import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";
import { minify } from 'uglify-es'
import pkg from './package.json'

export default {
  entry: 'src/index.js',
  targets: [
    { dest: pkg.main, format: 'cjs' },
    { dest: pkg.module, format: 'es' },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({}, minify),
    filesize()
  ]
}