import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import {ClientTracksComponent} from './racing-game/client-track/client-tracks.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'racing-game/view', component: RacingGameComponent },
    { path: 'racing-game', component: ClientTracksComponent },
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
