import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import filesize from "rollup-plugin-filesize";

export default {
  entry: "src/index.js",
  dest: "dist/index.js",
  format: "cjs",
  sourceMap: "inline",
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    peerDepsExternal(),
    filesize()
  ]
};
