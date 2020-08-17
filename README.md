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

※「client/index.html」を開くだけなので、直接ブラウザで開いても OK です。

## サンプル説明

### gRPC インタフェース定義（proto/hello.proto）

クライアント／サーバ間でやり取りする gRPC のインタフェース定義（Protocol Bufferes）です。

クライアントからサーバ処理を呼び出す API を定義しています。

引数に`HelloRequest`を取り、戻り値で`HelloReply`を返す、`SayHello`という API を定義しています。

```protobuf
syntax = "proto3";

option go_package = ".;grpcpb";

service HelloService {
  rpc SayHello(HelloRequest) returns (HelloReply) {}
}

message HelloRequest { string name = 1; }

message HelloReply { string message = 1; }
```

### クライアント画面（client/index.html）

クライアント画面用の HTML です。

画面には、gRPC 呼び出し用の送信ボタン、gRPC 引数用の入力欄（名前）、gRPC 戻り値を表示するための結果欄を配置しています。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>gRPC-Web sample</title>
    <script src="build/index.js" defer></script>
  </head>
  <body>
    <h1>gRPC-Web sample</h1>
    <hr />
    <div>
      名前：<input type="text" id="name" value="Test" />
      <input type="button" id="sendBtn" value="送信" />
    </div>
    <div>結果：<input type="text" id="result" readonly /></div>
  </body>
</html>
```

### クライアント処理（client/index.ts）

画面で送信ボタンをクリックした時の gRPC 呼び出し処理です。

送信ボタンをクリックすると、名前欄に入力された値を元に、サーバ処理（SayHello）を呼び出し、戻り値を結果欄に表示します。

```typescript
import { HelloServiceClient } from "./grpcpb/HelloServiceClientPb";
import { HelloRequest } from "./grpcpb/hello_pb";

const htmlInputElement = (id: string) => {
  return <HTMLInputElement>document.getElementById(id);
};

const requestHello = async () => {
  const request = new HelloRequest();
  request.setName(htmlInputElement("name").value);

  const client = new HelloServiceClient("http://localhost:8080");

  const reply = await client.sayHello(request, {});

  htmlInputElement("result").value = reply.getMessage();
};

htmlInputElement("sendBtn").addEventListener("click", requestHello);
```

### サーバ処理（server/main.go）

gRPC 呼び出しを受け付けるサーバ処理（SayHello）の実装です。

現状の gRPC-Web は、HTTP/2 変換用のプロキシが必要なため、[grpcweb](https://github.com/improbable-eng/grpc-web/tree/master/go/grpcweb) で grpcServer をラップしています。

```go
package main

import (
  "context"
  "log"
  "net/http"

  "github.com/improbable-eng/grpc-web/go/grpcweb"
  "google.golang.org/grpc"

  "grpc-web-sample/grpcpb"
)

type helloService struct{}

func (s *helloService) SayHello(ctx context.Context, req *grpcpb.HelloRequest) (*grpcpb.HelloReply, error) {
  log.Printf("Recieved name: %s", req.GetName())
  return &grpcpb.HelloReply{Message: "Hello, " + req.GetName() + "!!"}, nil
}

func main() {
  grpcServer := grpc.NewServer()

  grpcpb.RegisterHelloServiceServer(grpcServer, &helloService{})

  wrapServer := grpcweb.WrapServer(grpcServer, grpcweb.WithOriginFunc(func(s string) bool { return true }))

  http.Handle("/", wrapServer)

  err := http.ListenAndServe(":8080", nil)
  if err != nil {
    log.Fatalf("Failed to serve: %v", err)
  }
}
```
