import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import { DataService, GalleryItem } from '../services/data.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-galeria-visual',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .lightbox-backdrop { animation: fadeIn 0.25s ease; }
    .lightbox-img { animation: scaleIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.93) } to { opacity: 1; transform: scale(1) } }
  `],
  template: `
    <section class="bg-cream py-16 lg:py-24" #sectionEl>
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div #headerEl class="flex items-center justify-between gap-6" style="opacity: 0; transform: translateY(25px)">
          <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">GALERÍA Y MEMORIA VISUAL</span>
          <a href="#contacto" class="font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold">VER MÁS FOTOS &rarr;</a>
        </div>
        <div class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <button *ngFor="let photo of photos; let i = index" #photoEl (click)="openLightbox(i)"
             class="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
             style="opacity: 0; transform: scale(0.95)">
            <img [src]="photo.img" [alt]="photo.alt" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
              <svg class="opacity-0 transition-opacity duration-300 group-hover:opacity-100" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div *ngIf="lightboxIndex !== null" class="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(10,8,6,0.92)" (click)="closeLightbox()">
      <button class="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25" (click)="$event.stopPropagation(); prev()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <img *ngIf="lightboxIndex !== null" class="lightbox-img max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" [src]="photos[lightboxIndex].img" [alt]="photos[lightboxIndex].alt" (click)="$event.stopPropagation()" />
      <button class="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25" (click)="$event.stopPropagation(); next()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <button class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25" (click)="closeLightbox()" aria-label="Cerrar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="absolute bottom-4 font-body text-xs text-white/50">{{ (lightboxIndex ?? 0) + 1 }} / {{ photos.length }}</div>
    </div>
  `,
})
export class GaleriaVisualComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChildren('photoEl') photoEls!: QueryList<ElementRef<HTMLElement>>;

  photos: GalleryItem[] = [];
  lightboxIndex: number | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getGallery().subscribe({
      next: (data) => (this.photos = data),
      error: (err) => console.error('Error loading gallery:', err),
    });
  }

  ngAfterViewInit(): void {
    const trigger = { trigger: this.sectionEl.nativeElement, start: 'top 80%', once: true };
    gsap.to(this.headerEl.nativeElement, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: trigger });
    this.photoEls.changes.subscribe(() => this.animatePhotos());
    this.animatePhotos();
  }

  private animatePhotos(): void {
    const els = this.photoEls.map(r => r.nativeElement);
    if (!els.length) return;
    gsap.to(els, {
      opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.07,
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 75%', once: true },
    });
  }

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxIndex = null;
    document.body.style.overflow = '';
  }

  prev(): void {
    if (this.lightboxIndex === null) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + this.photos.length) % this.photos.length;
  }

  next(): void {
    if (this.lightboxIndex === null) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % this.photos.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (this.lightboxIndex === null) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowLeft') this.prev();
    if (e.key === 'ArrowRight') this.next();
  }
}
