import { Injectable } from '@angular/core';
import { Role } from './auth.enum';
import { BehaviorSubject, Observable, of, pipe, throwError } from 'rxjs';
import { IUser, User } from '../user/models/user';
import { catchError, filter, flatMap, map, tap } from 'rxjs/operators';
import { transformError } from '../common/common.testing';
import { decode } from 'punycode';
import { CacheService } from './cache.service';
import { sign } from 'fake-jwt-sign'; // For fakeAuthProvider only

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
  authStatus: BehaviorSubject<IAuthStatus>;
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<IAuthStatus>;
  logout(clearToken?: boolean): void;
  getToken(): string;
}
@Injectable({
  providedIn: 'root',
})
export abstract class AuthService extends CacheService implements IAuthService {
  authStatus = new BehaviorSubject<IAuthStatus>(
    this.getItem('authStatus') || defaultAuthStatus
  );
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
    this.authStatus.subscribe((authStatus) => this.setItem('authStatus', authStatus));
    // Fake login function to simulate roles
    this.authProvider = AuthService.fakeAuthProvider;
  }

  private static fakeAuthProvider(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ): Observable<IServerAuthResponse> {
    if (!email.toLowerCase().endsWith('@test.com')) {
      return throwError('Failed to login! Email needs to end with @test.com.');
    }

    const authStatus = {
      isAuthenticated: true,
      userId: 'e4d1bc2ab25c',
      userRole: email.toLowerCase().includes('cashier')
        ? Role.Cashier
        : email.toLowerCase().includes('clerk')
        ? Role.Clerk
        : email.toLowerCase().includes('manager')
        ? Role.Manager
        : Role.None,
    } as IAuthStatus;

    const authResponse = {
      accessToken: sign(authStatus, 'secret', {
        expiresIn: '1h',
        algorithm: 'none',
      }),
    } as IServerAuthResponse;

    return of(authResponse);
  }
  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<User>;

  login(email: string, password: string): Observable<IAuthStatus> {
    this.logout();

    const loginResponse = this.authProvider(email, password).pipe(
      map((value) => {
        this.setToken(value.accessToken);
        return decode(value.accessToken) as IAuthStatus;
      }),
      catchError(transformError)
    );

    loginResponse.subscribe(
      (res) => {
        this.authStatus.next(res);
      },
      (err) => {
        this.logout();
        return throwError(err);
      }
    );

    return loginResponse;
  }

  logout(): void {
    this.clearToken();
    this.authStatus.next(defaultAuthStatus);
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
