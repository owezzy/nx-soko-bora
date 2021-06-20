import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AuthModule } from '../app/auth/auth.module';
import { MaterialModule } from '@nx-soko-bora/material';
import { SimpleDialogComponent } from '../app/common/simple-dialog/simple-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SimpleDialogComponent],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AuthModule,
    SharedRoutingModule,
  ],
})
export class SharedModule {}
