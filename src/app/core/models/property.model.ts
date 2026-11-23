export enum EPropertyCategory {
  Hotel = 'Hotel',
  Pension = 'Pension',
  Apartment = 'Apartment',
  Guesthouse = 'Guesthouse',
}

export interface RoomPrices {
  Standard: number;
  Superior: number;
  Family: number;
}

export interface PropertyListItem {
  id: string;
  imageUrl: string;
  name: string;
  location: string;
  category: EPropertyCategory;
}

export interface PropertyDetail extends PropertyListItem {
  description: string;
  address: string;
  roomPrices: RoomPrices;
}

export interface PropertyPayload {
  name: string;
  location: string;
  address: string;
  category: EPropertyCategory;
  description: string;
  imageUrl: string;
  roomPrices: RoomPrices;
}