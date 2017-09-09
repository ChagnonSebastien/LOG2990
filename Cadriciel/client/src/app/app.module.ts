import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';

/* App Root */
// Component imports
import { AppComponent } from './app.component';

// Service imports

/* Feature modules */
import { CrosswordGameModule } from './crossword-game/crossword-game.module';
import { HomeModule } from './home/home.module';
import { RacingGameModule } from './racing-game/racing-game.module';

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
})
export class AppModule { }