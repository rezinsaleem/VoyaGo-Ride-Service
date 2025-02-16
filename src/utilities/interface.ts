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


export interface RideRequest {
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

export interface RideSearchRequest {
  start_lat: number;
  start_lng: number;
  start_address: string;
  end_lat: number;
  end_lng: number;
  end_address: string;
  date: string;
}

export interface UpdateRideRequest {
  start_lat?: number;
  start_lng?: number;
  start_address?: string;
  end_lat?: number;
  end_lng?: number;
  end_address?: string;
  routeName?: string;
  distance?: string;
  duration?: string;
  numSeats?: number;
  rideDate?: string; // ISO Date string
  rideTime?: string; // ISO Time string or HH:MM format
  pricePerSeat?: number;
  car?: string;
  additionalInfo?: string;
  status?: 'available' | 'booked' | 'cancelled'; // Define possible status values
  passengers?: {
    id: string;
    name: string;
    phoneNumber: number;
    image?: string;
  }[]; // Array of passenger objects
}
