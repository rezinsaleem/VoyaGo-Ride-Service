
import RideRepository from "../repositories/rideRepo";
import { PublishRideInterface } from "../utilities/interface"; // Assuming this interface defines the structure / Assuming this is a utility to validate ride data

const rideRepository = new RideRepository();

export default class PublishRideUseCase {
  publishRide = async (
    start_lat: number,
    start_lng: number,
    start_address: string,
    end_lat: number,
    end_lng: number,
    end_address: string,
    routeName: string,
    distance: string,
    duration: string,
    numSeats: number,
    rideDate: string,
    rideTime: string,
    pricePerSeat: number,
    car: string,
    additionalInfo: string,
    status: string,
    riderId: string
  ) => {
    try {
      
      const existingRide = await rideRepository.findActiveRide(riderId, rideDate, rideTime);
      if (existingRide) {
        return { message: 'RideAlreadyExists' };
      }

      // Prepare ride data for saving
      const newRideData: PublishRideInterface = {
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
      };
      
      const response = await rideRepository.saveRide(newRideData);

      if (response.message === 'RideCreated') {
        return {
          message: 'Success',
        };
      } else {
        console.error("Error creating ride:", response);
        return { message: 'RideNotCreated' };
      }
    } catch (error) {
      console.error("Error in publishRide:", error);
      return { message: (error as Error).message };
    }
  };
}
