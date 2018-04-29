import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

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
    commonjs()
  ]
};
