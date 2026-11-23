import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PropertyDetail,
  PropertyListItem,
  PropertyPayload,
} from '../models/property.model';
import { PropertyOverview } from '../models/booking.model';

const API_URL = 'http://localhost:3000';

export interface PropertyFilter {
  name?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly http = inject(HttpClient);

  getProperties(filter?: PropertyFilter): Observable<PropertyListItem[]> {
    let params = new HttpParams();

    if (filter?.name && filter.name.trim() !== '') {
      params = params.set('name', filter.name.trim());
    }

    if (filter?.category && filter.category.trim() !== '') {
      params = params.set('category', filter.category.trim());
    }

    return this.http.get<PropertyListItem[]>(`${API_URL}/properties`, { params });
  }

  getPropertyById(id: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${API_URL}/properties/${id}`);
  }

  createProperty(payload: PropertyPayload): Observable<PropertyDetail> {
    return this.http.post<PropertyDetail>(`${API_URL}/properties`, payload);
  }

  updateProperty(id: string, payload: PropertyPayload): Observable<PropertyDetail> {
    return this.http.put<PropertyDetail>(`${API_URL}/properties/${id}`, payload);
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/properties/${id}`);
  }

  getPropertyOverview(id: string): Observable<PropertyOverview> {
    return this.http.get<PropertyOverview>(`${API_URL}/properties/${id}/overview`);
  }
}