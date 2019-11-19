import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent, SierpinskiDot, SierpinskiTriangle} from './app.component';

@NgModule({
  declarations: [AppComponent, SierpinskiDot, SierpinskiTriangle],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
