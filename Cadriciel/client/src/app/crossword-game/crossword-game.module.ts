import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordGameRoutingModule} from './crossword-game-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrosswordGameRoutingModule
    ],
    declarations: [CrosswordGameComponent],
    exports: [CrosswordGameComponent],
    providers: []
})
export class CrosswordGameModule { }
