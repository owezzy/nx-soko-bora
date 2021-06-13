import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './+state/components/profile/profile.component';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';


@NgModule({
  declarations: [ProfileComponent , NavigationMenuComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
