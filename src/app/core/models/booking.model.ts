export enum EBookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
}

export interface BookingListItem {
  id: string;
  guestName: string;
  propertyName: string;
  start: string;
  end: string;
  status: EBookingStatus;
}

export interface OverviewRecentBooking {
  id: string;
  guestName: string;
  propertyName: string;
  start: string;
  end: string;
}

export interface OverviewUpcomingCheckIn {
  imageUrl: string;
  guestName: string;
  propertyName: string;
  date: string;
}

export interface PropertyOverview {
  today: {
    booked: number;
    checkIns: number;
    checkOuts: number;
  };
  recentBookings: OverviewRecentBooking[];
  upcomingCheckIns: OverviewUpcomingCheckIn[];
}