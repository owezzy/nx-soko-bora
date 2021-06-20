import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';
import { AuthFacade } from './+state/auth.facade';
import { MaterialModule } from '@nx-soko-bora/material';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [LoginComponent, LogoutComponent];
@NgModule({
  declarations: [COMPONENTS],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [AuthFacade],
})
export class AuthModule {}
