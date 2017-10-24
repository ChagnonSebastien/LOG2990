import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { PlayerComponent } from './racing-game/game-initialization/player.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'racing-game/view', component: RacingGameComponent },
    { path: 'racing-game', component: PlayerComponent },
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
