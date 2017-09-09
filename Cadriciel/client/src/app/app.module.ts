import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { APP_BASE_HREF } from '@angular/common';

/* App Root */
// Component imports
import { AppComponent } from './app.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { InGameComponent } from './racing-game/in-game/in-game.component';
import { RacingHeaderComponent } from './racing-game/racing-header/racing-header.component';
import { TrackEditorComponent } from './racing-game/track-editor/track-editor.component';
import { AdministrationComponent } from './racing-game/administration/administration.component';
import { TracksComponent } from './racing-game/tracks/tracks.component';
import { TrackAdminComponent } from './racing-game/track-admin/track-admin.component';
import { TrackInfoComponent } from './racing-game/track-info/track-info.component';
import { TrackComponent } from './racing-game/track/track.component';

// Service imports
import { RenderService } from './home/cube/render.service';

/* Feature modules */
import { AppRoutingModule } from './app-routing.module';
import { CrosswordGameModule } from './crossword-game/crossword-game.module';
import { HomeModule } from './home/home.module';

@NgModule({
    declarations: [
        AppComponent,
        RacingGameComponent,
        InGameComponent,
        RacingHeaderComponent,
        TrackEditorComponent,
        AdministrationComponent,
        TracksComponent,
        TrackAdminComponent,
        TrackInfoComponent,
        TrackComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        CrosswordGameModule,
        HomeModule
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        RenderService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
