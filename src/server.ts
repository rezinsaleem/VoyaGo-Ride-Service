import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';
import connectDB from './Config/mongo';
import RideController from './controllers/rideController';

const rideController = new RideController()


connectDB()

const PROTO_PATH = path.resolve(__dirname, './proto/ride.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
if (
  !grpcObject.ride ||
  !grpcObject.ride.Ride ||
  !grpcObject.ride.Ride.service
) {
  console.error('Failed to load the Ride service from the proto file.');
  process.exit(1);
}

const server = new grpc.Server();

server.addService(grpcObject.ride.Ride.service, {
  PublishRide: rideController.publishRide,
  GetRide: rideController.getRide,
  SearchRides : rideController.searchRides,
  PaymentSuccess: rideController.paymentSuccess,
});

const SERVER_ADDRESS = process.env.GRPC_SERVER_PORT || '50003';
const Domain =
  process.env.NODE_ENV === 'dev'
    ? process.env.DEV_DOMAIN
    : process.env.PRO_DOMAIN_USER;

server.bindAsync(
  `${Domain}:${SERVER_ADDRESS}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Failed to bind server: ${err}`);
      return;
    }
    console.log(`gRPC server running at ${port}`);
  }
);