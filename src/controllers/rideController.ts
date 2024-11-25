import RideUseCase from "../useCases/rideUseCase";

const rideUseCase = new RideUseCase();

interface RideRequest {
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
  additionalInfo: string;
  status: string;
  riderId: string;
}

export default class RideController {

  publishRide = async (
    call: { request: RideRequest },
    callback: (error: any, response: any) => void
  ) => {
    const { 
      start_lat, start_lng, start_address, end_lat, end_lng, end_address, 
      routeName, distance, duration, numSeats, rideDate, rideTime, 
      pricePerSeat, car, additionalInfo, status, riderId 
    } = call.request;

    try {
      console.log(call.request);
      const response = await rideUseCase.publishRide(
        start_lat, start_lng, start_address, end_lat, end_lng, end_address, 
        routeName, distance, duration, numSeats, rideDate, rideTime, 
        pricePerSeat, car, additionalInfo, status, riderId
      );

      callback(null, response);
    } catch (error) {
      console.error('Error while publishing ride:', error);

      callback(null, { error: (error as Error).message });
    }
  };

  getRide = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id } = call.request;
      const user = await rideUseCase.getRide(id);
      callback(null, user);
    } catch (error) {
      console.error('Error fetching Ride:', error);
      callback(null, { error: (error as Error).message });
    }
  };
}
