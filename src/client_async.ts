import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from '../out/greetings'
import { HelloReply } from '../out/HelloReply'

const host = '0.0.0.0:9090'
const packageDefinition = protoLoader.loadSync('./src/proto/greetings.proto')
const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)

const client = new proto.GreetingsService(host, grpc.credentials.createInsecure())

client.waitForReady(deadline, (error?: Error) => {
  if (error) console.log(`Client connect error: ${error.message}`)
})

export async function doUnaryCallAsync(): Promise<HelloReply['message']> {
  return new Promise((resolve, reject) => {
    client.SayHello(
      {
        name: 'Petro',
      },
      (error?: grpc.ServiceError, serverMessage?: HelloReply) => {
        if (error) {
          reject(error)
        } else if (serverMessage) {
          resolve(serverMessage.message)
        }
      }
    )
  })
}
