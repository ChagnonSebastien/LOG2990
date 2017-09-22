import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrosswordGameComponent } from './crossword-game.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'crossword-game', component: CrosswordGameComponent}
  ])],
  exports: [RouterModule]
})
export class CrosswordGameRoutingModule {}
