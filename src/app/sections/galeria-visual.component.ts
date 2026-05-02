import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-galeria-visual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-cream py-16 lg:py-24">
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div class="flex items-center justify-between gap-6">
          <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">GALERÍA Y MEMORIA VISUAL</span>
          <a href="#contacto" class="font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold">VER MÁS FOTOS &rarr;</a>
        </div>
        <div class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div *ngFor="let photo of photos" class="group relative aspect-square cursor-pointer overflow-hidden rounded-lg">
            <img [src]="photo.img" [alt]="photo.alt" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"></div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class GaleriaVisualComponent {
  photos = [
    { img: '/images/gallery-1.jpg', alt: 'Fachada de la iglesia al atardecer' },
    { img: '/images/gallery-2.jpg', alt: 'Interior con altar dorado' },
    { img: '/images/gallery-3.jpg', alt: 'Plazuela San Ignacio' },
    { img: '/images/gallery-4.jpg', alt: 'Emblema JHS en piedra' },
  ];
}
