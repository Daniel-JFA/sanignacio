import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Story {
  id?: number;
  badge: string;
  badge_color?: string;
  title: string;
  desc_text: string;
  content?: string;
  img: string;
  created_at?: string;
}

export interface Milestone {
  id?: number;
  year: string;
  title: string;
  desc_text: string;
  img: string;
  created_at?: string;
}

export interface GalleryItem {
  id?: number;
  img: string;
  alt: string;
  created_at?: string;
}

export interface User {
  id?: number;
  username: string;
  role: string;
  created_at?: string;
}

export interface SiteEvent {
  id?: number;
  day_name: string;
  day: string;
  month: string;
  time: string;
  title: string;
  description: string;
  img: string;
  active?: boolean;
}

export interface SiteConfig {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3300' : '';
  private apiUrl = `${this.baseUrl}/api`;

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }

  getLoginStatus(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_user', res.username);
          this.loggedIn$.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.loggedIn$.next(false);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // File upload
  uploadImage(file: File): Observable<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ fileUrl: string }>(
      `${this.apiUrl}/upload`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Stories
  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/stories`);
  }

  addStory(story: Story): Observable<Story> {
    return this.http.post<Story>(`${this.apiUrl}/stories`, story, {
      headers: this.getAuthHeaders(),
    });
  }

  updateStory(id: number, story: Story): Observable<Story> {
    return this.http.put<Story>(`${this.apiUrl}/stories/${id}`, story, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteStory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/stories/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Milestones
  getMilestones(): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.apiUrl}/milestones`);
  }

  addMilestone(milestone: Milestone): Observable<Milestone> {
    return this.http.post<Milestone>(`${this.apiUrl}/milestones`, milestone, {
      headers: this.getAuthHeaders(),
    });
  }

  updateMilestone(id: number, milestone: Milestone): Observable<Milestone> {
    return this.http.put<Milestone>(`${this.apiUrl}/milestones/${id}`, milestone, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteMilestone(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/milestones/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Gallery
  getGallery(): Observable<GalleryItem[]> {
    return this.http.get<GalleryItem[]>(`${this.apiUrl}/gallery`);
  }

  addGalleryItem(item: GalleryItem): Observable<GalleryItem> {
    return this.http.post<GalleryItem>(`${this.apiUrl}/gallery`, item, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteGalleryItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/gallery/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserRole(): string {
    const token = localStorage.getItem('admin_token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch { return ''; }
  }

  // Users (super_admin only)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  createUser(data: { username: string; password: string; role: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, data, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, data: { username?: string; password?: string; role?: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { headers: this.getAuthHeaders() });
  }

  // Events
  getPublicEvents(): Observable<SiteEvent[]> {
    return this.http.get<SiteEvent[]>(`${this.apiUrl}/events`);
  }

  getEventsAll(): Observable<SiteEvent[]> {
    return this.http.get<SiteEvent[]>(`${this.apiUrl}/events/all`, { headers: this.getAuthHeaders() });
  }

  addEvent(event: SiteEvent): Observable<SiteEvent> {
    return this.http.post<SiteEvent>(`${this.apiUrl}/events`, event, { headers: this.getAuthHeaders() });
  }

  updateEvent(id: number, event: Partial<SiteEvent>): Observable<SiteEvent> {
    return this.http.put<SiteEvent>(`${this.apiUrl}/events/${id}`, event, { headers: this.getAuthHeaders() });
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/events/${id}`, { headers: this.getAuthHeaders() });
  }

  // Site Config
  getSiteConfig(): Observable<SiteConfig> {
    return this.http.get<SiteConfig>(`${this.apiUrl}/site-config`);
  }

  updateSiteConfig(config: SiteConfig): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/site-config`, config, { headers: this.getAuthHeaders() });
  }
}
