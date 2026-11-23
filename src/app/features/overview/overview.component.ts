import { Component, OnInit, inject, signal } from '@angular/core';
import { PropertyService } from '../../core/services/property.service';
import { PropertyListItem } from '../../core/models/property.model';
import { PropertyOverview } from '../../core/models/booking.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);

  readonly properties = signal<PropertyListItem[]>([]);
  readonly selectedPropertyId = signal<string>('');
  readonly overview = signal<PropertyOverview | null>(null);
  readonly loadingProperties = signal(true);
  readonly loadingOverview = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loadingProperties.set(true);
    this.errorMessage.set(null);

    this.propertyService.getProperties().subscribe({
      next: (list) => {
        this.properties.set(list);
        this.loadingProperties.set(false);

        if (list.length > 0) {
          this.selectedPropertyId.set(list[0].id);
          this.loadOverview(list[0].id);
        } else {
          this.overview.set(null);
        }
      },
      error: (err) => {
        this.loadingProperties.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Nem sikerült betölteni a szálláshelyeket.'
        );
      },
    });
  }

  onPropertyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    this.selectedPropertyId.set(id);
    if (id) {
      this.loadOverview(id);
    }
  }

  loadOverview(propertyId: string): void {
    this.loadingOverview.set(true);
    this.errorMessage.set(null);

    this.propertyService.getPropertyOverview(propertyId).subscribe({
      next: (data) => {
        this.overview.set(data);
        this.loadingOverview.set(false);
      },
      error: (err) => {
        this.loadingOverview.set(false);
        this.overview.set(null);
        this.errorMessage.set(
          err?.error?.message || 'Nem sikerült betölteni a szálláshely áttekintését.'
        );
      },
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/seed/fallback/120/80';
  }
}