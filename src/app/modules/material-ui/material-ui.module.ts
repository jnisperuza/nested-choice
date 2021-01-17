import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ScrollingModule
  ],
  exports: [
    MatIconModule,
    MatProgressSpinnerModule,
    ScrollingModule
  ]
})
export class MaterialUiModule { }
