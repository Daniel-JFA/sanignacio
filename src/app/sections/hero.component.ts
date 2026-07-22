import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="inicio" class="relative overflow-hidden" style="height: 88vh" #heroSection>
      <div #bgEl class="absolute inset-0 will-change-transform" style="height: 120%">
        <img
          [src]="heroSrc"
          (error)="heroSrc = fallbackSrc"
          alt="Iglesia San Ignacio de Loyola"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="absolute inset-0" style="background: rgba(26,20,16,0.40)"></div>
      <div class="relative flex h-full flex-col justify-center px-5 lg:px-10" style="z-index: 2; max-width: 700px; padding-left: clamp(1.5rem, 6vw, 5rem)">
        <span #badgeEl class="inline-block w-fit rounded-full px-4 py-2 font-body text-[0.65rem] font-semibold uppercase tracking-[0.1em]" style="background: #C9A84C; color: #1A1410; opacity: 0; transform: translateY(20px)">
          DESDE 1803
        </span>
        <h1 #titleEl class="mt-5 font-display font-normal text-white" style="font-size: clamp(2.8rem, 5.5vw, 4.5rem); line-height: 1.1; opacity: 0; transform: translateY(30px)">
          San Ignacio<br />de Loyola
        </h1>
        <p #sub1El class="mt-4 font-body text-lg" style="color: rgba(255,255,255,0.85); opacity: 0; transform: translateY(20px)">Fe, historia y memoria viva del centro de Medellín</p>
        <p #sub2El class="mt-3 max-w-md font-body text-[0.9375rem]" style="color: rgba(255,255,255,0.7); line-height: 1.65; opacity: 0; transform: translateY(20px)">
          Más que un templo: un espacio donde la espiritualidad, la filosofía y la teología se encuentran con el patrimonio, y la historia de nuestra ciudad.
        </p>
        <div #ctaEl class="mt-8 flex flex-wrap gap-3" style="opacity: 0; transform: translateY(15px)">
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
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('bgEl') bgEl!: ElementRef<HTMLElement>;
  @ViewChild('badgeEl') badgeEl!: ElementRef<HTMLElement>;
  @ViewChild('titleEl') titleEl!: ElementRef<HTMLElement>;
  @ViewChild('sub1El') sub1El!: ElementRef<HTMLElement>;
  @ViewChild('sub2El') sub2El!: ElementRef<HTMLElement>;
  @ViewChild('ctaEl') ctaEl!: ElementRef<HTMLElement>;

  heroSrc = '/images/fachada-tarde.jpg';
  fallbackSrc = '/images/fachada-actual.jpg';

  ngAfterViewInit(): void {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(this.badgeEl.nativeElement, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(this.titleEl.nativeElement, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.35')
      .to(this.sub1El.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to(this.sub2El.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
      .to(this.ctaEl.nativeElement, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');

    // GSAP parallax on bg via ScrollTrigger
    ScrollTrigger.create({
      trigger: this.heroSection.nativeElement,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(this.bgEl.nativeElement, { y: self.progress * -130 });
      },
    });
  }
}
