import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CrosswordGameInterfaceComponent} from './crossword-game-interface.component';
import { CrosswordGameComponent } from './crossword-game.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'crossword-game', component: CrosswordGameComponent},
    {path : 'crossword-test' ,component: CrosswordGameInterfaceComponent}
  
  ])],
  exports: [RouterModule]
})
export class CrosswordGameRoutingModule {}
