import { Injectable } from '@angular/core';
import { Role } from './auth.enum';
import { BehaviorSubject, Observable, pipe, throwError } from 'rxjs';
import { IUser, User } from '../user/user';
import { catchError, filter, flatMap, map, tap } from 'rxjs/operators';
import { transformError } from '../common/common.testing';
import { decode } from 'punycode';
import { CacheService } from './cache.service';

export interface IAuthStatus {
  isAuthenticated: boolean;
  userRole: Role;
  userId: string;
}
export interface IServerAuthResponse {
  accessToken: string;
}
export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: '',
};

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<void>;
  logout(clearToken?: boolean): void;
  getToken(): string;
}
@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  private getAndUpdateUserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    flatMap(() => this.getCurrentUser()),
    map((user: IUser) => this.currentUser$.next(user)),
    catchError(transformError)
  );

  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());

  protected constructor() {
    super();
  }

  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<User>;

  login(email: string, password: string): Observable<void> {
    this.clearToken();

    const loginResponse$ = this.authProvider(email, password).pipe(
      map((value) => {
        this.setToken(value.accessToken);
        // const token = decode(value.accessToken);
        // return this.transformJwtToken(token);
        return this.getAuthStatusFromToken(); // Keeping the code DRY!
      }),
      tap((status) => this.authStatus$.next(status)),
      // filter((status: IAuthStatus) => status.isAuthenticated),
      // flatMap(() => this.getCurrentUser()),
      // map((user) => this.currentUser$.next(user)),
      // catchError(transformError)
      this.getAndUpdateUserIfAuthenticated // Keeping the code DRY!
    );
    loginResponse$.subscribe({
      error: (err) => {
        this.logout();
        return throwError(err);
      },
    });
    return loginResponse$;
  }

  logout(clearToken?: boolean): void {
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }

  protected hasExpiredToken(): boolean {
    const jwt = this.getToken();

    if (jwt) {
      const payload = decode(jwt) as any;
      return Date.now() >= payload.exp * 1000;
    }
    return true;
  }

  protected setToken(jwt: string) {
    this.setItem('jwt', jwt);
  }

  getToken(): string {
    return this.getItem('jwt') ?? '';
  }
  protected clearToken() {
    this.removeItem('jwt');
  }
  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(decode(this.getToken()));
  }
}
