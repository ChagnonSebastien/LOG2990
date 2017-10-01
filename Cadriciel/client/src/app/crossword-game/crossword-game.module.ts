import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CrosswordGameInterfaceComponent} from './crossword-game-interface.component';
import { CrosswordGameComponent } from './crossword-game.component';
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
