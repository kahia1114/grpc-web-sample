module.exports = {
  mode: "development",
  entry: "./main.ts",
  output: {
    path: __dirname + "/../static/build",
    filename: "bundle.js",
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
