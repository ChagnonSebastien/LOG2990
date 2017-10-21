import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RacingGameComponent } from './racing-game.component';
import { ClientTracksComponent } from './client-track/client-tracks.component';
import { ClientTrackInfoComponent } from './client-track/client-track-info.component';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TrackService } from './game-initialization/track.service';
import { TrackListComponent } from './game-initialization/track-list.component';
import { TrackDetailComponent } from './game-initialization/track-detail.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpModule
    ],
    declarations: [
        RacingGameComponent,
        ClientTracksComponent,
        ClientTrackInfoComponent,
        TrackListComponent,
        TrackDetailComponent,
    ],
    exports: [
        RacingGameComponent,
        ClientTracksComponent,
        ClientTrackInfoComponent,
        TrackListComponent,
        TrackDetailComponent,
    ],
    providers: [RenderService, CameraService, TrackService]
})
export class RacingGameModule { }
