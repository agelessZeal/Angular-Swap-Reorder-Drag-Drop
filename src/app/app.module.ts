import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SwapDragComponentModule } from './swap-drag/swap-drag.module.js';
import { SwapGridShowerComponent } from './swap-grid-shower/swap-grid-shower.component';
@NgModule({
  declarations: [
    AppComponent,
    SwapGridShowerComponent,
  ],
  imports: [
    BrowserModule,
    SwapDragComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
