import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataService, SiteConfig } from '../services/data.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-informacion-contacto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contacto" class="py-12 lg:py-16" style="background: #F0EBE3" #sectionEl>
      <div #innerEl class="mx-auto px-5 lg:px-10" style="max-width: 1200px; opacity: 0; transform: translateY(30px)">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          <!-- Dirección -->
          <div>
            <div class="mb-3 flex items-center gap-3">
              <span class="text-xl text-gold" aria-hidden="true">⌖</span>
              <h4 class="font-body text-sm font-semibold uppercase tracking-wider text-church-text">Dirección</h4>
            </div>
            <p class="whitespace-pre-line font-body text-sm leading-relaxed text-church-text-secondary">{{ config?.address }}</p>
          </div>

          <!-- Horario de Misas -->
          <div>
            <div class="mb-3 flex items-center gap-3">
              <span class="text-xl text-gold" aria-hidden="true">◷</span>
              <h4 class="font-body text-sm font-semibold uppercase tracking-wider text-church-text">Horario de Misas</h4>
            </div>
            <p class="whitespace-pre-line font-body text-[0.8rem] leading-relaxed text-church-text-secondary">{{ config?.mass_schedule }}</p>
          </div>

          <!-- Contacto -->
          <div>
            <div class="mb-3 flex items-center gap-3">
              <span class="text-xl text-gold" aria-hidden="true">☎</span>
              <h4 class="font-body text-sm font-semibold uppercase tracking-wider text-church-text">Contacto</h4>
            </div>
            <p *ngIf="config?.phone" class="font-body text-sm leading-relaxed text-church-text-secondary">{{ config?.phone }}</p>
            <p *ngIf="config?.email" class="font-body text-sm leading-relaxed text-church-text-secondary">{{ config?.email }}</p>
            <div class="mt-4 flex gap-3">
              <a *ngIf="config?.facebook_url" [href]="config?.facebook_url" target="_blank" rel="noopener noreferrer"
                 class="text-sm text-church-text-muted transition-colors hover:text-burgundy">Facebook</a>
              <a *ngIf="config?.instagram_url" [href]="config?.instagram_url" target="_blank" rel="noopener noreferrer"
                 class="text-sm text-church-text-muted transition-colors hover:text-burgundy">Instagram</a>
              <a *ngIf="config?.youtube_url" [href]="config?.youtube_url" target="_blank" rel="noopener noreferrer"
                 class="text-sm text-church-text-muted transition-colors hover:text-burgundy">YouTube</a>
            </div>
          </div>

          <!-- Mapa -->
          <div>
            <div class="mb-3 flex items-center gap-3">
              <span class="text-xl text-gold" aria-hidden="true">⌖</span>
              <h4 class="font-body text-sm font-semibold uppercase tracking-wider text-church-text">Mapa y ruta</h4>
            </div>
            <div class="overflow-hidden rounded-lg border border-church-border" style="height: 120px">
              <iframe
                *ngIf="safeMapUrl"
                [src]="safeMapUrl"
                width="100%"
                height="100%"
                style="border: 0; filter: grayscale(30%)"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Ubicación Iglesia San Ignacio de Loyola"
              ></iframe>
            </div>
            <a [href]="config?.maps_link || '#'" target="_blank" rel="noopener noreferrer"
               class="mt-3 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold">
              VER EN MAPA &rarr;
            </a>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class InformacionContactoComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('innerEl') innerEl!: ElementRef<HTMLElement>;

  config: SiteConfig | null = null;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(private dataService: DataService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.dataService.getSiteConfig().subscribe((cfg) => {
      this.config = cfg;
      if (cfg['maps_embed_url']) {
        this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cfg['maps_embed_url']);
      }
    });
  }

  ngAfterViewInit(): void {
    gsap.to(this.innerEl.nativeElement, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 80%', once: true },
    });
  }
}
