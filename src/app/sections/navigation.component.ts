import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'La Iglesia', href: '#raices' },
  { label: 'Celebraciones', href: '#agenda' },
  { label: 'Historias', href: '#historias' },
  { label: 'Recorrido', href: '#recorrido' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Contacto', href: '#contacto' },
];

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
      [style.height.px]="72"
      [style.background]="scrolled ? '#7A1F1F' : 'linear-gradient(to bottom, rgba(26,20,16,0.85), rgba(26,20,16,0.4))'"
    >
      <div class="mx-auto flex h-full items-center justify-between px-5 lg:px-10" style="max-width: 1200px">
        <a href="#inicio" class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold font-display text-xs font-bold text-gold">IHS</div>
          <div class="hidden sm:block">
            <div class="font-display text-xs uppercase leading-tight tracking-[0.06em] text-white">Iglesia San Ignacio de Loyola</div>
            <div class="font-body text-[0.6rem] uppercase tracking-[0.12em] text-gold">Medellín</div>
          </div>
        </a>

        <nav class="hidden items-center gap-6 lg:flex">
          <a
            *ngFor="let link of navLinks"
            [href]="link.href"
            class="font-body text-sm font-medium text-white/90 transition-colors duration-300 hover:text-gold"
            style="letter-spacing: 0.02em"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex items-center gap-4">
          <a href="#donar" class="hidden items-center gap-2 rounded-full border border-white/40 px-5 py-2 font-body text-sm font-semibold text-white transition-all duration-300 hover:border-gold hover:bg-gold hover:text-church-text sm:flex">
            <span aria-hidden="true">♥</span> DONAR
          </a>
          <button type="button" class="text-white lg:hidden" aria-label="Abrir menú" (click)="mobileOpen = !mobileOpen">
            <span class="text-2xl leading-none">{{ mobileOpen ? '×' : '☰' }}</span>
          </button>
        </div>
      </div>
    </header>

    <div *ngIf="mobileOpen" class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-burgundy">
      <a
        *ngFor="let link of navLinks"
        [href]="link.href"
        (click)="mobileOpen = false"
        class="font-display text-2xl text-white transition-colors hover:text-gold"
      >
        {{ link.label }}
      </a>
      <a href="#donar" (click)="mobileOpen = false" class="mt-4 flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold text-church-text">
        <span aria-hidden="true">♥</span> DONAR
      </a>
    </div>
  `,
})
export class NavigationComponent {
  navLinks = NAV_LINKS;
  mobileOpen = false;
  scrolled = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > window.innerHeight * 0.7;
  }
}
