import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ManagerModule } from './manager/manager.module';
import { InventoryModule } from './inventory/inventory.module';
import { PosModule } from './pos/pos.module';
import { UserModule } from './user/user.module';
import { HomeComponent } from './home/home.component';
import { rootReducers, metaReducers } from '../Store/reducers';
import { RouterEffects } from '../Store/reducers/router.effects';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaterialModule } from '@nx-soko-bora/material';
import { AuthService } from './auth/auth.service';
import { AuthInMemoryService } from './auth/auth-in-memory.service';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { UiService } from './common/ui.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { A } from '@angular/cdk/keycodes';

const COMPONENTS = [AppComponent, HomeComponent, PageNotFoundComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(rootReducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: false,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
      },
    }),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'soko-bora',
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([RouterEffects]),
    ManagerModule,
    InventoryModule,
    PosModule,
    UserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  providers: [Title, UiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
