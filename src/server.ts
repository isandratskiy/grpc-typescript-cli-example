import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { sendUnaryData, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js'
import { GreetingsServiceHandlers } from '../out/GreetingsService'
import { HelloRequest__Output } from '../out/HelloRequest'
import { HelloReply } from '../out/HelloReply'
import { ProtoGrpcType } from '../out/greetings'

const host = '0.0.0.0:9090'

const exampleServer: GreetingsServiceHandlers = {
  ItKeepsReplying(call: ServerWritableStream<HelloRequest__Output, HelloReply>): void {
    call.write({
      message: '[server] Сontinues to messaging',
    })
  },
  SayHello(
    call: ServerUnaryCall<HelloRequest__Output, HelloReply>,
    callback: sendUnaryData<HelloReply>
  ): void {
    if (call.request) {
      console.log(`[server] Hello message from ${call.request.name}`)
    }
    callback(null, {
      message: 'Master',
    })
  },
}

function getServer(): grpc.Server {
  const packageDefinition = protoLoader.loadSync('./src/proto/greetings.proto')
  const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
  const server = new grpc.Server()
  server.addService(proto.GreetingsService.service, exampleServer)
  return server
}

if (require.main === module) {
  const server = getServer()
  server.bindAsync(
    host,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, port: number) => {
      if (err) {
        console.error(`Server error: ${err.message}`)
      } else {
        console.log(`Server bound on port: ${port}`)
        server.start()
      }
    }
  )
}
