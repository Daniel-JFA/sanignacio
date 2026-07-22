import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
import { NavigationComponent } from './sections/navigation.component';
import { HeroComponent } from './sections/hero.component';
import { ServiceCardsComponent } from './sections/service-cards.component';
import { DespachoComponent } from './sections/despacho.component';
import { NuestrasRaicesComponent } from './sections/nuestras-raices.component';
import { ElPadreCuentaComponent } from './sections/el-padre-cuenta.component';
import { RecorridoPatrimonialComponent } from './sections/recorrido-patrimonial.component';
import { AgendaCulturalComponent } from './sections/agenda-cultural.component';
import { GaleriaVisualComponent } from './sections/galeria-visual.component';
import { InformacionContactoComponent } from './sections/informacion-contacto.component';
import { DonacionCtaComponent } from './sections/donacion-cta.component';
import { FooterComponent } from './sections/footer.component';
import { AdminComponent } from './sections/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    HeroComponent,
    ServiceCardsComponent,
    DespachoComponent,
    NuestrasRaicesComponent,
    ElPadreCuentaComponent,
    RecorridoPatrimonialComponent,
    AgendaCulturalComponent,
    GaleriaVisualComponent,
    InformacionContactoComponent,
    DonacionCtaComponent,
    FooterComponent,
    AdminComponent,
  ],
  template: `
    <ng-container *ngIf="!showAdmin">
      <app-navigation />
      <app-hero />
      <app-service-cards />
      <app-despacho />
      <app-nuestras-raices />
      <app-el-padre-cuenta />
      <app-recorrido-patrimonial />
      <app-agenda-cultural />
      <app-galeria-visual />
      <app-informacion-contacto />
      <app-donacion-cta />
      <app-footer (onAdminClick)="showAdmin = true" />
    </ng-container>
    <app-admin *ngIf="showAdmin" (goBack)="showAdmin = false" />
  `,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  showAdmin = false;
  private lenis: Lenis | null = null;
  private rafId = 0;

  ngAfterViewInit(): void {
    this.lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    this.lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      this.lenis!.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);

    gsap.ticker.lagSmoothing(0);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
    ScrollTrigger.killAll();
  }
}
