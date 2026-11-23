import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingListItem, EBookingStatus } from '../models/booking.model';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);

  getBookings(status?: EBookingStatus | 'ALL'): Observable<BookingListItem[]> {
    let params = new HttpParams();

    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<BookingListItem[]>(`${API_URL}/bookings`, { params });
  }

  confirmBooking(id: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/bookings/${id}/confirm`, {});
  }

  cancelBooking(id: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/bookings/${id}/cancel`, {});
  }
}