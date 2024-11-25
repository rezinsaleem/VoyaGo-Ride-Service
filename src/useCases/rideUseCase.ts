
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
      // Find existing rides for the same date
      const existingRides = await rideRepository.findActiveRide(riderId, rideDate);
      if (existingRides.length > 0) {
        // Parse proposed start time
        const proposedStartTime = new Date(rideDate);
        const [proposedHours, proposedMinutes, proposedPeriod] = rideTime.split(/[: ]/);
        proposedStartTime.setHours(
          parseInt(proposedHours) + (proposedPeriod === "PM" && parseInt(proposedHours) !== 12 ? 12 : 0),
          parseInt(proposedMinutes)
        );
  
        for (const ride of existingRides) {
          const { rideTime: existingRideTime, duration: existingDuration, rideDate: existingRideDate } = ride;
  
          const existingRideStartTime = new Date(existingRideDate);
          const [startHours, startMinutes, startPeriod] = existingRideTime.split(/[: ]/);
          existingRideStartTime.setHours(
            parseInt(startHours) + (startPeriod === "PM" && parseInt(startHours) !== 12 ? 12 : 0),
            parseInt(startMinutes)
          );
  
          const durationParts = existingDuration.split(" ");
          const durationInMinutes =
            parseInt(durationParts[0]) * 60 + (durationParts[2] ? parseInt(durationParts[2]) : 0);
          const existingRideEndTime = new Date(existingRideStartTime);
          existingRideEndTime.setMinutes(existingRideEndTime.getMinutes() + durationInMinutes);
  
          const nextRideAllowedTime = new Date(existingRideEndTime);
          nextRideAllowedTime.setHours(nextRideAllowedTime.getHours() + 2);
  
          if (proposedStartTime < nextRideAllowedTime) {
            return {
              message: `Ride Already Exists, Select the start time which doesn't matters the other ride!`
            };
          }
        }
      }
  
      // Prepare new ride data for saving
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
        riderId,
        passengers: []
      };
  
      // Save the ride
      const response = await rideRepository.saveRide(newRideData);
  
      if (response.message === 'RideCreated') {
        return { message: 'Success', rideId: response.rideId };
      } else {
        console.error("Error creating ride:", response);
        return { message: 'RideNotCreated' };
      }
    } catch (error) {
      console.error("Error in publishRide:", error);
      return { message: (error as Error).message };
    }
  };
  
  getRide = async (id: string) => {
    try {
      const ride = await rideRepository.findById(id);
      if (ride) {
        const response = {
           start_address : ride.start_address,
           end_address : ride.end_address,
           routeName : ride.routeName,
           distance : ride.distance,
           duration :  ride.duration,
           numSeats : ride.numSeats,
           rideDate : ride.rideDate,
           rideTime : ride.rideTime,
           pricePerSeat : ride.pricePerSeat,
           car : ride.car,
           additionalInfo : ride.additionalInfo,
           status : ride.status,
           passengers: ride.passengers,
        };
        return { ...response };
      } else {
        return { message: 'No Ride Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

}
