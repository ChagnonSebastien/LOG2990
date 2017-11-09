import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrosswordMenuComponent } from './menu/crossword-menu.component';
import { CrosswordGameComponent } from './game-manager/crossword-game.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crossword-game', component: CrosswordGameComponent }
    ])],
    exports: [RouterModule]
})
export class CrosswordRoutingModule { }
