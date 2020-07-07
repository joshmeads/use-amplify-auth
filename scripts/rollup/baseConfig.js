import { terser } from 'rollup-plugin-terser';

export default function(pkg, options = {}, pkgName) {
  const config = {
    input: 'src/index.js',
    ...options,
    output: [
      ...(pkg.main
        ? [
            {
              file: pkg.main,
              format: 'cjs',
            },
          ]
        : []),
      ...(pkg.module
        ? [
            {
              file: pkg.module,
              format: 'esm',
            },
          ]
        : []),
      ...(pkg.browser
        ? [
            {
              file: pkg.browser,
              format: 'iife',
              name: pkgName || pkg.name,
            },
          ]
        : []),
      ...(options.output ? options.output : []),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...(options.external ? options.external : []),
    ],
    plugins: [terser(), ...(options.plugins ? options.plugins : [])],
  };
  return config;
}
