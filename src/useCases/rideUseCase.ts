
import RideRepository from "../repositories/rideRepo";
import { PublishRideInterface } from "../utilities/interface"; 
import getDistance from "../services/getDistance";

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
      const date = rideDate.split("T")[0];
const dateToCheck = `${date}T00:00:00.000+00:00`;
      // Find existing rides for the same date
      const existingRides = await rideRepository.findActiveRide(riderId, dateToCheck);
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
  
      const datePart = rideDate.split("T")[0];
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
        rideDate :datePart,
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

  searchRides = async (
    start_lat: number,
    start_lng: number,
    start_address: string,
    end_lat: number,
    end_lng: number,
    end_address: string,
    date: string
  ) => {
    try {
      const rideDate = date.split("T")[0];
      const dateToCheck = `${rideDate}T00:00:00.000+00:00`;
      console.log(dateToCheck,'qweerr');
      const existingRides = await rideRepository.findRideByDate(dateToCheck);
    
      console.log(existingRides,'ithhh');

      const filteredRides = [];

  for (const ride of existingRides) {
    const rideStart = { lat: ride.start_lat, lng: ride.start_lng };
    const rideEnd = { lat: ride.end_lat, lng: ride.end_lng };
    const userStart = { lat: start_lat, lng: start_lng };
    const userEnd = { lat: end_lat, lng: end_lng };

    try {
      const startDistance = await getDistance(userStart, rideStart);
      const endDistance = await getDistance(userEnd, rideEnd);

      if (startDistance <= 30 && endDistance <= 30) {
        filteredRides.push({
          ...ride,
          startDistance,
          endDistance
        });
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  }
console.log('filteredd..rides..',filteredRides);
return { rides: filteredRides };
     
    } catch (error) {
      console.error("Error in Searching Ride:", error);
      return { message: (error as Error).message };
    }
  };

}
