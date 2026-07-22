import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, Story, Milestone, GalleryItem, User, SiteEvent, SiteConfig } from '../services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="min-h-screen bg-cream font-body text-church-text">
      <!-- Header -->
      <header class="bg-burgundy text-white px-5 py-4 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button (click)="goBack.emit()" class="text-white hover:text-gold transition-colors flex items-center gap-1 font-semibold text-sm">
            <span>←</span> Volver al sitio
          </button>
          <span class="text-gold/50">|</span>
          <h1 class="font-display text-xl lg:text-2xl text-gold m-0">Panel de Administración</h1>
        </div>
        <div *ngIf="isLoggedIn" class="flex items-center gap-4">
          <span class="text-xs text-cream-dark">Sesión: <strong>{{ adminUser }}</strong></span>
          <button (click)="logout()" class="bg-burgundy-dark hover:bg-black/30 border border-white/20 px-3 py-1.5 rounded text-xs font-semibold tracking-wide text-white transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-4 py-8">
        <!-- Login Screen -->
        <div *ngIf="!isLoggedIn" class="max-w-md mx-auto bg-white border border-church-border rounded-lg shadow-card p-6 lg:p-8 mt-12">
          <h2 class="font-display text-2xl text-burgundy text-center mb-2">Ingreso Administrativo</h2>
          <p class="text-center text-xs text-church-text-secondary mb-6">Gestiona las historias, hitos e imágenes del sitio web</p>

          <form (ngSubmit)="login()">
            <div class="mb-4">
              <label for="username" class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Usuario</label>
              <input
                id="username"
                type="text"
                name="username"
                [(ngModel)]="loginForm.username"
                class="w-full px-3 py-2 border border-church-border rounded bg-cream focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                required
              />
            </div>
            <div class="mb-6">
              <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                [(ngModel)]="loginForm.password"
                class="w-full px-3 py-2 border border-church-border rounded bg-cream focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                required
              />
            </div>
            <div *ngIf="loginError" class="mb-4 text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
              {{ loginError }}
            </div>
            <button
              type="submit"
              class="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-2.5 rounded transition-colors text-sm"
              [disabled]="loading"
            >
              {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
            </button>
          </form>
        </div>

        <!-- Admin Dashboard -->
        <div *ngIf="isLoggedIn">
          <!-- Navigation Tabs -->
          <div class="flex border-b border-church-border mb-6 flex-wrap">
            <ng-container *ngFor="let tab of tabs">
              <button
                *ngIf="(tab.id !== 'users' && tab.id !== 'config') || userRole === 'super_admin'"
                (click)="activeTab = tab.id"
                class="px-5 py-3 font-display text-base transition-colors border-b-2"
                [class.border-burgundy]="activeTab === tab.id"
                [class.text-burgundy]="activeTab === tab.id"
                [class.font-semibold]="activeTab === tab.id"
                [class.border-transparent]="activeTab !== tab.id"
                [class.text-church-text-secondary]="activeTab !== tab.id"
              >
                {{ tab.name }}
              </button>
            </ng-container>
          </div>

          <!-- Notification Toast -->
          <div *ngIf="message" class="mb-6 p-4 rounded text-sm flex justify-between items-center" [class]="message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
            <span>{{ message.text }}</span>
            <button (click)="message = null" class="text-xs font-bold font-mono">×</button>
          </div>

          <!-- TAB CONTENT: STORIES -->
          <div *ngIf="activeTab === 'stories'" class="bg-white border border-church-border rounded-lg p-6 shadow-card">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-display text-xl text-burgundy">Historias ("El Padre Cuenta")</h3>
              <button (click)="openStoryModal()" class="bg-gold hover:bg-gold-light text-church-text font-semibold px-4 py-2 rounded text-xs transition-colors">
                + Nueva Historia
              </button>
            </div>

            <!-- Stories List -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-church-border bg-cream text-xs uppercase tracking-wider text-gold font-semibold">
                    <th class="p-3">Imagen</th>
                    <th class="p-3">Categoría</th>
                    <th class="p-3">Título</th>
                    <th class="p-3">Descripción</th>
                    <th class="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of stories" class="border-b border-church-border hover:bg-cream-dark/30">
                    <td class="p-3">
                      <img [src]="item.img" class="h-10 w-16 object-cover rounded" alt="Thumbnail" />
                    </td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[0.6rem] font-bold text-white uppercase" [style.background]="item.badge_color">
                        {{ item.badge }}
                      </span>
                    </td>
                    <td class="p-3 font-semibold text-church-text">{{ item.title }}</td>
                    <td class="p-3 text-xs text-church-text-secondary truncate max-w-xs">{{ item.desc_text }}</td>
                    <td class="p-3 text-right space-x-2">
                      <button (click)="openStoryModal(item)" class="text-burgundy hover:underline text-xs">Editar</button>
                      <button (click)="deleteStory(item.id!)" class="text-red-600 hover:underline text-xs">Eliminar</button>
                    </td>
                  </tr>
                  <tr *ngIf="stories.length === 0">
                    <td colspan="5" class="p-6 text-center text-church-text-secondary">No hay historias registradas.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB CONTENT: MILESTONES -->
          <div *ngIf="activeTab === 'milestones'" class="bg-white border border-church-border rounded-lg p-6 shadow-card">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-display text-xl text-burgundy">Hitos de la Historia ("Nuestras Raíces")</h3>
              <button (click)="openMilestoneModal()" class="bg-gold hover:bg-gold-light text-church-text font-semibold px-4 py-2 rounded text-xs transition-colors">
                + Nuevo Hito
              </button>
            </div>

            <!-- Milestones List -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-church-border bg-cream text-xs uppercase tracking-wider text-gold font-semibold">
                    <th class="p-3">Imagen</th>
                    <th class="p-3">Año</th>
                    <th class="p-3">Título</th>
                    <th class="p-3">Descripción</th>
                    <th class="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of milestones" class="border-b border-church-border hover:bg-cream-dark/30">
                    <td class="p-3">
                      <img [src]="item.img" class="h-10 w-16 object-cover rounded" alt="Thumbnail" />
                    </td>
                    <td class="p-3 font-semibold text-burgundy">{{ item.year }}</td>
                    <td class="p-3 font-semibold text-church-text">{{ item.title }}</td>
                    <td class="p-3 text-xs text-church-text-secondary truncate max-w-xs">{{ item.desc_text }}</td>
                    <td class="p-3 text-right space-x-2">
                      <button (click)="openMilestoneModal(item)" class="text-burgundy hover:underline text-xs">Editar</button>
                      <button (click)="deleteMilestone(item.id!)" class="text-red-600 hover:underline text-xs">Eliminar</button>
                    </td>
                  </tr>
                  <tr *ngIf="milestones.length === 0">
                    <td colspan="5" class="p-6 text-center text-church-text-secondary">No hay hitos registrados.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB CONTENT: GALLERY -->
          <div *ngIf="activeTab === 'gallery'" class="bg-white border border-church-border rounded-lg p-6 shadow-card">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-display text-xl text-burgundy">Galería y Memoria Visual</h3>
              <button (click)="openGalleryModal()" class="bg-gold hover:bg-gold-light text-church-text font-semibold px-4 py-2 rounded text-xs transition-colors">
                + Agregar a Galería
              </button>
            </div>

            <!-- Gallery Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div *ngFor="let item of gallery" class="relative group border border-church-border rounded-lg overflow-hidden bg-cream shadow-sm">
                <img [src]="item.img" class="w-full aspect-square object-cover" [alt]="item.alt" />
                <div class="p-3 bg-white border-t border-church-border flex items-center justify-between">
                  <span class="text-xs text-church-text-secondary truncate pr-2" [title]="item.alt">{{ item.alt }}</span>
                  <button (click)="deleteGalleryItem(item.id!)" class="text-red-600 hover:text-red-800 text-xs font-semibold shrink-0">
                    Eliminar
                  </button>
                </div>
              </div>
              <div *ngIf="gallery.length === 0" class="col-span-full py-12 text-center text-church-text-secondary">
                No hay fotos en la galería.
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: AGENDA -->
          <div *ngIf="activeTab === 'agenda'" class="bg-white border border-church-border rounded-lg p-6 shadow-card">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-display text-xl text-burgundy">Agenda Cultural y Espiritual</h3>
              <button (click)="openEventModal()" class="bg-gold hover:bg-gold-light text-church-text font-semibold px-4 py-2 rounded text-xs transition-colors">
                + Nuevo Evento
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-church-border bg-cream text-xs uppercase tracking-wider text-gold font-semibold">
                    <th class="p-3">Imagen</th>
                    <th class="p-3">Fecha</th>
                    <th class="p-3">Hora</th>
                    <th class="p-3">Título</th>
                    <th class="p-3 text-center">Activo</th>
                    <th class="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of events_admin" class="border-b border-church-border hover:bg-cream-dark/30">
                    <td class="p-3"><img [src]="item.img" class="h-10 w-16 object-cover rounded" alt="Thumbnail" /></td>
                    <td class="p-3 font-semibold text-burgundy text-xs">{{ item.day_name }} {{ item.day }} {{ item.month }}</td>
                    <td class="p-3 text-xs text-church-text-secondary">{{ item.time }}</td>
                    <td class="p-3 font-semibold text-church-text">{{ item.title }}</td>
                    <td class="p-3 text-center">
                      <button (click)="toggleEventActive(item)"
                        class="w-10 h-5 rounded-full transition-colors relative"
                        [class.bg-gold]="item.active"
                        [class.bg-church-border]="!item.active"
                        [title]="item.active ? 'Visible en el sitio' : 'Oculto del sitio'">
                        <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                          [class.left-5]="item.active"
                          [class.left-0.5]="!item.active"></span>
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-2">
                      <button (click)="openEventModal(item)" class="text-burgundy hover:underline text-xs">Editar</button>
                      <button (click)="deleteEvent(item.id!)" class="text-red-600 hover:underline text-xs">Eliminar</button>
                    </td>
                  </tr>
                  <tr *ngIf="events_admin.length === 0">
                    <td colspan="6" class="p-6 text-center text-church-text-secondary">No hay eventos registrados.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB CONTENT: CONFIGURACIÓN (super_admin only) -->
          <div *ngIf="activeTab === 'config' && userRole === 'super_admin'" class="bg-white border border-church-border rounded-lg p-6 shadow-card">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-display text-xl text-burgundy">Configuración del Sitio</h3>
              <button (click)="saveSiteConfig()" class="bg-burgundy hover:bg-burgundy-dark text-white font-semibold px-4 py-2 rounded text-xs transition-colors" [disabled]="configSaving">
                {{ configSaving ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Dirección</label>
                <textarea [(ngModel)]="siteConfig['address']" rows="3" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm"></textarea>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Horario semana</label>
                <input type="text" [(ngModel)]="siteConfig['schedule_weekdays']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Horario domingos</label>
                <input type="text" [(ngModel)]="siteConfig['schedule_sundays']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Teléfono</label>
                <input type="text" [(ngModel)]="siteConfig['phone']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Correo electrónico</label>
                <input type="email" [(ngModel)]="siteConfig['email']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Facebook URL</label>
                <input type="url" [(ngModel)]="siteConfig['facebook_url']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Instagram URL</label>
                <input type="url" [(ngModel)]="siteConfig['instagram_url']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">YouTube URL</label>
                <input type="url" [(ngModel)]="siteConfig['youtube_url']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Google Maps Embed URL</label>
                <input type="text" [(ngModel)]="siteConfig['maps_embed_url']" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: USUARIOS (super_admin only) -->
          <div *ngIf="activeTab === 'users' && userRole === 'super_admin'" class="bg-white border border-church-border rounded-lg p-6 shadow-card">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-display text-xl text-burgundy">Gestión de Usuarios</h3>
              <button (click)="openUserModal()" class="bg-gold hover:bg-gold-light text-church-text font-semibold px-4 py-2 rounded text-xs transition-colors">
                + Nuevo Usuario
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-church-border bg-cream text-xs uppercase tracking-wider text-gold font-semibold">
                    <th class="p-3">Usuario</th>
                    <th class="p-3">Rol</th>
                    <th class="p-3">Creado</th>
                    <th class="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of users" class="border-b border-church-border hover:bg-cream-dark/30">
                    <td class="p-3 font-semibold text-church-text">{{ u.username }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[0.6rem] font-bold text-white uppercase"
                        [class.bg-burgundy]="u.role === 'super_admin'"
                        [class.bg-gold]="u.role !== 'super_admin'">
                        {{ u.role === 'super_admin' ? 'Super Admin' : 'Editor' }}
                      </span>
                    </td>
                    <td class="p-3 text-xs text-church-text-secondary">{{ u.created_at | date:'dd/MM/yyyy' }}</td>
                    <td class="p-3 text-right space-x-2">
                      <button (click)="openUserModal(u)" class="text-burgundy hover:underline text-xs">Editar</button>
                      <button (click)="deleteUser(u.id!)" [disabled]="u.username === adminUser" class="text-red-600 hover:underline text-xs disabled:opacity-30">Eliminar</button>
                    </td>
                  </tr>
                  <tr *ngIf="users.length === 0">
                    <td colspan="4" class="p-6 text-center text-church-text-secondary">No hay usuarios registrados.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <!-- STORY MODAL -->
      <div *ngIf="storyModal.show" class="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4">
        <div class="bg-white rounded-lg border border-church-border shadow-card max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-burgundy text-white px-5 py-4 flex items-center justify-between">
            <h4 class="font-display text-lg text-gold">{{ storyModal.isEdit ? 'Editar Historia' : 'Nueva Historia' }}</h4>
            <button (click)="closeStoryModal()" class="text-white hover:text-gold text-2xl font-mono leading-none">&times;</button>
          </div>
          <form (ngSubmit)="saveStory()" class="p-5 overflow-y-auto space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Título</label>
              <input type="text" name="title" [(ngModel)]="storyModal.data.title" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Etiqueta (Badge)</label>
                <input type="text" name="badge" [(ngModel)]="storyModal.data.badge" placeholder="HISTORIA, REFLEXION, etc" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Color Etiqueta</label>
                <select name="badge_color" [(ngModel)]="storyModal.data.badge_color" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm">
                  <option value="#7A1F1F">Rojo San Ignacio</option>
                  <option value="#5A1515">Rojo Oscuro</option>
                  <option value="#C9A84C">Oro</option>
                  <option value="#5C5147">Marrón</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Descripción corta <span class="text-church-text-muted normal-case font-normal">(aparece en la tarjeta)</span></label>
              <textarea name="desc_text" [(ngModel)]="storyModal.data.desc_text" rows="3" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Texto completo <span class="text-church-text-muted normal-case font-normal">(aparece en el modal al leer)</span></label>
              <textarea name="content" [(ngModel)]="storyModal.data.content" rows="6" placeholder="Escribe aquí el texto completo de la historia..." class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Imagen</label>
              <div class="flex gap-2 mb-2">
                <input type="text" name="img" [(ngModel)]="storyModal.data.img" placeholder="/images/story-cuartel.jpg o sube un archivo" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
                <button type="button" (click)="storyFile.click()" class="bg-church-border hover:bg-cream-dark px-3 py-2 text-xs font-semibold rounded shrink-0">Subir</button>
              </div>
              <input #storyFile type="file" (change)="onFileUpload($event, 'story')" class="hidden" accept="image/*" />
              <img *ngIf="storyModal.data.img" [src]="storyModal.data.img" class="h-20 w-32 object-cover rounded mt-2 border border-church-border" alt="Preview" />
            </div>
            <div class="pt-4 border-t border-church-border flex justify-end gap-3">
              <button type="button" (click)="closeStoryModal()" class="px-4 py-2 border border-church-border rounded text-xs font-semibold hover:bg-cream transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded text-xs font-semibold transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MILESTONE MODAL -->
      <div *ngIf="milestoneModal.show" class="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4">
        <div class="bg-white rounded-lg border border-church-border shadow-card max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-burgundy text-white px-5 py-4 flex items-center justify-between">
            <h4 class="font-display text-lg text-gold">{{ milestoneModal.isEdit ? 'Editar Hito' : 'Nuevo Hito' }}</h4>
            <button (click)="closeMilestoneModal()" class="text-white hover:text-gold text-2xl font-mono leading-none">&times;</button>
          </div>
          <form (ngSubmit)="saveMilestone()" class="p-5 overflow-y-auto space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Año</label>
                <input type="text" name="year" [(ngModel)]="milestoneModal.data.year" placeholder="1803" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Título</label>
                <input type="text" name="title" [(ngModel)]="milestoneModal.data.title" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Descripción</label>
              <textarea name="desc_text" [(ngModel)]="milestoneModal.data.desc_text" rows="4" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Imagen</label>
              <div class="flex gap-2 mb-2">
                <input type="text" name="img" [(ngModel)]="milestoneModal.data.img" placeholder="/images/story-cuartel.jpg o sube un archivo" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
                <button type="button" (click)="milestoneFile.click()" class="bg-church-border hover:bg-cream-dark px-3 py-2 text-xs font-semibold rounded shrink-0">Subir</button>
              </div>
              <input #milestoneFile type="file" (change)="onFileUpload($event, 'milestone')" class="hidden" accept="image/*" />
              <img *ngIf="milestoneModal.data.img" [src]="milestoneModal.data.img" class="h-20 w-32 object-cover rounded mt-2 border border-church-border" alt="Preview" />
            </div>
            <div class="pt-4 border-t border-church-border flex justify-end gap-3">
              <button type="button" (click)="closeMilestoneModal()" class="px-4 py-2 border border-church-border rounded text-xs font-semibold hover:bg-cream transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded text-xs font-semibold transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- GALLERY MODAL -->
      <div *ngIf="galleryModal.show" class="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4">
        <div class="bg-white rounded-lg border border-church-border shadow-card max-w-md w-full overflow-hidden">
          <div class="bg-burgundy text-white px-5 py-4 flex items-center justify-between">
            <h4 class="font-display text-lg text-gold">Agregar a Galería</h4>
            <button (click)="closeGalleryModal()" class="text-white hover:text-gold text-2xl font-mono leading-none">&times;</button>
          </div>
          <form (ngSubmit)="saveGallery()" class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Texto alternativo (Alt)</label>
              <input type="text" name="alt" [(ngModel)]="galleryModal.data.alt" placeholder="Ej: Fachada al atardecer" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Imagen</label>
              <div class="flex gap-2 mb-2">
                <input type="text" name="img" [(ngModel)]="galleryModal.data.img" placeholder="/images/gallery-1.jpg o sube un archivo" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
                <button type="button" (click)="galleryFile.click()" class="bg-church-border hover:bg-cream-dark px-3 py-2 text-xs font-semibold rounded shrink-0">Subir</button>
              </div>
              <input #galleryFile type="file" (change)="onFileUpload($event, 'gallery')" class="hidden" accept="image/*" />
              <img *ngIf="galleryModal.data.img" [src]="galleryModal.data.img" class="h-24 w-full object-cover rounded mt-2 border border-church-border" alt="Preview" />
            </div>
            <div class="pt-4 border-t border-church-border flex justify-end gap-3">
              <button type="button" (click)="closeGalleryModal()" class="px-4 py-2 border border-church-border rounded text-xs font-semibold hover:bg-cream transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded text-xs font-semibold transition-colors">Agregar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- EVENT MODAL -->
      <div *ngIf="eventModal.show" class="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4">
        <div class="bg-white rounded-lg border border-church-border shadow-card max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-burgundy text-white px-5 py-4 flex items-center justify-between">
            <h4 class="font-display text-lg text-gold">{{ eventModal.isEdit ? 'Editar Evento' : 'Nuevo Evento' }}</h4>
            <button (click)="closeEventModal()" class="text-white hover:text-gold text-2xl font-mono leading-none">&times;</button>
          </div>
          <form (ngSubmit)="saveEvent()" class="p-5 overflow-y-auto space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Día (nombre)</label>
                <input type="text" name="day_name" [(ngModel)]="eventModal.data.day_name" placeholder="SÁB" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Día (número)</label>
                <input type="text" name="day" [(ngModel)]="eventModal.data.day" placeholder="25" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Mes</label>
                <input type="text" name="month" [(ngModel)]="eventModal.data.month" placeholder="MAY" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Hora</label>
              <input type="text" name="time" [(ngModel)]="eventModal.data.time" placeholder="10:00 A.M." class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Título</label>
              <input type="text" name="title" [(ngModel)]="eventModal.data.title" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Descripción</label>
              <textarea name="description" [(ngModel)]="eventModal.data.description" rows="3" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Imagen</label>
              <div class="flex gap-2 mb-2">
                <input type="text" name="img" [(ngModel)]="eventModal.data.img" placeholder="/images/agenda-misa.jpg" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
                <button type="button" (click)="eventFile.click()" class="bg-church-border hover:bg-cream-dark px-3 py-2 text-xs font-semibold rounded shrink-0">Subir</button>
              </div>
              <input #eventFile type="file" (change)="onFileUpload($event, 'event')" class="hidden" accept="image/*" />
              <img *ngIf="eventModal.data.img" [src]="eventModal.data.img" class="h-20 w-32 object-cover rounded mt-2 border border-church-border" alt="Preview" />
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="eventActive" [(ngModel)]="eventModal.data.active" name="active" class="w-4 h-4 accent-burgundy" />
              <label for="eventActive" class="text-sm text-church-text">Visible en el sitio</label>
            </div>
            <div class="pt-4 border-t border-church-border flex justify-end gap-3">
              <button type="button" (click)="closeEventModal()" class="px-4 py-2 border border-church-border rounded text-xs font-semibold hover:bg-cream transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded text-xs font-semibold transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- USER MODAL -->
      <div *ngIf="userModal.show" class="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4">
        <div class="bg-white rounded-lg border border-church-border shadow-card max-w-md w-full overflow-hidden">
          <div class="bg-burgundy text-white px-5 py-4 flex items-center justify-between">
            <h4 class="font-display text-lg text-gold">{{ userModal.isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h4>
            <button (click)="closeUserModal()" class="text-white hover:text-gold text-2xl font-mono leading-none">&times;</button>
          </div>
          <form (ngSubmit)="saveUser()" class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Nombre de usuario</label>
              <input type="text" name="username" [(ngModel)]="userModal.data.username" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Contraseña</label>
              <input type="password" name="password" [(ngModel)]="userModal.data.password"
                [required]="!userModal.isEdit"
                [placeholder]="userModal.isEdit ? 'Dejar vacío para no cambiar' : ''"
                class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gold mb-1">Rol</label>
              <select name="role" [(ngModel)]="userModal.data.role" class="w-full px-3 py-2 border border-church-border rounded bg-cream text-sm">
                <option value="editor">Editor</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div class="pt-4 border-t border-church-border flex justify-end gap-3">
              <button type="button" (click)="closeUserModal()" class="px-4 py-2 border border-church-border rounded text-xs font-semibold hover:bg-cream transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded text-xs font-semibold transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminComponent implements OnInit {
  @Output() goBack = new EventEmitter<void>();

  isLoggedIn = false;
  adminUser = '';
  loading = false;
  activeTab = 'stories';
  loginError = '';
  userRole = '';

  tabs = [
    { id: 'stories',    name: 'Historias' },
    { id: 'milestones', name: 'Nuestras Raíces' },
    { id: 'gallery',    name: 'Galería Visual' },
    { id: 'agenda',     name: 'Agenda Cultural' },
    { id: 'config',     name: 'Configuración' },
    { id: 'users',      name: 'Usuarios' },
  ];

  loginForm = {
    username: '',
    password: ''
  };

  message: { text: string; type: 'success' | 'error' } | null = null;

  stories: Story[] = [];
  milestones: Milestone[] = [];
  gallery: GalleryItem[] = [];

  // Events
  events_admin: SiteEvent[] = [];
  eventModal = {
    show: false,
    isEdit: false,
    data: { id: undefined, day_name: 'SÁB', day: '', month: 'ENE', time: '', title: '', description: '', img: '', active: true } as SiteEvent
  };

  // Users
  users: User[] = [];
  userModal = {
    show: false,
    isEdit: false,
    data: { id: undefined as number | undefined, username: '', password: '', role: 'editor' }
  };

  // Site config
  siteConfig: SiteConfig = {};
  configSaving = false;

  // Modals state
  storyModal = {
    show: false,
    isEdit: false,
    data: { id: undefined, badge: '', badge_color: '#7A1F1F', title: '', desc_text: '', content: '', img: '' } as Story
  };

  milestoneModal = {
    show: false,
    isEdit: false,
    data: { id: undefined, year: '', title: '', desc_text: '', img: '' } as Milestone
  };

  galleryModal = {
    show: false,
    data: { img: '', alt: '' } as GalleryItem
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.userRole = this.dataService.getUserRole();
    this.dataService.getLoginStatus().subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.adminUser = localStorage.getItem('admin_user') || 'Admin';
        this.userRole = this.dataService.getUserRole();
        this.loadDashboardData();
      }
    });
  }

  login(): void {
    if (!this.loginForm.username || !this.loginForm.password) return;
    this.loading = true;
    this.loginError = '';

    this.dataService.login(this.loginForm.username, this.loginForm.password).subscribe({
      next: () => {
        this.loading = false;
        this.loginForm = { username: '', password: '' };
        this.userRole = this.dataService.getUserRole();
        this.loadDashboardData();
      },
      error: (err) => {
        this.loading = false;
        this.loginError = err.error?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }

  logout(): void {
    this.dataService.logout();
    this.isLoggedIn = false;
    this.userRole = '';
  }

  loadDashboardData(): void {
    this.dataService.getStories().subscribe((data) => (this.stories = data));
    this.dataService.getMilestones().subscribe((data) => (this.milestones = data));
    this.dataService.getGallery().subscribe((data) => (this.gallery = data));
    this.loadEvents();
    this.loadSiteConfig();
    if (this.userRole === 'super_admin') { this.loadUsers(); }
  }

  showToast(text: string, type: 'success' | 'error' = 'success'): void {
    this.message = { text, type };
    setTimeout(() => {
      if (this.message?.text === text) {
        this.message = null;
      }
    }, 5000);
  }

  // UPLOAD HANDLER
  onFileUpload(event: Event, type: 'story' | 'milestone' | 'gallery' | 'event'): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.dataService.uploadImage(file).subscribe({
        next: (res) => {
          const fileUrl = res.fileUrl;
          if (type === 'story') {
            this.storyModal.data.img = this.dataService.baseUrl + fileUrl;
          } else if (type === 'milestone') {
            this.milestoneModal.data.img = this.dataService.baseUrl + fileUrl;
          } else if (type === 'gallery') {
            this.galleryModal.data.img = this.dataService.baseUrl + fileUrl;
          } else if (type === 'event') {
            this.eventModal.data.img = this.dataService.baseUrl + fileUrl;
          }
          this.showToast('Imagen subida con éxito.');
        },
        error: (err) => {
          this.showToast(err.error?.error || 'Error al subir la imagen.', 'error');
        }
      });
    }
  }

  // --- STORY ACTIONS ---
  openStoryModal(story?: Story): void {
    if (story) {
      this.storyModal.show = true;
      this.storyModal.isEdit = true;
      this.storyModal.data = { ...story };
    } else {
      this.storyModal.show = true;
      this.storyModal.isEdit = false;
      this.storyModal.data = { id: undefined, badge: 'HISTORIA', badge_color: '#7A1F1F', title: '', desc_text: '', content: '', img: '' };
    }
  }

  closeStoryModal(): void {
    this.storyModal.show = false;
  }

  saveStory(): void {
    const story = this.storyModal.data;
    if (this.storyModal.isEdit) {
      this.dataService.updateStory(story.id!, story).subscribe({
        next: () => {
          this.showToast('Historia actualizada.');
          this.closeStoryModal();
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al actualizar la historia.', 'error')
      });
    } else {
      this.dataService.addStory(story).subscribe({
        next: () => {
          this.showToast('Historia creada con éxito.');
          this.closeStoryModal();
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al crear la historia.', 'error')
      });
    }
  }

  deleteStory(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta historia?')) {
      this.dataService.deleteStory(id).subscribe({
        next: () => {
          this.showToast('Historia eliminada.');
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al eliminar la historia.', 'error')
      });
    }
  }

  // --- MILESTONE ACTIONS ---
  openMilestoneModal(milestone?: Milestone): void {
    if (milestone) {
      this.milestoneModal.show = true;
      this.milestoneModal.isEdit = true;
      this.milestoneModal.data = { ...milestone };
    } else {
      this.milestoneModal.show = true;
      this.milestoneModal.isEdit = false;
      this.milestoneModal.data = { id: undefined, year: '', title: '', desc_text: '', img: '' };
    }
  }

  closeMilestoneModal(): void {
    this.milestoneModal.show = false;
  }

  saveMilestone(): void {
    const milestone = this.milestoneModal.data;
    if (this.milestoneModal.isEdit) {
      this.dataService.updateMilestone(milestone.id!, milestone).subscribe({
        next: () => {
          this.showToast('Hito de historia actualizado.');
          this.closeMilestoneModal();
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al actualizar el hito.', 'error')
      });
    } else {
      this.dataService.addMilestone(milestone).subscribe({
        next: () => {
          this.showToast('Hito de historia creado.');
          this.closeMilestoneModal();
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al crear el hito.', 'error')
      });
    }
  }

  deleteMilestone(id: number): void {
    if (confirm('¿Estás seguro de eliminar este hito?')) {
      this.dataService.deleteMilestone(id).subscribe({
        next: () => {
          this.showToast('Hito de historia eliminado.');
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al eliminar el hito.', 'error')
      });
    }
  }

  // --- GALLERY ACTIONS ---
  openGalleryModal(): void {
    this.galleryModal.show = true;
    this.galleryModal.data = { img: '', alt: '' };
  }

  closeGalleryModal(): void {
    this.galleryModal.show = false;
  }

  saveGallery(): void {
    const item = this.galleryModal.data;
    this.dataService.addGalleryItem(item).subscribe({
      next: () => {
        this.showToast('Foto agregada a la galería.');
        this.closeGalleryModal();
        this.loadDashboardData();
      },
      error: () => this.showToast('Error al agregar a la galería.', 'error')
    });
  }

  deleteGalleryItem(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta foto?')) {
      this.dataService.deleteGalleryItem(id).subscribe({
        next: () => {
          this.showToast('Foto eliminada de la galería.');
          this.loadDashboardData();
        },
        error: () => this.showToast('Error al eliminar de la galería.', 'error')
      });
    }
  }

  // --- EVENTS ACTIONS ---
  loadEvents(): void {
    this.dataService.getEventsAll().subscribe(data => this.events_admin = data);
  }

  openEventModal(event?: SiteEvent): void {
    if (event) {
      this.eventModal = { show: true, isEdit: true, data: { ...event } };
    } else {
      this.eventModal = { show: true, isEdit: false, data: { id: undefined, day_name: 'SÁB', day: '', month: 'ENE', time: '', title: '', description: '', img: '', active: true } };
    }
  }

  closeEventModal(): void { this.eventModal.show = false; }

  saveEvent(): void {
    const e = this.eventModal.data;
    if (this.eventModal.isEdit) {
      this.dataService.updateEvent(e.id!, e).subscribe({
        next: () => { this.showToast('Evento actualizado.'); this.closeEventModal(); this.loadEvents(); },
        error: () => this.showToast('Error al actualizar el evento.', 'error')
      });
    } else {
      this.dataService.addEvent(e).subscribe({
        next: () => { this.showToast('Evento creado.'); this.closeEventModal(); this.loadEvents(); },
        error: () => this.showToast('Error al crear el evento.', 'error')
      });
    }
  }

  toggleEventActive(event: SiteEvent): void {
    this.dataService.updateEvent(event.id!, { active: !event.active }).subscribe({
      next: () => { this.loadEvents(); },
      error: () => this.showToast('Error al cambiar estado.', 'error')
    });
  }

  deleteEvent(id: number): void {
    if (confirm('¿Eliminar este evento?')) {
      this.dataService.deleteEvent(id).subscribe({
        next: () => { this.showToast('Evento eliminado.'); this.loadEvents(); },
        error: () => this.showToast('Error al eliminar el evento.', 'error')
      });
    }
  }

  // --- USERS ACTIONS ---
  loadUsers(): void {
    this.dataService.getUsers().subscribe(data => this.users = data);
  }

  openUserModal(user?: User): void {
    if (user) {
      this.userModal = { show: true, isEdit: true, data: { id: user.id, username: user.username, password: '', role: user.role } };
    } else {
      this.userModal = { show: true, isEdit: false, data: { id: undefined, username: '', password: '', role: 'editor' } };
    }
  }

  closeUserModal(): void { this.userModal.show = false; }

  saveUser(): void {
    const u = this.userModal.data;
    if (this.userModal.isEdit) {
      const payload: any = { username: u.username, role: u.role };
      if (u.password) payload.password = u.password;
      this.dataService.updateUser(u.id!, payload).subscribe({
        next: () => { this.showToast('Usuario actualizado.'); this.closeUserModal(); this.loadUsers(); },
        error: (err) => this.showToast(err.error?.error || 'Error al actualizar el usuario.', 'error')
      });
    } else {
      this.dataService.createUser({ username: u.username, password: u.password, role: u.role }).subscribe({
        next: () => { this.showToast('Usuario creado.'); this.closeUserModal(); this.loadUsers(); },
        error: (err) => this.showToast(err.error?.error || 'Error al crear el usuario.', 'error')
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('¿Eliminar este usuario?')) {
      this.dataService.deleteUser(id).subscribe({
        next: () => { this.showToast('Usuario eliminado.'); this.loadUsers(); },
        error: (err) => this.showToast(err.error?.error || 'Error al eliminar el usuario.', 'error')
      });
    }
  }

  // --- SITE CONFIG ACTIONS ---
  loadSiteConfig(): void {
    this.dataService.getSiteConfig().subscribe(data => this.siteConfig = data);
  }

  saveSiteConfig(): void {
    this.configSaving = true;
    this.dataService.updateSiteConfig(this.siteConfig).subscribe({
      next: () => { this.configSaving = false; this.showToast('Configuración guardada.'); },
      error: () => { this.configSaving = false; this.showToast('Error al guardar la configuración.', 'error'); }
    });
  }
}
