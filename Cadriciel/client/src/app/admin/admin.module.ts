import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/* Admin module */
import { AdminComponent } from './admin.component';
import { TracksComponent } from './tracks/tracks.component';
import { DrawTrackComponent } from '../racing-game/draw-track/draw-track.component';
import { TrackInfoComponent } from './tracks/track-info.component';
import { DrawTrackService } from '../racing-game/draw-track/draw-track.service';

import { AuthenticationService } from './authentication.service';
import { TrackService } from './tracks/track.service';
import { Track } from './tracks/track';

/* Feature modules */

/* Routing module */
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        HttpModule
    ],
    declarations: [
        AdminComponent,
        TracksComponent,
        DrawTrackComponent,
        TrackInfoComponent,
    ],
    exports: [
        AdminComponent,
        TracksComponent,
        TrackInfoComponent,
    ],
    providers: [
        AuthenticationService,
        DrawTrackService,
        TrackService
    ]
})
export class AdminModule { }
