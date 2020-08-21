# gRPC-Web サンプル

## はじめに

gRPC-Web を、クライアントサイドは TypeScript、サーバーサイドは Go で実装したサンプルアプリケーションです。

サンプルの内容は、画面から gRPC-Web 経由でサーバ処理を呼び出し、処理結果を画面に表示するシンプルなものです。

## 前提条件

- 本サンプルアプリは MacOS（Catalina）で動作確認しています。

- 端末に以下がインストール済みであることを前提としています。

  - node
  - protobuf
  - protoc-gen-grpc-web
  - protoc-gen-go
  - go

  ※MacOS で brew が導入済みであれば、`brew install xx`でいずれもインストールできます。

  なお、動作確認したバージョンは以下のとおりです。

  ```shell
  $ node --version
  v12.4.0
  $ protoc --version
  libprotoc 3.12.4
  $ go version
  go version go1.14.7 darwin/amd64
  ```

## 利用方法

### 事前準備

```shell
[grpc-web-sample]$ npm run setup
```

### ビルド実行

```shell
[grpc-web-sample]$ npm run build
```

### サーバ起動

```shell
[grpc-web-sample]$ npm run serve
```

※サーバを停止する場合は、「Ctrl+C」で強制停止してください。

### 画面起動

```shell
[grpc-web-sample]$ npm run open
```

※ブラウザで「http://localhost:8080/static/index.html」を開くだけなので、ブラウザでこのURLを開いても OK です。
