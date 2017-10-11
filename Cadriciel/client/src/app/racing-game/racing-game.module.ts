import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RacingGameComponent } from './racing-game.component';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
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
