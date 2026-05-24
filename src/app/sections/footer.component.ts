import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer style="background: #1A1410">
      <div class="mx-auto px-5 pb-8 pt-14 lg:px-10" style="max-width: 1200px">
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div class="flex items-center">
              <img
                src="/images/logo-san-ignacio.jpeg"
                alt="Parroquia San Ignacio de Loyola"
                class="h-14 w-auto max-w-[240px] rounded-md bg-white p-1 object-contain"
              />
            </div>
            <p class="mt-4 font-body text-sm leading-relaxed text-church-text-muted">
              Fe, Razón, Justicia, Servicio.<br />
              <em class="text-gold/80">En todo amar y servir.</em>
            </p>
          </div>

          <div>
            <h4 class="mb-4 font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">Contacto</h4>
            <div class="space-y-3 font-body text-sm text-church-text-muted">
              <p>Plazuela San Ignacio, Cra. 43 #49-59</p>
              <p>+57 (604) 216 2674</p>
              <p>info&#64;sanignaciomedellin.org</p>
            </div>
          </div>

          <div>
            <h4 class="mb-4 font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">Enlaces Rápidos</h4>
            <ul class="space-y-2.5">
              <li *ngFor="let link of quickLinks"><a [href]="link.href" class="font-body text-sm text-church-text-muted transition-colors hover:text-white">{{ link.label }}</a></li>
            </ul>
          </div>

          <div>
            <h4 class="mb-4 font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">Síguenos</h4>
            <ul class="space-y-2.5">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="font-body text-sm text-church-text-muted transition-colors hover:text-white">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="font-body text-sm text-church-text-muted transition-colors hover:text-white">Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="font-body text-sm text-church-text-muted transition-colors hover:text-white">YouTube</a></li>
            </ul>
            <blockquote class="mt-5 border-l-2 border-gold/30 pl-3">
              <p class="font-body text-xs italic leading-relaxed text-church-text-muted">
                "No basta saber lo que el hombre ha hecho, es necesario saber lo que ha querido hacer y lo que ha querido hacer."
              </p>
              <cite class="mt-1 block font-body text-[0.7rem] not-italic text-church-text-muted">— San Ignacio de Loyola</cite>
            </blockquote>
          </div>

          <div>
            <h4 class="mb-4 font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">Boletín</h4>
            <p class="mb-3 font-body text-sm text-church-text-muted">Recibe noticias y actividades de nuestra comunidad.</p>
            <form class="space-y-3">
              <input type="email" placeholder="Tu correo electrónico" class="w-full rounded-md border px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder-white/30 focus:border-gold" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15)" />
              <button type="submit" class="w-full rounded-md py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90" style="background: #7A1F1F">SUSCRIBIRME</button>
            </form>
          </div>
        </div>

        <div class="my-8" style="height: 1px; background: rgba(255,255,255,0.08)"></div>
        <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p class="font-body text-xs text-church-text-muted">© 2024 Iglesia San Ignacio de Loyola. Todos los derechos reservados.</p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <span class="font-body text-xs text-church-text-muted">Visitas internas: {{ visitCount }}</span>
            <a href="#contacto" class="font-body text-xs text-church-text-muted transition-colors hover:text-white">Política de privacidad</a>
            <a href="#contacto" class="font-body text-xs text-church-text-muted transition-colors hover:text-white">Términos de uso</a>
          </div>
        </div>
      </div>
      <div class="pb-4 text-center">
        <span class="font-body text-[0.65rem] text-church-text-muted/50">Hecho con ♥ desde Medellín</span>
      </div>
    </footer>
  `,
})
export class FooterComponent implements OnInit {
  visitCount = 0;

  quickLinks = [
    { label: 'Horarios de misa', href: '#agenda' },
    { label: 'Confesiones', href: '#contacto' },
    { label: 'Despacho', href: '#despacho' },
    { label: 'Recorrido patrimonial', href: '#recorrido' },
    { label: 'Historias', href: '#historias' },
    { label: 'Transparencia', href: '#contacto' },
  ];

  ngOnInit() {
    const storageKey = 'sanIgnacioVisitCount';
    const currentCount = Number(localStorage.getItem(storageKey) ?? '0');
    this.visitCount = Number.isFinite(currentCount) ? currentCount + 1 : 1;
    localStorage.setItem(storageKey, String(this.visitCount));
  }
}
