import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthFormComponent } from '../features/auth/auth-form/auth-form.component';

@NgModule({
  declarations: [],
  imports: [ReactiveFormsModule, CommonModule, AuthFormComponent],
  exports: [],
})
export class SharedModule {}