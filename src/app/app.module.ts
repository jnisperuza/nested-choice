import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialUiModule } from './modules/material-ui/material-ui.module';
import { NestedChoiceFieldModule } from './modules/nested-choice-field/nested-choice-field.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialUiModule,
    NestedChoiceFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
