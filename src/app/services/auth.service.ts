import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private readonly AUTH_STORAGE_KEY = 'dental_auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private checkAuthStatus(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const authData = localStorage.getItem(this.AUTH_STORAGE_KEY);
    return authData ? JSON.parse(authData).isAuthenticated : false;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.success) {
          const authData = {
            isAuthenticated: true,
            username: username,
            loginTime: new Date().toISOString()
          };
          localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authData));
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    localStorage.removeItem(this.AUTH_STORAGE_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.checkAuthStatus();
  }

  getStoredCredentials(): Observable<any> {
    // This would typically come from the database, but for now return null
    return new Observable(observer => {
      observer.next(null);
      observer.complete();
    });
  }

  updateCredentials(username: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, {
      username,
      currentPassword,
      newPassword
    });
  }

  addUser(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, { username, password });
  }
}
