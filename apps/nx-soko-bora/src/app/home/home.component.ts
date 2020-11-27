import { Component } from '@angular/core';

@Component({
  selector: 'nx-soko-bora-home',
  template: `<div fxLayout="column" fxLayoutAlign="center center">
    <span class="mat-display-2">Hello!</span>
    <button mat-raised-button color="primary">Login</button>
  </div> `,
  styles: [
    `
      div[fxLayout] {
        margin-top: 32px;
      }
    `,
  ],
})
export class HomeComponent {}
