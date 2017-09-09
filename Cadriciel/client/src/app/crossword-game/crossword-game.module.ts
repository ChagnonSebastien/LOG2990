import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { CrosswordGameComponent } from './crossword-game.component';
 
@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ CrosswordGameComponent ],
  exports:      [ CrosswordGameComponent ],
  providers:    [ ]
})
export class CrosswordGameModule { }