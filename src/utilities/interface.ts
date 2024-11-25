export interface PublishRideInterface {
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
  passengers: Passenger[];
}

interface Passenger {
  id: number;
  name: string;
  phoneNumber: number,
}