import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GameInitializationModule } from './game-initialization/game-initialization.module';

import { RacingGameComponent } from './racing-game.component';
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
    ],
    exports: [
        RacingGameComponent,
    ],
    providers: [RenderService, CameraService, TrackService]
})
export class RacingGameModule { }
