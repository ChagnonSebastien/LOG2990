import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { PlayerComponent } from './racing-game/game-initialization/player.component';
import { TrackDetailComponent } from './racing-game/game-initialization/track-detail.component';
import { DrawTrackComponent } from './racing-game/draw-track/draw-track.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
