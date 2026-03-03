type Role = 'user' | 'admin' | 'therapist';

export const db: any = {
  users: [
    { id: '1', name: 'Admin', surname: 'User', idNumber: '0000000000', email: 'admin@example.com', password: 'adminpassword', role: 'admin' as Role },
    { id: '2', name: 'Therapist One', surname: 'Smith', idNumber: '1111111111', email: 'therapist@example.com', password: 'therapistpass', role: 'therapist' as Role },
  ],
  services: [
    // Example service format:
    // { id: 's1', title: 'Therapy Session', duration: 60, therapistId: '2' }
  ],
  bookings: [
    // { id: 'b1', serviceId: 's1', userId: '3', therapistId: '2', time: '2026-03-02T10:00:00.000Z', status: 'pending' }
  ],
};

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}
