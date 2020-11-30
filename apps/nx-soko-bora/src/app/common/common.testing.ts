import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SecurityContext } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Subscription, of, throwError } from 'rxjs';
import { MaterialModule } from '@nx-soko-bora/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

const FAKE_SVGS = {
  sokoBora: '<svg><path id="soko-bora" name="soko-bora"></path></svg>',
};

export class MediaObserverFake {
  isActive(query: string): boolean {
    return false;
  }

  asObservable(): Observable<MediaChange> {
    return of({} as MediaChange);
  }

  subscribe(
    next?: (value: MediaChange) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return new Subscription();
  }
}

export class MatIconRegistryFake {
  // tslint:disable-next-line: variable-name
  _document = document;
  addSvgIcon(iconName: string, url: SafeResourceUrl): this {
    this.addSvgIcon('soko-bora', 'soko-bora.svg');
    return this;
  }

  getNamedSvgIcon(name: string, namespace: string = ''): Observable<SVGElement> {
    return of(this._svgElementFromString(FAKE_SVGS.sokoBora));
  }

  private _svgElementFromString(str: string): SVGElement {
    const div = (this._document || document).createElement('DIV');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;
    if (!svg) {
      throw Error('<svg> tag not found');
    }
    return svg;
  }
}

export class DomSanitizerFake {
  bypassSecurityTrustResourceUrl(url: string): SafeResourceUrl {
    return {} as SafeResourceUrl;
  }
  sanitize(context: SecurityContext, value: SafeValue | string | null): string | null {
    return value?.toString() || null;
  }
}

// @ts-ignore
export const commonTestingProviders: any[] = [
  // { provide: AuthService, useValue: jest.fn(AuthService) },
  // { provide: UiService, useValue: jest.fn(UiService) },
];

export const commonTestingModules: any[] = [
  ReactiveFormsModule,
  MaterialModule,
  NoopAnimationsModule,
  HttpClientTestingModule,
  RouterTestingModule,
];

export function transformError(error: HttpErrorResponse | string) {
  let errorMessage = 'An unknown error has occurred';
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.error instanceof ErrorEvent) {
    errorMessage = `Error!
${error.error.message}`;
  } else if (error.status) {
    errorMessage = `Request failed with ${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return throwError(errorMessage);
}
