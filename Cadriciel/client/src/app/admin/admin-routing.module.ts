import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DrawTrackComponent } from '../racing-game/draw-track/draw-track.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'admin', component: AdminComponent },
        { path: 'admin/tracks/new', component: DrawTrackComponent },
        { path: 'admin/tracks/edit/:name', component: DrawTrackComponent }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
