/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: {
      import: './resources/react/App.tsx',
    },
  },
  /* optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      name: (module, chunks, cacheGroupKey) => {
        const allChunksNames = chunks.map((chunk) => chunk.name).join('-');

        return `vendors-${allChunksNames}`;
      },
    },
    runtimeChunk: { name: 'runtime' }, // the same that runtimeChunk: 'single'
  }, */
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/js'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                },
              },
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.(jpe?g|gif|png|bmp|webp|ttf)$/,
            type: 'asset/resource',
          },
          {
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    /* alias: {
      '@mui/base': '@mui/base/modern',
      // '@mui/lab': '@mui/lab/modern',
      '@mui/material': '@mui/material/modern',
      '@mui/styled-engine': '@mui/styled-engine/modern',
      '@mui/system': '@mui/system/modern',
      '@mui/utils': '@mui/utils/modern',
      '@mui/x-data-grid': '@mui/x-data-grid/modern',
      '@mui/x-date-pickers': '@mui/x-date-pickers/modern',
    }, */
  },
  plugins: [new CleanWebpackPlugin()],
};
