import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CrosswordGameComponent } from './crossword-game.component';
import {CrosswordGameInterfaceComponent} from './crossword-game-interface.component';
import { CrosswordGameRoutingModule} from './crossword-game-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrosswordGameRoutingModule
    ],
    declarations: [CrosswordGameComponent, CrosswordGameInterfaceComponent],
    exports: [CrosswordGameComponent, CrosswordGameInterfaceComponent],
    providers: []
})
export class CrosswordGameModule { }
