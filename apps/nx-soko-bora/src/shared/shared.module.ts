import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AuthModule } from '../app/auth/auth.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthModule, SharedRoutingModule],
})
export class SharedModule {}
