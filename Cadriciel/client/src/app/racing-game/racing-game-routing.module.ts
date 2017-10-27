import { PlayerComponent } from './game-initialization/player.component';
import { RacingGameComponent } from './racing-game.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'racing-game/view', component: RacingGameComponent },
        { path: 'racing-game', component: PlayerComponent }
    ])],
    exports: [RouterModule]
})
export class RacingGameRoutingModule { }
