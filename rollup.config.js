import pkg from './package.json';
import rollupConfig from '../../scripts/rollup/baseConfig';

export default rollupConfig(
  pkg,
  {
    input: 'src/index.js',
    globals: {
      react: 'React',
      'aws-amplify': 'Amplify',
    },
  },
  'useAmplifyAuth',
);
