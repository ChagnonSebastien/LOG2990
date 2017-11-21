import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { TrackListComponent } from './track-list.component';
import { TrackDetailComponent } from './track-detail.component';
import { PlayerComponent } from './player.component';
import { BestTimesComponent } from './best-times.component';

import { TrackService } from './track.service';


/* Routing module */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule
    ],
    declarations: [
        TrackListComponent,
        TrackDetailComponent,
        PlayerComponent,
        BestTimesComponent,
    ],
    exports: [
        TrackListComponent,
        TrackDetailComponent,
        PlayerComponent,
    ],
    providers: [
        TrackService
    ]
})
export class GameInitializationModule { }
