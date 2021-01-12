import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialUiModule } from '../material-ui/material-ui.module';
import { NestedChoiceFieldComponent } from './nested-choice-field.component';
import { SelectItemComponent } from './select-item/select-item.component';



@NgModule({
  declarations: [
    NestedChoiceFieldComponent,
    SelectItemComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NestedChoiceFieldComponent,
    SelectItemComponent
  ]
})
export class NestedChoiceFieldModule { }
