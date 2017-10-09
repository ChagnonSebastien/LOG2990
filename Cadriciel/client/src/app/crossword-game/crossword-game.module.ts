import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CrosswordGameInterfaceComponent} from './crossword-game-interface.component';
import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordGameRoutingModule} from './crossword-game-routing.module';
import { CrosswordGameInformationComponent } from './crossword-game-information/crossword-game-information.component';
import {CrosswordGameInfoService} from './crossword-game-info.service';
import {LexiconService} from './lexicon.service';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrosswordGameRoutingModule
    ],
    declarations: [CrosswordGameComponent, CrosswordGameInterfaceComponent, CrosswordGameInformationComponent],
    exports: [CrosswordGameComponent, CrosswordGameInterfaceComponent],
    providers: [CrosswordGameInfoService, LexiconService]
})
export class CrosswordGameModule { }
