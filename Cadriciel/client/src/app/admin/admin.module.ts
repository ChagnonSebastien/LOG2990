import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import {AdminComponent} from './admin.component';
import {DrawTrackComponent} from '../racing-game/draw-track/draw-track.component';
import {DrawTrackService} from '../racing-game/draw-track/draw-track.service';

import { AuthenticationService } from './authentication.service';

/* Feature modules */

/* Routing module */
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
        DrawTrackComponent
    ],
    exports: [
        AdminComponent,
    ],
    providers: [
        AuthenticationService,
        DrawTrackService
    ]
})
export class AdminModule { }
