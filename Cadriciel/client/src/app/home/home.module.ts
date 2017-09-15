import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import { HomeComponent } from './home.component';

import { BasicService } from './basic.service';

/* Feature modules */
import { CubeModule } from './cube/cube.module';
import {DrawTrackComponent} from "../racing-game/draw-track/draw-track.component";
import {DrawTrackService} from "../racing-game/draw-track/draw-track.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CubeModule
    ],
    declarations: [
        HomeComponent,
        DrawTrackComponent
    ],
    exports: [
        HomeComponent,
    ],
    providers: [
        BasicService,
        DrawTrackService
    ]
})
export class HomeModule { }
