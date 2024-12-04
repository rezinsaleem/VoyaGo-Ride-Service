// src/repositories/rideRepo.ts

import { PublishRideInterface } from "../utilities/interface";
import RideModel from "../entities/ride"; // Assuming RideModel is a Mongoose model representing rides

export default class RideRepository {

  async findRideByDate(date: string) {
    try {
      return await RideModel.find({
        rideDate: date, 
        status: "available" 
      }).lean();
    } catch (error) {
      console.error("Error finding active ride:", error);
      throw new Error("Error finding active ride");
    }
  }

  async findActiveRide(riderId: string, rideDate: string) {
    try {
      return await RideModel.find({
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
      const newRide = new RideModel(rideData);
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
      return await RideModel.findById(rideId);
    } catch (error) {
      console.error("Error finding ride by ID:", error);
      throw new Error("Error finding ride by ID");
    }
  }

  findById = async (id: string) => {
    try {
      const ride = await RideModel.findById(id)
      return ride;
    } catch (error) {
      console.error('Error finding ride: ', (error as Error).message);
      throw new Error('Ride search failed');
    }
  };

  // Add other methods as needed (e.g., updateRide, deleteRide, etc.)
}
