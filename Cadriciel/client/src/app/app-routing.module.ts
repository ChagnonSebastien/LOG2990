import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { PlayerComponent } from './racing-game/game-initialization/player.component';
import { DrawTrackComponent } from './racing-game/draw-track/draw-track.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'racing-game/view', component: RacingGameComponent },
    { path: 'racing-game', component: PlayerComponent },
    { path: 'admin/tracks/edit/:name', component: DrawTrackComponent }
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
