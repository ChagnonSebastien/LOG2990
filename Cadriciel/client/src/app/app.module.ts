import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';

/* App Root */
// Component imports
import { AppComponent } from './app.component';
<<<<<<< HEAD
import { CubeComponent } from './cube/cube.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
=======
>>>>>>> 44337e475c994c29d4e609adfb5e2fa434f7f9c4

// Service imports

/* Feature modules */
import { CrosswordGameModule } from './crossword-game/crossword-game.module';
import { HomeModule } from './home/home.module';
import { RacingGameModule } from './racing-game/racing-game.module';

<<<<<<< HEAD
import { APP_BASE_HREF } from '@angular/common'; 

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    CrosswordComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    BasicService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
=======
/* Routing modules */
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        CrosswordGameModule,
        HomeModule,
        RacingGameModule
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
    ],
    bootstrap: [AppComponent]
>>>>>>> 44337e475c994c29d4e609adfb5e2fa434f7f9c4
})
export class AppModule { }
