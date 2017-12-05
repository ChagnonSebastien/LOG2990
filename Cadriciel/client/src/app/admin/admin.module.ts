import { AuthentificationComponent } from './authentification.component';
import { AdminTracksComponent } from './admin-tracks.component';
import { AdminSettingsComponent } from './admin-settings.component';
import { ObstacleService } from './../racing-game/draw-track/obstacle.service';
import { DrawTrackRenderService } from './../racing-game/draw-track/draw-track-render.service';
import { TrackValidationService } from './../racing-game/draw-track/track-validation.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/* Admin module */
import { AdminComponent } from './admin.component';
import { GameInitializationModule } from '../racing-game/game-initialization/game-initialization.module';
import { DrawTrackComponent } from '../racing-game/draw-track/draw-track.component';
import { DrawTrackService } from '../racing-game/draw-track/draw-track.service';

import { AuthenticationService } from './authentication.service';
import { TrackService } from '../racing-game/game-initialization/track.service';

/* Feature modules */

/* Routing module */
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        HttpModule,
        GameInitializationModule,
    ],
    declarations: [
        AdminComponent,
        DrawTrackComponent,
        AdminSettingsComponent,
        AdminTracksComponent,
        AuthentificationComponent
    ],
    exports: [
        AdminComponent
    ],
    providers: [
        AuthenticationService,
        DrawTrackService,
        ObstacleService,
        DrawTrackRenderService,
        TrackValidationService,
        TrackService
    ]
})
export class AdminModule { }
