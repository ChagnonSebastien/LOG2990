import { TrackDetailComponent } from './game-initialization/track-detail.component';
import { PlayerComponent } from './game-initialization/player.component';
import { RacingGameComponent } from './racing-game.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'racing-game', component: PlayerComponent, children: [
            { path: ':name', component: TrackDetailComponent }
        ] },
        { path: 'racing-game/:name/play', component: RacingGameComponent }
    ])],
    exports: [RouterModule]
})
export class RacingGameRoutingModule { }
