import { Component, OnInit, inject, signal } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { BookingListItem, EBookingStatus } from '../../core/models/booking.model';

export interface BookingSummary {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css',
})
export class BookingListComponent implements OnInit {
  private readonly bookingService = inject(BookingService);

  readonly EBookingStatus = EBookingStatus;
  readonly selectedStatus = signal<EBookingStatus | 'ALL'>('ALL');
  readonly bookings = signal<BookingListItem[]>([]);
  readonly summary = signal<BookingSummary>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadSummary();
    this.loadBookings();
  }

  private loadSummary(): void {
    this.bookingService.getBookings('ALL').subscribe({
      next: (all) => {
        this.summary.set({
          total: all.length,
          pending: all.filter((b) => b.status === EBookingStatus.Pending).length,
          confirmed: all.filter((b) => b.status === EBookingStatus.Confirmed).length,
          cancelled: all.filter((b) => b.status === EBookingStatus.Cancelled).length,
        });
      },
      error: () => {
        // A lista lekérése külön kezeli a hibát
      },
    });
  }

  loadBookings(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.bookingService.getBookings(this.selectedStatus()).subscribe({
      next: (items) => {
        this.bookings.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Nem sikerült betölteni a foglalásokat.'
        );
      },
    });
  }

  onStatusFilterChange(status: EBookingStatus | 'ALL'): void {
    this.selectedStatus.set(status);
    this.loadBookings();
  }

  onConfirm(booking: BookingListItem): void {
    const confirmed = window.confirm(
      `Biztosan visszaigazolod ${booking.guestName} foglalását (${booking.propertyName})?`
    );
    if (!confirmed) {
      return;
    }

    this.bookingService.confirmBooking(booking.id).subscribe({
      next: () => {
        this.refreshAll();
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Hiba történt a foglalás visszaigazolása során.'
        );
      },
    });
  }

  onCancel(booking: BookingListItem): void {
    const confirmed = window.confirm(
      `Biztosan lemondod ${booking.guestName} foglalását (${booking.propertyName})?`
    );
    if (!confirmed) {
      return;
    }

    this.bookingService.cancelBooking(booking.id).subscribe({
      next: () => {
        this.refreshAll();
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Hiba történt a foglalás lemondása során.'
        );
      },
    });
  }

  getStatusLabel(status: EBookingStatus): string {
    switch (status) {
      case EBookingStatus.Pending:
        return 'Függőben';
      case EBookingStatus.Confirmed:
        return 'Visszaigazolt';
      case EBookingStatus.Cancelled:
        return 'Lemondva';
    }
  }
}