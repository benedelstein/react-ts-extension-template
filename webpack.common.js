const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const ejs = require('ejs');
const {version} = require('./package.json');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'popup/popup': "./popup/index.tsx",
    content: "./content.ts",
    background: "./background.ts",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // Creates style nodes from JS strings
          },
          {
            loader: "css-loader" // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'), to: './',
          globOptions: {
            ignore: ['**/manifest.json'],
          },
        },
        // Append variables to popup.html
        {from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml},
        // Update manifest version from package.json
        {
          from: '../public/manifest.json',
          to: 'manifest.json',
          transform: (content) => {
            const jsonContent = JSON.parse(content);
            jsonContent.version = version;
            return JSON.stringify(jsonContent, null, 2);
          },
        },
      ]
    }),
  ],
  mode: 'production',
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}
