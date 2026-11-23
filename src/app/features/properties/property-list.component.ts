import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { EPropertyCategory, PropertyListItem } from '../../core/models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css',
})
export class PropertyListComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);

  readonly categories = Object.values(EPropertyCategory);
  readonly properties = signal<PropertyListItem[]>([]);
  readonly searchName = signal('');
  readonly selectedCategory = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.propertyService
      .getProperties({
        name: this.searchName(),
        category: this.selectedCategory(),
      })
      .subscribe({
        next: (items) => {
          this.properties.set(items);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Nem sikerült betölteni a szálláshelyeket.'
          );
        },
      });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchName.set(input.value);
    this.loadProperties();
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
    this.loadProperties();
  }

  onDelete(property: PropertyListItem): void {
    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd a(z) "${property.name}" szálláshelyet? A hozzá tartozó foglalások is törlődnek.`
    );

    if (!confirmed) {
      return;
    }

    this.propertyService.deleteProperty(property.id).subscribe({
      next: () => {
        this.loadProperties();
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Hiba történt a szálláshely törlése közben.'
        );
      },
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/seed/property-fallback/600/400';
  }
}