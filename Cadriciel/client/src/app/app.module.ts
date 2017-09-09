import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { APP_BASE_HREF } from '@angular/common';

/* App Root */
// Component imports
import { AppComponent } from './app.component';
import { InGameComponent } from './racing-game/in-game/in-game.component';
import { TrackEditorComponent } from './racing-game/track-editor/track-editor.component';
import { AdministrationComponent } from './racing-game/administration/administration.component';
import { TrackAdminComponent } from './racing-game/track-admin/track-admin.component';
import { TrackInfoComponent } from './racing-game/track-info/track-info.component';

// Service imports
import { RenderService } from './home/cube/render.service';

/* Feature modules */
import { AppRoutingModule } from './app-routing.module';
import { CrosswordGameModule } from './crossword-game/crossword-game.module';
import { HomeModule } from './home/home.module';
import { RacingGameModule } from './racing-game/racing-game.module';

@NgModule({
    declarations: [
        AppComponent,
        InGameComponent,
        TrackEditorComponent,
        AdministrationComponent,
        TrackAdminComponent,
        TrackInfoComponent,
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
        RenderService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
