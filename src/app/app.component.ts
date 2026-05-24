import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ],
  template: `
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
    <app-footer />
  `,
})
export class AppComponent {}
