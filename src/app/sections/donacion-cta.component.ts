import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-donacion-cta',
  standalone: true,
  template: `
    <section id="donar" class="py-10" style="background: linear-gradient(90deg, #5A1515, #7A1F1F)" #sectionEl>
      <div #innerEl class="mx-auto flex flex-col items-center justify-between gap-6 px-5 lg:flex-row lg:px-10" style="max-width: 1200px; opacity: 0; transform: translateY(25px)">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold text-gold">
            <span class="text-2xl" aria-hidden="true">♱</span>
          </div>
          <div>
            <h3 class="font-display text-xl leading-tight text-white lg:text-2xl">Ayuda a conservar esta historia viva</h3>
            <p class="mt-1 font-body text-sm" style="color: rgba(255,255,255,0.75)">
              Tu apoyo permite el cuidado del templo, la acción pastoral, la educación y la preservación de nuestro patrimonio.
            </p>
          </div>
        </div>
        <div class="shrink-0 text-center lg:text-right">
          <a href="mailto:info@sanignaciomedellin.org?subject=Quiero%20donar" class="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-body text-sm font-semibold transition-opacity hover:opacity-90" style="background: #C9A84C; color: #1A1410">
            <span aria-hidden="true">♥</span> DONAR AHORA
          </a>
          <p class="mt-2 font-body text-xs" style="color: rgba(255,255,255,0.6)">Cada aporte deja huella.</p>
        </div>
      </div>
    </section>
  `,
})
export class DonacionCtaComponent implements AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('innerEl') innerEl!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    gsap.to(this.innerEl.nativeElement, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 85%', once: true },
    });
  }
}
