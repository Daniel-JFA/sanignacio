import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-el-padre-cuenta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="historias" class="bg-cream py-16 lg:py-24">
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">EL PADRE CUENTA</span>
        <h2 class="mt-3 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">
          Historias de fe, memoria y espiritualidad
        </h2>

        <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <a *ngFor="let story of stories" href="#contacto" class="group overflow-hidden rounded-lg border border-church-border bg-white shadow-card transition-all duration-300 hover:shadow-card-hover">
            <div class="relative overflow-hidden" style="aspect-ratio: 16/10">
              <img [src]="story.img" [alt]="story.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <span class="absolute left-3 top-3 rounded-full px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-white" [style.background]="story.badgeColor">
                {{ story.badge }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-display text-[1.15rem] font-medium leading-tight text-church-text">{{ story.title }}</h3>
              <p class="mt-2 font-body text-sm leading-relaxed text-church-text-secondary">{{ story.desc }}</p>
              <span class="mt-4 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors group-hover:text-gold">
                LEER HISTORIA &rarr;
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class ElPadreCuentaComponent {
  stories = [
    { badge: 'HISTORIA', badgeColor: '#7A1F1F', title: 'Cuando San Ignacio fue cuartel', desc: 'Relato de un tiempo de tensiones en el que el templo se convirtió en la historia silenciosa de la historia nacional.', img: '/images/story-cuartel.jpg' },
    { badge: 'FILOSOFÍA', badgeColor: '#5A1515', title: 'El silencio también habla', desc: 'Reflexiones sobre el valor del silencio, la oración y la escucha en la vida espiritual.', img: '/images/story-silencio.jpg' },
    { badge: 'PATRIMONIO', badgeColor: '#7A1F1F', title: 'La plazuela y la ciudad', desc: 'Memorias y anécdotas de la plazuela de San Ignacio y su relación entrañable con Medellín.', img: '/images/story-plazuela.jpg' },
  ];
}
