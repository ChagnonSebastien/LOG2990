import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';
import { CrosswordComponent } from './crossword/crossword.component';

import {RenderService} from './cube/render.service';
import {BasicService} from './basic.service';


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    CrosswordComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'crossword',
        component: CrosswordComponent
      }
    ])
  ],
  providers: [
    RenderService,
    BasicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
