import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { OverviewComponent } from './features/overview/overview.component';
import { PropertyListComponent } from './features/properties/property-list.component';
import { PropertyFormComponent } from './features/properties/property-form.component';
import { BookingListComponent } from './features/bookings/booking-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'properties', component: PropertyListComponent },
      { path: 'properties/new', component: PropertyFormComponent },
      { path: 'properties/:id/edit', component: PropertyFormComponent },
      { path: 'bookings', component: BookingListComponent },
    ],
  },
  { path: '**', redirectTo: 'overview' },
];