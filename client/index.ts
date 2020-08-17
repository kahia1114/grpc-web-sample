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
