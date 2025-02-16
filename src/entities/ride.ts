import mongoose, { Schema, Document } from 'mongoose';

// Define the Passenger interface
interface Passenger {
  id: string;
  name: string;
  phoneNumber: number;
  image: string;
}

// Define the Ride interface
interface RideInterface extends Document {
  start_lat: number;
  start_lng: number;
  start_address: string;
  end_lat: number;
  end_lng: number;
  end_address: string;
  routeName: string;
  distance: string;
  duration: string;
  numSeats: number;
  rideDate: string;
  rideTime: string;
  pricePerSeat: number;
  car: string;
  additionalInfo?: string;
  status: string;
  riderId: string;
  passengers: Passenger[];  // Define passengers as an array of Passenger objects
}

// Define the Ride schema
const RideSchema: Schema = new Schema(
  {
    start_lat: {
      type: Number,
      required: true,
    },
    start_lng: {
      type: Number,
      required: true,
    },
    start_address: {
      type: String,
      required: true,
    },
    end_lat: {
      type: Number,
      required: true,
    },
    end_lng: {
      type: Number,
      required: true,
    },
    end_address: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    numSeats: {
      type: Number,
      required: true,
    },
    rideDate: {
      type: Date,
      required: true,
    },
    rideTime: {
      type: String,
      required: true,
    },
    pricePerSeat: {
      type: Number,
      required: true,
    },
    car: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
    status: {
      type: String,
      default: 'Available',
    },
    riderId: {
      type: String,
      required: true,
    },
    passengers: {
      type: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        phoneNumber: { type: Number, required: true },
        image : {type: String, required: true},
      }],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Ride model
const rideModel = mongoose.model<RideInterface>('Rides', RideSchema);

export default rideModel;
