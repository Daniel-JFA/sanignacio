import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-service-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative z-10 -mt-12 px-5 lg:px-10" #sectionEl>
      <div class="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" style="max-width: 1100px">
        <a *ngFor="let card of cards" [href]="card.href" #cardEl
           class="group rounded-lg border border-church-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
           style="opacity: 0; transform: translateY(30px) scale(0.97)">
          <div class="flex h-12 w-12 items-center justify-center rounded-full text-gold" style="background: rgba(201,168,76,0.12)">
            <span class="text-xl" aria-hidden="true">{{ card.icon }}</span>
          </div>
          <h3 class="mt-4 font-display text-base font-medium text-church-text">{{ card.title }}</h3>
          <p class="mt-2 font-body text-sm leading-relaxed text-church-text-secondary">{{ card.desc }}</p>
          <span class="mt-4 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors group-hover:text-gold">
            {{ card.link }} &rarr;
          </span>
        </a>
      </div>
    </section>
  `,
})
export class ServiceCardsComponent implements AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef<HTMLElement>>;

  cards = [
    { icon: '♱', title: 'Horarios de misa', desc: 'Encuentra aquí los horarios de nuestras celebraciones.', link: 'VER HORARIOS', href: '#agenda' },
    { icon: '✚', title: 'Confesiones', desc: 'Un espacio para el encuentro con la misericordia de Dios.', link: 'VER CONFESIONES', href: '#contacto' },
    { icon: '⌖', title: 'Cómo llegar', desc: 'Estamos en el corazón del centro de Medellín.', link: 'VER RUTA', href: '#contacto' },
    { icon: '✦', title: 'Despacho', desc: 'Requisitos para bautismos, matrimonios y trámites parroquiales.', link: 'MÁS INFORMACIÓN', href: '#despacho' },
  ];

  ngAfterViewInit(): void {
    const els = this.cardEls.map(r => r.nativeElement);
    gsap.to(els, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7, ease: 'back.out(1.4)',
      stagger: 0.1,
      scrollTrigger: {
        trigger: this.sectionEl.nativeElement,
        start: 'top 85%',
        once: true,
      },
    });
  }
}
