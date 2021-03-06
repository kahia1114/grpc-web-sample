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
	http.Handle("/static/", http.FileServer(http.Dir("../")))

	grpcServer := grpc.NewServer()
	grpcpb.RegisterHelloServiceServer(grpcServer, &helloService{})

	wrapServer := grpcweb.WrapServer(grpcServer)
	http.Handle("/", wrapServer)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
