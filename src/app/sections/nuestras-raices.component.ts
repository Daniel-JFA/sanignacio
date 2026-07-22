import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DataService, Milestone } from '../services/data.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-nuestras-raices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="raices" class="py-16 lg:py-24" style="background: #F0EBE3" #sectionEl>
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div #headerEl style="opacity: 0; transform: translateY(30px)">
          <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">NUESTRAS RAÍCES</span>
          <h2 class="mt-3 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">Un templo que ha visto cambiar la ciudad</h2>
          <p class="mt-3 max-w-lg font-body text-[0.9375rem] leading-relaxed text-church-text-secondary">
            Testigo de siglos de fe, conflictos, transformaciones y esperanza, la historia de San Ignacio es también la historia de Medellín.
          </p>
          <a href="#historias" class="mt-4 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors hover:text-gold">
            CONOCE MÁS NUESTRA HISTORIA &rarr;
          </a>
        </div>

        <div class="relative mt-12">
          <div #lineEl class="absolute left-0 right-0 top-[60px] hidden h-0.5 origin-left bg-gold lg:block" style="transform: scaleX(0)"></div>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div *ngFor="let milestone of milestones" #milestoneEl class="text-center" style="opacity: 0; transform: translateY(40px)">
              <div class="mx-auto mb-4 h-[80px] w-[100px] overflow-hidden rounded-lg">
                <img [src]="milestone.img" [alt]="milestone.title" class="h-full w-full object-cover" />
              </div>
              <div class="font-display text-xl text-burgundy">{{ milestone.year }}</div>
              <div class="mt-1 font-body text-sm font-semibold text-church-text">{{ milestone.title }}</div>
              <p class="mt-2 font-body text-xs leading-relaxed text-church-text-secondary">{{ milestone.desc_text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NuestrasRaicesComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChild('lineEl') lineEl!: ElementRef<HTMLElement>;
  @ViewChildren('milestoneEl') milestoneEls!: QueryList<ElementRef<HTMLElement>>;

  milestones: Milestone[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getMilestones().subscribe({
      next: (data) => (this.milestones = data),
      error: (err) => console.error('Error loading milestones:', err),
    });
  }

  ngAfterViewInit(): void {
    const trigger = { trigger: this.sectionEl.nativeElement, start: 'top 80%', once: true };

    gsap.to(this.headerEl.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger });

    gsap.to(this.lineEl.nativeElement, {
      scaleX: 1, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 70%', once: true },
    });

    // Milestones animate after ngFor renders
    this.milestoneEls.changes.subscribe(() => this.animateMilestones());
    this.animateMilestones();
  }

  private animateMilestones(): void {
    const els = this.milestoneEls.map(r => r.nativeElement);
    if (!els.length) return;
    gsap.to(els, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 70%', once: true },
    });
  }
}
