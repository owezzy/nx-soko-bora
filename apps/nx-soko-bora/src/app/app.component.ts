import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@nx-soko-bora/api-interfaces';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { SubSink } from 'subsink';

@Component({
  selector: 'nx-lemon-mart-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private subs = new SubSink();
  opened: boolean;

  hello$ = this.http.get<Message>('/api/hello');
  constructor(
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public media: MediaObserver
  ) {
    iconRegistry.addSvgIcon(
      'soko-bora',
      sanitizer.bypassSecurityTrustResourceUrl('assets/soko-bora.svg')
    );
  }
}
