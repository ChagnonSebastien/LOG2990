import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RacingGameComponent } from './racing-game.component';
import { RenderService } from '../home/cube/render.service';
import { CameraService } from './camera.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpModule
    ],
    declarations: [
        RacingGameComponent
    ],
    exports: [
        RacingGameComponent
    ],
    providers: [RenderService, CameraService]
})
export class RacingGameModule { }
