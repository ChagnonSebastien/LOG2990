import { AdminViewDetailsComponent } from './admin-view-details.component';
import { AdminViewComponent } from './admin-view.component';
import { AdminViewTracksComponent } from './admin-view-tracks.component';
import { AdminViewSettingsComponent } from './admin-view-settings.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DrawTrackComponent } from '../racing-game/draw-track/draw-track.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'admin', component: AdminComponent, children: [
            { path: '', redirectTo: 'view', pathMatch: 'full' },
            { path: 'tracks/new', component: DrawTrackComponent },
            { path: 'tracks/edit/:name', component: DrawTrackComponent },
            { path: 'view', component: AdminViewComponent, children: [
                { path: '', redirectTo: 'settings', pathMatch: 'full' },
                { path: 'settings', component: AdminViewSettingsComponent },
                { path: 'tracks', component: AdminViewTracksComponent, children: [
                    { path: ':name', component: AdminViewDetailsComponent }
                ]}
            ]}
        ] },
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
