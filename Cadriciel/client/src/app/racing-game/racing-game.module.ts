import { ImprovedNoise } from './perlin_noise.service';
import { TerrainGenerationService } from './terrain-generation.service';
import { RacingGameRoutingModule } from './racing-game-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GameInitializationModule } from './game-initialization/game-initialization.module';

import { RacingGameComponent } from './racing-game.component';
import { CountdownComponent } from './countdown.component';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TrackService } from './game-initialization/track.service';
import { RacingGameService } from './racing-game.service';
import { CommandsService } from './commands.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpModule,
        GameInitializationModule,
        RacingGameRoutingModule
    ],
    declarations: [
        RacingGameComponent,
        CountdownComponent,
    ],
    exports: [
        RacingGameComponent,
        CountdownComponent,
    ],
    providers: [
        RenderService,
        CameraService,
        TrackService,
        RacingGameService,
        TerrainGenerationService,
        CommandsService,
        ImprovedNoise
    ]
})
export class RacingGameModule { }
