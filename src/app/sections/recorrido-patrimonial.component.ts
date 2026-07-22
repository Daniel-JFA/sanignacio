import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-recorrido-patrimonial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="recorrido" class="py-16 lg:py-24" style="background: #F0EBE3" #sectionEl>
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div #headerEl style="opacity: 0; transform: translateY(30px)">
          <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">RECORRIDO PATRIMONIAL</span>
          <h2 class="mt-3 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">Descubre cada rincón de nuestra iglesia</h2>
          <p class="mt-3 max-w-lg font-body text-[0.9375rem] leading-relaxed text-church-text-secondary">
            Un recorrido por la belleza arquitectónica, los símbolos y las historias que habitan este lugar sagrado.
          </p>
          <a href="#contacto" class="mt-5 inline-block rounded-full px-6 py-3 font-body text-[0.8125rem] font-semibold tracking-wide text-white transition-opacity hover:opacity-90" style="background: #7A1F1F">
            INICIAR RECORRIDO VIRTUAL
          </a>
        </div>

        <div #contentEl class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3" style="opacity: 0; transform: translateY(40px)">
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-lg">
              <img src="/images/tour-nave.jpg" alt="Interior de la iglesia" class="w-full object-cover" style="max-height: 400px" />
              <div *ngFor="let spot of spots"
                   class="absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gold bg-white font-body text-xs font-bold text-church-text shadow-lg transition-transform hover:scale-110"
                   [class]="spot.position"
                   [class.ring-2]="activeSpot === spot.num"
                   [style.ring-color]="'#C9A84C'"
                   (click)="activeSpot = spot.num">
                {{ spot.num }}
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <button *ngFor="let spot of spots" (click)="activeSpot = spot.num"
               class="flex w-full items-start gap-4 rounded-lg p-3 text-left transition-colors"
               [class.bg-white]="activeSpot === spot.num"
               [class.shadow-card]="activeSpot === spot.num">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-body text-sm font-bold text-church-text transition-colors"
                   [style.border-color]="activeSpot === spot.num ? '#C9A84C' : '#D4C5B0'"
                   [style.color]="activeSpot === spot.num ? '#7A1F1F' : ''">
                {{ spot.num }}
              </div>
              <div>
                <h4 class="font-body text-sm font-semibold text-church-text">{{ spot.title }}</h4>
                <p class="mt-1 font-body text-xs leading-relaxed text-church-text-secondary">{{ spot.desc }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class RecorridoPatrimonialComponent implements AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChild('contentEl') contentEl!: ElementRef<HTMLElement>;

  activeSpot: number | null = null;

  spots = [
    { num: 1, title: 'Fachada barroca', desc: 'Belleza y esplendor que dan la bienvenida al templo.', position: 'top-[20%] left-[35%]' },
    { num: 2, title: 'Nave central', desc: 'La obra maestra de la arquitectura colonial.', position: 'top-[45%] left-[50%]' },
    { num: 3, title: 'Altar mayor', desc: 'Cristo litúrgico y símbolo de nuestra fe.', position: 'top-[30%] right-[30%]' },
    { num: 4, title: 'Claustro San Ignacio', desc: 'Un remanso de paz y memoria en medio de la ciudad.', position: 'bottom-[20%] left-[20%]' },
  ];

  ngAfterViewInit(): void {
    const trigger = { trigger: this.sectionEl.nativeElement, start: 'top 80%', once: true };
    gsap.to(this.headerEl.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger });
    gsap.to(this.contentEl.nativeElement, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 72%', once: true },
    });
  }
}
