import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { EPropertyCategory, PropertyPayload } from '../../core/models/property.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.css',
})
export class PropertyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  readonly categories = Object.values(EPropertyCategory);
  readonly propertyId = signal<string | null>(null);
  readonly isEditMode = signal(false);
  readonly loadingData = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    location: ['', [Validators.required]],
    address: ['', [Validators.required]],
    category: [EPropertyCategory.Hotel, [Validators.required]],
    description: [''],
    imageUrl: [''],
    roomPrices: this.fb.nonNullable.group({
      Standard: [0, [Validators.required, Validators.min(0)]],
      Superior: [0, [Validators.required, Validators.min(0)]],
      Family: [0, [Validators.required, Validators.min(0)]],
    }),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyId.set(id);
      this.isEditMode.set(true);
      this.loadProperty(id);
    }
  }

  private loadProperty(id: string): void {
    this.loadingData.set(true);
    this.errorMessage.set(null);

    this.propertyService.getPropertyById(id).subscribe({
      next: (prop) => {
        this.form.patchValue({
          name: prop.name,
          location: prop.location,
          address: prop.address,
          category: prop.category,
          description: prop.description ?? '',
          imageUrl: prop.imageUrl ?? '',
          roomPrices: {
            Standard: prop.roomPrices?.Standard ?? 0,
            Superior: prop.roomPrices?.Superior ?? 0,
            Family: prop.roomPrices?.Family ?? 0,
          },
        });
        this.loadingData.set(false);
      },
      error: (err) => {
        this.loadingData.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Nem sikerült betölteni a szálláshely adatait.'
        );
      },
    });
  }

  preventNegativeKey(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: PropertyPayload = {
      name: raw.name.trim(),
      location: raw.location.trim(),
      address: raw.address.trim(),
      category: raw.category,
      description: raw.description.trim(),
      imageUrl: raw.imageUrl.trim(),
      roomPrices: {
        Standard: Math.max(0, Number(raw.roomPrices.Standard)),
        Superior: Math.max(0, Number(raw.roomPrices.Superior)),
        Family: Math.max(0, Number(raw.roomPrices.Family)),
      },
    };

    this.submitting.set(true);

    const id = this.propertyId();
    const request$ = id
      ? this.propertyService.updateProperty(id, payload)
      : this.propertyService.createProperty(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/properties']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Mentési hiba történt. Ellenőrizd a megadott mezőket!'
        );
      },
    });
  }

  onPreviewError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/seed/preview-fallback/600/400';
  }
}