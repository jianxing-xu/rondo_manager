// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    "process.env.BASE_API": "http://localhost:8080/api"
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
});
