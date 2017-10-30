import { AuthentificationComponent } from './authentification.component';
import { TrackDetailComponent } from './../racing-game/game-initialization/track-detail.component';
import { AdminTracksComponent } from './admin-tracks.component';
import { AdminSettingsComponent } from './admin-settings.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DrawTrackComponent } from '../racing-game/draw-track/draw-track.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'admin', component: AuthentificationComponent, children: [
            { path: 'tracks/new', component: DrawTrackComponent },
            { path: '', component: AdminComponent, children: [
                { path: '', redirectTo: 'settings', pathMatch: 'full' },
                { path: 'settings', component: AdminSettingsComponent },
                { path: 'tracks', component: AdminTracksComponent, children: [
                    { path: ':name', component: TrackDetailComponent}
                ]}
            ]},
            { path: 'tracks/:name/edit', component: DrawTrackComponent }
        ]}
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
