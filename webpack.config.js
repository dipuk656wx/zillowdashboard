const path = require("path");
const webpack = require("webpack");


module.exports = {
  target: "web",
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "build.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  // Explicitly set devtool to false
  devtool: false,
  resolve: {
    extensions: [".js", ".tsx", ".json", ".ts"],
  },
};