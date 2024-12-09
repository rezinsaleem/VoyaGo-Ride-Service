import RideRepository from "../repositories/rideRepo";
import { PublishRideInterface } from "../utilities/interface";
import getDistance from "../services/getDistance";
import { sendMail } from "../services/sendMail";
import WalletRepository from "../repositories/walletRepo";
import Razorpay from "razorpay";

const rideRepository = new RideRepository();
const walletRepository = new WalletRepository();

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
      const existingRides = await rideRepository.findActiveRide(
        riderId,
        dateToCheck
      );
      if (existingRides.length > 0) {
        // Parse proposed start time
        const proposedStartTime = new Date(rideDate);
        const [proposedHours, proposedMinutes, proposedPeriod] =
          rideTime.split(/[: ]/);
        proposedStartTime.setHours(
          parseInt(proposedHours) +
            (proposedPeriod === "PM" && parseInt(proposedHours) !== 12
              ? 12
              : 0),
          parseInt(proposedMinutes)
        );

        for (const ride of existingRides) {
          const {
            rideTime: existingRideTime,
            duration: existingDuration,
            rideDate: existingRideDate,
          } = ride;

          const existingRideStartTime = new Date(existingRideDate);
          const [startHours, startMinutes, startPeriod] =
            existingRideTime.split(/[: ]/);
          existingRideStartTime.setHours(
            parseInt(startHours) +
              (startPeriod === "PM" && parseInt(startHours) !== 12 ? 12 : 0),
            parseInt(startMinutes)
          );

          const durationParts = existingDuration.split(" ");
          const durationInMinutes =
            parseInt(durationParts[0]) * 60 +
            (durationParts[2] ? parseInt(durationParts[2]) : 0);
          const existingRideEndTime = new Date(existingRideStartTime);
          existingRideEndTime.setMinutes(
            existingRideEndTime.getMinutes() + durationInMinutes
          );

          const nextRideAllowedTime = new Date(existingRideEndTime);
          nextRideAllowedTime.setHours(nextRideAllowedTime.getHours() + 2);

          if (proposedStartTime < nextRideAllowedTime) {
            return {
              message: `Ride Already Exists, Select the start time which doesn't matters the other ride!`,
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
        rideDate: datePart,
        rideTime,
        pricePerSeat,
        car,
        additionalInfo,
        status,
        riderId,
        passengers: [],
      };

      // Save the ride
      const response = await rideRepository.saveRide(newRideData);

      if (response.message === "RideCreated") {
        return { message: "Success", rideId: response.rideId };
      } else {
        console.error("Error creating ride:", response);
        return { message: "RideNotCreated" };
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
          start_address: ride.start_address,
          end_address: ride.end_address,
          routeName: ride.routeName,
          distance: ride.distance,
          duration: ride.duration,
          numSeats: ride.numSeats,
          rideDate: ride.rideDate,
          rideTime: ride.rideTime,
          pricePerSeat: ride.pricePerSeat,
          car: ride.car,
          additionalInfo: ride.additionalInfo,
          status: ride.status,
          passengers: ride.passengers,
        };
        return { ...response };
      } else {
        return { message: "No Ride Found" };
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
      const existingRides = await rideRepository.findRideByDate(dateToCheck);

      console.log(existingRides, "ithhh");

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
              endDistance,
            });
          }
        } catch (error) {
          console.error("Error calculating distance:", error);
        }
      }
      console.log("filteredd..rides..", filteredRides);
      return { rides: filteredRides };
    } catch (error) {
      console.error("Error in Searching Ride:", error);
      return { message: (error as Error).message };
    }
  };

  paymentSuccess = async (
    id: string,
    amount: number,
    paymentType: string,
    paymentId : string,
    passengerName : string,
    passengerId : string,
    passengerPhone : number,
    passengerImage : string,
    passengerEmail : string,
    riderId : string,
    riderName : string,
    riderEmail : string,
    riderPhone : number,
  ) => {
    try {
      const amountInRupees = amount / 100;
  
      // Calculate amounts
      const amountVoyaGo = Math.round(amountInRupees * 0.07); // 7% of the amount
      const amountRider = Math.round(amountInRupees - amountVoyaGo);
  
      // Update ride and check booking status
      const booking = await rideRepository.findByIdAndUpdateRide(
        id,
        passengerImage,
        passengerName,
        passengerPhone,
        passengerId,
      );
  
      if (booking === "success") {
        console.log("Booked Successfully");
  
        // Email to the passenger
        const passengerSubject = "Ride Booking Confirmation";
        const passengerText =
          `Hello ${passengerName},\n\n` +
          `Your ride booking has been successfully confirmed!\n\n` +
          `Ride Details:\n` +
          `- Rider Name: ${riderName}\n` +
          `- Rider Phone: ${riderPhone}\n` +
          `- Amount Paid: ₹${amountInRupees} (via ${paymentType})\n\n` +
          `If you have any questions or need assistance, feel free to contact the rider directly or reach out to our support team.\n\n` +
          `Thank you for choosing VoyaGo. Have a safe journey!\n\n` +
          `Best regards,\nVoyaGo Team`;
  
        sendMail(passengerEmail, passengerSubject, passengerText);
  
        // Email to the rider
        const riderSubject = "New Ride Booking";
        const riderText =
          `Hello ${riderName},\n\n` +
          `A new booking has been made for your ride!\n\n` +
          `Passenger Details:\n` +
          `- Name: ${passengerName}\n` +
          `- Phone: ${passengerPhone}\n` +
          `- Email: ${passengerEmail}\n` +
          `- Final Amount Paid: ₹${amountRider} after deducting the platform charge ₹${amountVoyaGo} (wallet)\n\n` +
          `Please feel free to contact the passenger if needed.\n\n` +
          `Thank you for being a part of the VoyaGo community. We wish you a great journey!\n\n` +
          `Best regards,\nVoyaGo Team`;
  
        sendMail(riderEmail, riderSubject, riderText);
  
        // Push transactions to wallets
        await walletRepository.addTransaction(
          passengerId,
          passengerName,
          "debit",
          amountInRupees,
          `Payment for ride with Rider ${riderName}`,
          id
        );
        await walletRepository.addTransaction(
          riderId,
          riderName,
          "credit",
          amountRider,
          `Earnings from ride booking by Passenger ${passengerName}`,
          id
        );
        await walletRepository.addTransaction(
          "admin",
          "VoyaGo Admin",
          "credit",
          amountVoyaGo,
          `Platform fee from ride booking by Passenger ${passengerName}`,
          id
        );
  
        return { message: "success" };
      } else if (booking === "failed") {
        // Handle refund for failed booking
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_3TxK9TdVgtd1BD",
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
  
        try {
          const params = {
            amount, // Full amount for refund
          };
          const refund = await razorpay.payments.refund(paymentId, params);
          console.log("Refund successful:", refund);
          return { message: "Seats full, amount refunded successfully!" }; // Early return
      } catch (refundError) {
        return { message: "Refund failed. Please contact support." }; // Early return
      }
    }

    return { message: "Error Booking Ride" }; 
    } catch (error) {
      console.error("Error in paymentSuccess:", error);
      return { message: (error as Error).message };
    }
  };
}  