import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GameInitializationModule } from './game-initialization/game-initialization.module';

import { RacingGameComponent } from './racing-game.component';
import { ClientTracksComponent } from './client-track/client-tracks.component';
import { ClientTrackInfoComponent } from './client-track/client-track-info.component';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TrackService } from './game-initialization/track.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpModule,
        GameInitializationModule,
    ],
    declarations: [
        RacingGameComponent,
        ClientTracksComponent,
        ClientTrackInfoComponent,
    ],
    exports: [
        RacingGameComponent,
        ClientTracksComponent,
        ClientTrackInfoComponent,
    ],
    providers: [RenderService, CameraService, TrackService]
})
export class RacingGameModule { }
