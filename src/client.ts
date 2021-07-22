import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from '../out/greetings'
import { HelloReply } from '../out/HelloReply'

const host = '0.0.0.0:9090'
const packageDefinition = protoLoader.loadSync('./src/proto/greetings.proto')
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType

const client = new proto.GreetingsService(
  host,
  grpc.credentials.createInsecure()
)

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)
client.waitForReady(deadline, (error?: Error) => {
  if (error) {
    console.log(`Client connect error: ${error.message}`)
  } else {
    onClientReady()
  }
})

function onClientReady() {
  switch (process.argv[process.argv.length - 1]) {
    case '--unary':
      doUnaryCall()
      break
    case '--server-streaming':
      doServerStreamingCall()
      break
    default:
      throw new Error('Example not specified')
  }
}

function doUnaryCall() {
  client.SayHello(
    {
      name: 'Petro',
    },
    (error?: grpc.ServiceError, serverMessage?: HelloReply) => {
      if (error) {
        console.error(error.message)
      } else if (serverMessage) {
        console.log(`(client) Got server message: ${serverMessage.message}`)
      }
    }
  )
}

function doServerStreamingCall() {
  const stream = client.ItKeepsReplying({
    name: 'Yo Garry',
  })
  stream.on('data', (serverMessage: HelloReply) => {
    console.log(`(client) Got server message: ${serverMessage.message}`)
  })
}
