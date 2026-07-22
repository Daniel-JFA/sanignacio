import { CommonModule } from '@angular/common';
import { Component, HostListener, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type OfficeSection = {
  title: string;
  intro?: string;
  summary: string;
  notes: string[];
  requirements: string[];
  finalNote: string;
};

@Component({
  selector: 'app-despacho',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="despacho" class="bg-white px-5 py-16 lg:px-10 lg:py-24" #sectionEl>
      <div class="mx-auto" style="max-width: 1100px">
        <div class="max-w-3xl" #headerEl style="opacity: 0; transform: translateY(30px)">
          <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">Despacho parroquial</span>
          <h2 class="mt-2 font-display text-3xl leading-tight text-church-text md:text-4xl">Requisitos y trámites</h2>
          <p class="mt-4 font-body text-base leading-relaxed text-church-text-secondary">
            Información para preparar Bautismo y Matrimonio en la Parroquia San Ignacio de Loyola.
          </p>
        </div>

        <div #cardsEl class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2" style="opacity: 0; transform: translateY(40px)">
          <article *ngFor="let item of officeSections" class="flex h-full flex-col rounded-lg border border-church-border bg-cream p-6 shadow-card lg:p-8">
            <h3 class="font-display text-2xl leading-tight text-burgundy">{{ item.title }}</h3>
            <p *ngIf="item.intro" class="mt-3 font-body text-sm leading-relaxed text-church-text-secondary">{{ item.intro }}</p>
            <p class="mt-4 font-body text-sm leading-relaxed text-church-text-secondary">{{ item.summary }}</p>
            <div class="mt-auto pt-6">
              <button
                type="button"
                class="rounded-md bg-burgundy px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                (click)="openModal(item)"
              >
                Ver requisitos
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div
      *ngIf="selectedSection"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="selectedSection.title"
      (click)="closeModal()"
    >
      <div class="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-card-hover" (click)="$event.stopPropagation()">
        <div class="flex items-start justify-between gap-4 border-b border-church-border px-5 py-4">
          <div>
            <span class="font-body text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-gold">Despacho parroquial</span>
            <h3 class="mt-1 font-display text-2xl leading-tight text-burgundy">{{ selectedSection.title }}</h3>
          </div>
          <button
            type="button"
            class="flex h-10 w-10 flex-none items-center justify-center rounded-full text-2xl leading-none text-church-text-secondary transition-colors hover:bg-cream hover:text-burgundy focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Cerrar"
            (click)="closeModal()"
          >
            ×
          </button>
        </div>

        <div class="max-h-[calc(88vh-96px)] overflow-y-auto px-5 py-6 lg:px-8">
          <p *ngIf="selectedSection.intro" class="font-body text-sm leading-relaxed text-church-text-secondary">{{ selectedSection.intro }}</p>

          <div class="mt-6">
            <h4 class="font-body text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-gold">A tener en cuenta</h4>
            <ul class="mt-3 space-y-3 font-body text-sm leading-relaxed text-church-text-secondary">
              <li *ngFor="let note of selectedSection.notes" class="flex gap-3">
                <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold" aria-hidden="true"></span>
                <span>{{ note }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-6">
            <h4 class="font-body text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-gold">Requisitos</h4>
            <ul class="mt-3 space-y-3 font-body text-sm leading-relaxed text-church-text-secondary">
              <li *ngFor="let requirement of selectedSection.requirements" class="flex gap-3">
                <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-burgundy" aria-hidden="true"></span>
                <span>{{ requirement }}</span>
              </li>
            </ul>
          </div>

          <p class="mt-6 rounded-md border border-gold/30 bg-cream px-4 py-3 font-body text-sm leading-relaxed text-church-text-secondary">
            <strong class="text-burgundy">Nota:</strong> {{ selectedSection.finalNote }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class DespachoComponent implements AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChild('cardsEl') cardsEl!: ElementRef<HTMLElement>;

  selectedSection: OfficeSection | null = null;

  ngAfterViewInit(): void {
    const trigger = { trigger: this.sectionEl.nativeElement, start: 'top 80%', once: true };
    gsap.to(this.headerEl.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger });
    gsap.to(this.cardsEl.nativeElement, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 72%', once: true },
    });
  }

  officeSections: OfficeSection[] = [
    {
      title: 'Bautismo de 0 a 6 años',
      intro: 'Los bautismos en nuestra parroquia se celebran todos los domingos a las 10:00 a.m.',
      summary: 'Consulta horarios de inscripción, catequesis, ofrenda y documentos necesarios para preparar el bautismo.',
      notes: [
        'La inscripción se realiza en el despacho parroquial con la documentación completa, de lunes a viernes de 7:30 a.m. a 12:00 m. y de 1:00 p.m. a 5:00 p.m. La realiza solamente el papá o la mamá.',
        'La catequesis para padres y padrinos se realiza el sábado anterior a la fecha de bautismo, a las 5:00 p.m. en el templo.',
        'La ofrenda del Bautismo es de $50.000 y se cancela el día de la inscripción en el despacho parroquial. Esta ofrenda incluye el cirio.',
      ],
      requirements: [
        'Registro civil de nacimiento original del menor autenticado. Es el que dice en el borde derecho horizontalmente: "Original para la oficina de registro". Si nació en otro país, el registro civil debe ser apostillado.',
        'Partida de matrimonio de los padres. Si no están casados por la Iglesia, deben presentar la partida de bautismo de cada uno. Si las partidas son de esta parroquia, solo se verifica en el sistema su existencia.',
        'Partida de confirmación de cada uno de los padrinos. Deben ser mayores de 16 años y deben ser hombre y mujer.',
        'Fotocopia de las cédulas de padres y padrinos.',
      ],
      finalNote: 'En caso de presentarse algún error en alguna de las partidas, se debe corregir antes de la inscripción para evitar que la partida del bebé quede con algún error.',
    },
    {
      title: 'Sacramento del Matrimonio',
      summary: 'Revisa los tiempos de entrega, expediente matrimonial, ofrenda y documentos requeridos para la celebración.',
      notes: [
        'La documentación se presenta un mes antes del Matrimonio en el despacho parroquial, de lunes a viernes de 7:30 a.m. a 12:00 m. y de 1:00 p.m. a 5:00 p.m., para su revisión previa.',
        'Se debe solicitar la cita para realizar el expediente matrimonial. A esta cita asisten los novios con dos testigos, y allí se organiza la fecha y hora de la celebración.',
        'Si el Matrimonio se va a celebrar en otra parroquia, la documentación se debe presentar dos meses antes.',
        'La ofrenda para realizar el expediente matrimonial y la celebración es de $170.000. Se cancela el día del expediente matrimonial.',
      ],
      requirements: [
        'Partidas de Bautismo y Confirmación de los contrayentes, con expedición no mayor a 3 meses. Si corresponde a otra diócesis, debe autenticarse en la curia respectiva.',
        'Registro civil de nacimiento original con expedición no mayor a 3 meses. Si es extranjero, debe ser apostillado.',
        'Certificado del cursillo prematrimonial. Si viene de otra diócesis, debe estar avalado y autenticado por la diócesis respectiva. Información: www.pastoralfamiliarmedellin.co.',
        'Fotocopia de la cédula de los contrayentes al 150%.',
        'Una foto reciente tamaño cédula de cada uno si el Matrimonio se realiza en esta parroquia, o dos fotos si solicitan Nihil Obstat para contraer Matrimonio en otra parroquia.',
        'Certificado de soltería del contrayente que no pertenezca a esta parroquia. Se solicita en la parroquia a la que pertenece.',
        'Si los contrayentes están previamente casados por lo civil entre ellos, anexar registro civil de Matrimonio.',
        'Si alguno contrajo matrimonio civil con otra persona, debe presentar la sentencia de divorcio.',
        'Si alguno celebró previamente Matrimonio Católico declarado nulo por un tribunal eclesiástico, presentar sentencia de nulidad si esta no aparece como nota marginal en la partida de Bautismo.',
        'Si tienen hijos entre los contrayentes, presentar la partida de Bautismo o, si no están bautizados, registro civil de nacimiento original autenticado.',
        'Si uno de los futuros contrayentes es viudo, debe anexar la partida eclesiástica de defunción del cónyuge anterior.',
        'Fotocopia de cédula de los testigos del expediente y del Matrimonio al 150%.',
      ],
      finalNote: 'En caso de presentarse algún error en alguna de las partidas, se debe corregir antes de realizar el expediente matrimonial.',
    },
  ];

  openModal(section: OfficeSection) {
    this.selectedSection = section;
  }

  closeModal() {
    this.selectedSection = null;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeModal();
  }
}
