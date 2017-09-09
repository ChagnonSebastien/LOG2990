import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CrosswordGameComponent } from './crossword-game/crossword-game.component';
import { RacingGameComponent } from './racing-game/racing-game.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'racing-game', component: RacingGameComponent }
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
