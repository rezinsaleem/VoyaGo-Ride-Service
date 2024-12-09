// src/repositories/rideRepo.ts

import { PublishRideInterface } from "../utilities/interface";
import rideModel from "../entities/ride";

export default class RideRepository {

  async findRideByDate(date: string) {
    try {
      return await rideModel.find({
        rideDate: { $gte: date }, 
        status: "available" 
      }).lean();
    } catch (error) {
      console.error("Error finding active ride:", error);
      throw new Error("Error finding active ride");
    }
  }

  async findActiveRide(riderId: string, rideDate: string) {
    try {
      return await rideModel.find({
        riderId,
        rideDate,
        status: "available" 
      });
    } catch (error) {
      console.error("Error finding active ride:", error);
      throw new Error("Error finding active ride");
    }
  }

  // Method to save a new ride
  async saveRide(rideData: PublishRideInterface) {
    try {
      const newRide = new rideModel(rideData);
      await newRide.save();
      return { message: "RideCreated", rideId: newRide._id };
    } catch (error) {
      console.error("Error saving ride:", error);
      return { message: "ErrorSavingRide", error };
    }
  }

  // Method to find a ride by its ID
  async findRideById(rideId: any) {
    try {
      return await rideModel.findById(rideId);
    } catch (error) {
      console.error("Error finding ride by ID:", error);
      throw new Error("Error finding ride by ID");
    }
  }

  findById = async (id: string) => {
    try {
      const ride = await rideModel.findById(id)
      return ride;
    } catch (error) {
      console.error('Error finding ride: ', (error as Error).message);
      throw new Error('Ride search failed');
    }
  };


  findByIdAndUpdateRide = async (
    id: string,
    passengerImage: string,
    passengerName: string,
    passengerPhone: number,
    passengerId: string
  ) => {
    try {
      // Check seat availability
      const ride = await rideModel.findById(id);
      if (!ride) {
        throw new Error('Ride not found');
      }
  
      if (ride.numSeats <= 0) {
        console.log('seat is fullll');
        return 'failed';
      }
  
      // Prepare the passenger object
      const newPassenger = {
        id: passengerId,
        name: passengerName,
        phoneNumber: passengerPhone,
        image: passengerImage,
      };
  
      // Perform the update
      const updatedRide = await rideModel.findByIdAndUpdate(
        id,
        {
          $push: { passengers: newPassenger }, 
          $inc: { numSeats: -1 },             
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedRide) {
        throw new Error('Failed to update the ride');
      }
  
      return 'success';
    } catch (error) {
      console.error('Error Adding Passenger: ', (error as Error).message);
      throw new Error((error as Error).message || 'Booking failed');
    }
  };
  

  // Add other methods as needed (e.g., updateRide, deleteRide, etc.)
}
