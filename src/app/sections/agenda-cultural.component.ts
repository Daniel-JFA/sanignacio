import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agenda-cultural',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="agenda" class="bg-cream py-16 lg:py-24">
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div class="flex items-center justify-between gap-6">
          <div>
            <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">AGENDA CULTURAL Y ESPIRITUAL</span>
            <h2 class="mt-2 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">Próximas actividades</h2>
          </div>
          <a href="#contacto" class="hidden font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold sm:inline-block">VER TODA LA AGENDA &rarr;</a>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <a *ngFor="let event of events" href="#contacto" class="group flex flex-col overflow-hidden rounded-lg border border-church-border bg-white shadow-card transition-all duration-300 hover:border-gold">
            <div class="flex">
              <div class="flex shrink-0 flex-col items-center justify-center px-4 py-4 text-center text-white" style="background: #7A1F1F; min-width: 72px">
                <span class="font-body text-[0.6rem] font-semibold uppercase tracking-wider">{{ event.dayName }}</span>
                <span class="mt-1 font-display text-2xl leading-none">{{ event.day }}</span>
                <span class="mt-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider">{{ event.month }}</span>
              </div>
              <div class="h-[100px] w-full overflow-hidden">
                <img [src]="event.img" [alt]="event.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>
            <div class="flex-1 p-5">
              <span class="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-church-text-muted">{{ event.time }}</span>
              <h3 class="mt-1 font-display text-[1.1rem] font-medium leading-tight text-church-text">{{ event.title }}</h3>
              <p class="mt-2 font-body text-sm leading-relaxed text-church-text-secondary">{{ event.desc }}</p>
              <span class="mt-4 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors group-hover:text-gold">VER DETALLES &rarr;</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class AgendaCulturalComponent {
  events = [
    { dayName: 'SÁB', day: '25', month: 'MAY', time: '10:00 A.M.', title: 'Misa solemne', desc: 'Celebración eucarística presidida por la comunidad jesuita e Ignaciana.', img: '/images/agenda-misa.jpg' },
    { dayName: 'MIE', day: '29', month: 'MAY', time: '6:30 P.M.', title: 'Charla: memoria y ciudad', desc: 'Conversatorio sobre la historia de la Compañía de Jesús en la construcción de ciudad.', img: '/images/agenda-charla.jpg' },
    { dayName: 'VIE', day: '31', month: 'MAY', time: '8:00 A.M.', title: 'Recorrido patrimonial', desc: 'Visita guiada por espacios históricos y arquitectónicos de San Ignacio.', img: '/images/tour-nave.jpg' },
  ];
}
