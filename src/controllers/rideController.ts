import RideUseCase from "../useCases/rideUseCase";
import { RideRequest, RideSearchRequest } from "../utilities/interface";

const rideUseCase = new RideUseCase();

export default class RideController {
  publishRide = async (
    call: { request: RideRequest },
    callback: (error: any, response: any) => void
  ) => {
    const {
      start_lat,
      start_lng,
      start_address,
      end_lat,
      end_lng,
      end_address,
      routeName,
      distance,
      duration,
      numSeats,
      rideDate,
      rideTime,
      pricePerSeat,
      car,
      additionalInfo,
      status,
      riderId,
    } = call.request;

    try {
      console.log(call.request);
      const response = await rideUseCase.publishRide(
        start_lat,
        start_lng,
        start_address,
        end_lat,
        end_lng,
        end_address,
        routeName,
        distance,
        duration,
        numSeats,
        rideDate,
        rideTime,
        pricePerSeat,
        car,
        additionalInfo,
        status,
        riderId
      );

      callback(null, response);
    } catch (error) {
      console.error("Error while publishing ride:", error);

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
      console.error("Error fetching Ride:", error);
      callback(null, { error: (error as Error).message });
    }
  };

  searchRides = async (
    call: { request: RideSearchRequest },
    callback: (error: any, response: any) => void
  ) => {
    const {
      start_lat,
      start_lng,
      start_address,
      end_lat,
      end_lng,
      end_address,
      date,
    } = call.request;

    try {
      console.log(call.request);
      const response = await rideUseCase.searchRides(
        start_lat,
        start_lng,
        start_address,
        end_lat,
        end_lng,
        end_address,
        date,
      );
     console.log(response,'laaaaaaaaaaaaaaaaaaaaa');
      callback(null, response);
    } catch (error) {
      console.error("Error while Searching ride:", error);

      callback(null, { error: (error as Error).message });
    }
  };

  paymentSuccess = async (
    call: {
      request: {
        id: string;
        amount: number;
        paymentType: string;
        paymentId : string;
        passengerName : string;
        passengerId : string;
        passengerPhone : number;
        passengerImage : string;
        passengerEmail : string;
        riderId : string;
        riderName : string;
        riderEmail : string;
        riderPhone : number;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id, amount, paymentType ,paymentId, passengerName, passengerId ,passengerImage ,passengerPhone, passengerEmail,riderId,riderName,riderEmail, riderPhone} = call.request
      const response = await rideUseCase.paymentSuccess(id,amount,paymentType,paymentId, passengerName, passengerId ,passengerPhone,passengerImage , passengerEmail, riderId, riderName, riderEmail, riderPhone);
      callback(null, response);
    } catch (error) {
      console.error('Error while Booking:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getRides = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const rides = await rideUseCase.getRides();
      console.log(rides,'laaaaaaaa');
      callback(null, rides);
    } catch (error) {
      console.error('Error fetching Rides:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  cancelRide  = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id } = call.request;
      console.log( id ,'vannn')
      const response = await rideUseCase.cancelRide(id);
      console.log(response,'poyii');
      callback(null, response);
    } catch (error) {
      console.error('Error fetching Rides:', error);
      callback(null, { error: (error as Error).message });
    }
  };

}
