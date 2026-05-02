import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recorrido-patrimonial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="recorrido" class="py-16 lg:py-24" style="background: #F0EBE3">
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">RECORRIDO PATRIMONIAL</span>
        <h2 class="mt-3 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">Descubre cada rincón de nuestra iglesia</h2>
        <p class="mt-3 max-w-lg font-body text-[0.9375rem] leading-relaxed text-church-text-secondary">
          Un recorrido por la belleza arquitectónica, los símbolos y las historias que habitan este lugar sagrado.
        </p>
        <a href="#contacto" class="mt-5 inline-block rounded-full px-6 py-3 font-body text-[0.8125rem] font-semibold tracking-wide text-white transition-opacity hover:opacity-90" style="background: #7A1F1F">
          INICIAR RECORRIDO VIRTUAL
        </a>

        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-lg">
              <img src="/images/tour-nave.jpg" alt="Interior de la iglesia" class="w-full object-cover" style="max-height: 400px" />
              <div *ngFor="let spot of spots" class="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-white font-body text-xs font-bold text-church-text shadow-lg" [class]="spot.position">
                {{ spot.num }}
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <div *ngFor="let spot of spots" class="flex items-start gap-4">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold font-body text-sm font-bold text-church-text">{{ spot.num }}</div>
              <div>
                <h4 class="font-body text-sm font-semibold text-church-text">{{ spot.title }}</h4>
                <p class="mt-1 font-body text-xs leading-relaxed text-church-text-secondary">{{ spot.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class RecorridoPatrimonialComponent {
  spots = [
    { num: 1, title: 'Fachada barroca', desc: 'Belleza y esplendor que dan la bienvenida al templo.', position: 'top-[20%] left-[35%]' },
    { num: 2, title: 'Nave central', desc: 'La obra maestra de la arquitectura colonial.', position: 'top-[45%] left-[50%]' },
    { num: 3, title: 'Altar mayor', desc: 'Cristo litúrgico y símbolo de nuestra fe.', position: 'top-[30%] right-[30%]' },
    { num: 4, title: 'Claustro San Ignacio', desc: 'Un remanso de paz y memoria en medio de la ciudad.', position: 'bottom-[20%] left-[20%]' },
  ];
}
