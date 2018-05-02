import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import filesize from "rollup-plugin-filesize";
import alias from "rollup-plugin-alias";

const baseconfig = () => ({
  entry: "src/index.js",
  sourceMap: false,
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    peerDepsExternal(),
    filesize(),
    alias({
      react: "preact-compat",
      "react-dom": "preact-compat"
    })
  ]
});

export default [
  {
    ...baseconfig(),
    format: "cjs",
    dest: "dist/index.js"
  },
  {
    ...baseconfig(),
    format: "es",
    dest: "dist/index.m.js"
  }
];
