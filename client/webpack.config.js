module.exports = {
  mode: "development",
  entry: "./index.ts",
  output: {
    path: __dirname + "/build",
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
