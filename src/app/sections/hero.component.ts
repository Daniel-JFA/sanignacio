import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="inicio" class="relative overflow-hidden" style="height: 88vh">
      <div class="absolute inset-0 will-change-transform" style="height: 120%" [style.transform]="backgroundTransform">
        <img [src]="heroSrc" (error)="heroSrc = fallbackSrc" alt="Iglesia San Ignacio de Loyola" class="h-full w-full object-cover" />
      </div>
      <div class="absolute inset-0" style="background: rgba(26,20,16,0.35)"></div>
      <div class="relative flex h-full flex-col justify-center px-5 lg:px-10" style="z-index: 2; max-width: 700px; padding-left: clamp(1.5rem, 6vw, 5rem)">
        <span class="inline-block w-fit rounded-full px-4 py-2 font-body text-[0.65rem] font-semibold uppercase tracking-[0.1em]" style="background: #C9A84C; color: #1A1410">
          DESDE 1803
        </span>
        <h1 class="mt-5 font-display font-normal text-white" style="font-size: clamp(2.8rem, 5.5vw, 4.5rem); line-height: 1.1">
          San Ignacio<br />de Loyola
        </h1>
        <p class="mt-4 font-body text-lg" style="color: rgba(255,255,255,0.85)">Fe, historia y memoria viva del centro de Medellín</p>
        <p class="mt-3 max-w-md font-body text-[0.9375rem]" style="color: rgba(255,255,255,0.7); line-height: 1.65">
          Más que un templo: un espacio donde la espiritualidad, la filosofía y la teología se encuentran con el patrimonio, y la historia de nuestra ciudad.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#agenda" class="flex items-center gap-2 rounded-full px-6 py-3 font-body text-[0.8125rem] font-semibold tracking-wide text-white transition-opacity hover:opacity-90" style="background: #7A1F1F">
            <span aria-hidden="true">◷</span> VER HORARIOS
          </a>
          <a href="#historias" class="flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-body text-[0.8125rem] font-semibold tracking-wide text-white transition-all hover:bg-white/10">
            <span aria-hidden="true">▦</span> EXPLORAR HISTORIAS
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  heroSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/2018_Medell%C3%ADn_iglesia_de_San_Ignacio.jpg/1920px-2018_Medell%C3%ADn_iglesia_de_San_Ignacio.jpg';
  fallbackSrc = '/images/hero-facade.jpg';
  backgroundTransform = 'translate3d(0, 0, 0)';

  @HostListener('window:scroll')
  onWindowScroll() {
    this.backgroundTransform = `translate3d(0, -${window.scrollY * 0.25}px, 0)`;
  }
}
