import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DataService, Story } from '../services/data.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-el-padre-cuenta',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .modal-backdrop { animation: fadeIn 0.25s ease; }
    .modal-panel { animation: slideUp 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
  `],
  template: `
    <section id="historias" class="bg-cream py-16 lg:py-24" #sectionEl>
      <div class="mx-auto px-5 lg:px-10" style="max-width: 1200px">
        <div #headerEl style="opacity: 0; transform: translateY(30px)">
          <span class="font-body text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-gold">EL PADRE CUENTA</span>
          <h2 class="mt-3 font-display text-church-text" style="font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.2">
            Historias de fe, memoria y espiritualidad
          </h2>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <button *ngFor="let story of stories" #cardEl (click)="openStory(story)"
             class="group overflow-hidden rounded-lg border border-church-border bg-white shadow-card transition-all duration-300 hover:shadow-card-hover text-left"
             style="opacity: 0; transform: translateY(40px)">
            <div class="relative overflow-hidden" style="aspect-ratio: 16/10">
              <img [src]="story.img" [alt]="story.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <span class="absolute left-3 top-3 rounded-full px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-white" [style.background]="story.badge_color || '#7A1F1F'">
                {{ story.badge }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-display text-[1.15rem] font-medium leading-tight text-church-text">{{ story.title }}</h3>
              <p class="mt-2 font-body text-sm leading-relaxed text-church-text-secondary">{{ story.desc_text }}</p>
              <span class="mt-4 inline-block font-body text-[0.7rem] font-semibold uppercase tracking-wider text-burgundy transition-colors group-hover:text-gold">
                LEER HISTORIA &rarr;
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Story modal -->
    <div *ngIf="activeStory" class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(26,20,16,0.75)" (click)="closeStory()">
      <div class="modal-panel relative w-full overflow-hidden rounded-xl bg-white shadow-2xl" style="max-width: 680px; max-height: 90vh; overflow-y: auto" (click)="$event.stopPropagation()">
        <div class="relative overflow-hidden" style="aspect-ratio: 16/9">
          <img [src]="activeStory.img" [alt]="activeStory.title" class="h-full w-full object-cover" />
          <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(26,20,16,0.6) 0%, transparent 50%)"></div>
          <span class="absolute left-4 bottom-4 rounded-full px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-white" [style.background]="activeStory.badge_color || '#7A1F1F'">
            {{ activeStory.badge }}
          </span>
        </div>
        <div class="p-6 lg:p-8">
          <h2 class="font-display text-[1.5rem] font-medium leading-tight text-church-text">{{ activeStory.title }}</h2>
          <p class="mt-4 font-body text-[0.9375rem] leading-relaxed text-church-text-secondary whitespace-pre-line">{{ activeStory.content || activeStory.desc_text }}</p>
        </div>
        <button (click)="closeStory()" class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-church-text transition-colors hover:bg-white" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  `,
})
export class ElPadreCuentaComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef<HTMLElement>>;

  stories: Story[] = [];
  activeStory: Story | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getStories().subscribe({
      next: (data) => (this.stories = data),
      error: (err) => console.error('Error loading stories:', err),
    });
  }

  ngAfterViewInit(): void {
    const trigger = { trigger: this.sectionEl.nativeElement, start: 'top 80%', once: true };
    gsap.to(this.headerEl.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger });
    this.cardEls.changes.subscribe(() => this.animateCards());
    this.animateCards();
  }

  private animateCards(): void {
    const els = this.cardEls.map(r => r.nativeElement);
    if (!els.length) return;
    gsap.to(els, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: this.sectionEl.nativeElement, start: 'top 75%', once: true },
    });
  }

  openStory(story: Story): void {
    this.activeStory = story;
    document.body.style.overflow = 'hidden';
  }

  closeStory(): void {
    this.activeStory = null;
    document.body.style.overflow = '';
  }
}
