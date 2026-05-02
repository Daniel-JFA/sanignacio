import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-informacion-contacto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contacto" class="py-12 lg:py-16" style="background: #F0EBE3">
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div *ngFor="let column of columns">
            <div class="mb-3 flex items-center gap-3">
              <span class="text-xl text-gold" aria-hidden="true">{{ column.icon }}</span>
              <h4 class="font-body text-sm font-semibold uppercase tracking-wider text-church-text">{{ column.title }}</h4>
            </div>
            <p class="whitespace-pre-line font-body text-sm leading-relaxed text-church-text-secondary">{{ column.content }}</p>
            <div *ngIf="column.hasSocials" class="mt-4 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-sm text-church-text-muted transition-colors hover:text-burgundy">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-sm text-church-text-muted transition-colors hover:text-burgundy">Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="text-sm text-church-text-muted transition-colors hover:text-burgundy">YouTube</a>
            </div>
          </div>

          <div>
            <div class="mb-3 flex items-center gap-3">
              <span class="text-xl text-gold" aria-hidden="true">⌖</span>
              <h4 class="font-body text-sm font-semibold uppercase tracking-wider text-church-text">Mapa y ruta</h4>
            </div>
            <div class="overflow-hidden rounded-lg border border-church-border" style="height: 120px">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-75.5685!3d6.2450!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb1e1c52d%3A0x1234567890abcdef!2sIglesia+San+Ignacio+de+Loyola!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style="border: 0; filter: grayscale(30%)"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Ubicación"
              ></iframe>
            </div>
            <a href="https://maps.google.com/?q=Iglesia+San+Ignacio+de+Loyola+Medellin" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold">
              VER EN MAPA &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class InformacionContactoComponent {
  columns = [
    { icon: '⌖', title: 'Dirección', content: 'Plazuela San Ignacio\nCra. 43 #49-59\nMedellín, Antioquia.' },
    { icon: '◷', title: 'Horarios de apertura', content: 'Lunes a sábado 6:00 a.m. – 7:00 p.m.\nDomingos 7:00 a.m. – 8:00 p.m.' },
    { icon: '☎', title: 'Contacto', content: '+57 (604) 216 2674\ninfo@sanignaciomedellin.org', hasSocials: true },
  ];
}
