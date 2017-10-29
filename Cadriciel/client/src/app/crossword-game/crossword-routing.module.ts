import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrosswordMenuComponent } from './crossword-menu.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crossword-game', component: CrosswordMenuComponent }
    ])],
    exports: [RouterModule]
})
export class CrosswordRoutingModule { }
