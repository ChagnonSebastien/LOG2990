import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TrackListComponent } from './track-list.component';
import { TrackDetailComponent } from './track-detail.component';
import { Track } from '../track';
import { } from './game-initialization.component';

import { TrackService } from './track.service';


/* Routing module */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        TrackListComponent,
        TrackDetailComponent,
    ],
    exports: [
        TrackListComponent,
        TrackDetailComponent,
    ],
    providers: [
        TrackService
    ]
})
export class GameInitializationModule { }
