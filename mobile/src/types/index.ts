// types/index.ts
export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: 'CLIENT' | 'THERAPIST' | 'ADMIN' | 'SUPERUSER';
  phone?: string;
  idNumber?: string;
  cardHolderName?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardExpiryMonth?: string;
  cardExpiryYear?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Therapist {
  id: number;
  user: User;
  specialization: string;
  typeOfPractice: string;
  yearsOfExperience: number;
  licenseNumber: string;
  bio: string;
  image: string;
  workingDays?: string;
  workDayStart?: string;
  workDayEnd?: string;
}

export interface Booking {
  id: number;
  userId: number;
  therapistId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  description: string;
  price: number;
  status: 'pending_payment' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  client?: User;
  therapist?: Therapist;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ApiError {
  message: string;
  status?: number;
}
