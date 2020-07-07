import externalGlobals from "rollup-plugin-external-globals";
import pkg from './package.json';
import rollupConfig from './scripts/rollup/baseConfig';

export default rollupConfig(
  pkg,
  {
    input: 'src/index.js',
    plugins: [
      externalGlobals({
        react: 'React',
        'aws-amplify': 'Amplify',
      })
    ]
  },
  'useAmplifyAuth',
);
