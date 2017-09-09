import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RacingGameComponent } from './racing-game.component';
import { RacingHeaderComponent } from './racing-header/racing-header.component';
import { TrackComponent } from './track/track.component';
import { TracksComponent } from './tracks/tracks.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        RacingGameComponent,
        RacingHeaderComponent,
        TrackComponent,
        TracksComponent,
    ],
    exports: [
        RacingGameComponent,
        RacingHeaderComponent,
        TrackComponent,
        TracksComponent,
    ],
    providers: []
})
export class RacingGameModule { }