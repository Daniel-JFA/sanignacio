import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nuestras-raices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="raices" class="py-16 lg:py-24" style="background: #F0EBE3">
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">NUESTRAS RAÍCES</span>
        <h2 class="mt-3 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">Un templo que ha visto cambiar la ciudad</h2>
        <p class="mt-3 max-w-lg font-body text-[0.9375rem] leading-relaxed text-church-text-secondary">
          Testigo de siglos de fe, conflictos, transformaciones y esperanza, la historia de San Ignacio es también la historia de Medellín.
        </p>
        <a href="#historias" class="mt-4 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold">
          CONOCE MÁS NUESTRA HISTORIA &rarr;
        </a>

        <div class="relative mt-12">
          <div class="absolute left-0 right-0 top-[60px] hidden h-0.5 origin-left bg-gold lg:block"></div>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div *ngFor="let milestone of milestones" class="text-center">
              <div class="mx-auto mb-4 h-[80px] w-[100px] overflow-hidden rounded-lg">
                <img [src]="milestone.img" [alt]="milestone.title" class="h-full w-full object-cover" />
              </div>
              <div class="font-display text-xl text-burgundy">{{ milestone.year }}</div>
              <div class="mt-1 font-body text-sm font-semibold text-church-text">{{ milestone.title }}</div>
              <p class="mt-2 font-body text-xs leading-relaxed text-church-text-secondary">{{ milestone.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NuestrasRaicesComponent {
  milestones = [
    { year: '1803', title: 'Inicio de construcción', desc: 'Se inicia la construcción del templo bajo el estilo colonial de la época.', img: '/images/story-cuartel.jpg' },
    { year: 'Siglo XIX', title: 'Uso como cuartel', desc: 'El templo fue utilizado como cuartel en tiempos de guerras civiles.', img: '/images/story-cuartel.jpg' },
    { year: '1886', title: 'Llegada de los jesuitas', desc: 'Los jesuitas asumen la parroquia y establecen su misión educativa y social.', img: '/images/story-silencio.jpg' },
    { year: 'Actualidad', title: 'Patrimonio del centro de Medellín', desc: 'Hoy, San Ignacio es un bien patrimonial y corazón espiritual de fe y cultura.', img: '/images/story-plazuela.jpg' },
  ];
}
