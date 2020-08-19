module.exports = {
  mode: "development",
  entry: "./index.ts",
  output: {
    path: __dirname + "/../static/build",
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
