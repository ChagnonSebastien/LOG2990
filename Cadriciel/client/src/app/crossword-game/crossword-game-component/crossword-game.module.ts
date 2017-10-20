import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CrosswordGameInterfaceComponent} from '../crossword-game-interface/crossword-game-interface.component';
import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordGameRoutingModule} from './crossword-game-routing.module';
import { CrosswordGameInformationComponent } from '../crossword-game-information/crossword-game-information.component';
import {CrosswordGameInfoService} from '../services/crossword-game-info.service';
import {LexiconService} from '../services/lexicon.service';
import {CrosswordService} from '../services/crossword.service';
import {MultiplayerService} from '../services/crossword-multiplayer.service';
import { CrosswordGameRoomComponent } from '../crossword-game-room/crossword-game-room.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrosswordGameRoutingModule
    ],
    declarations: [CrosswordGameComponent, CrosswordGameInterfaceComponent, CrosswordGameInformationComponent, CrosswordGameRoomComponent],
    exports: [CrosswordGameComponent, CrosswordGameInterfaceComponent],
    providers: [CrosswordGameInfoService, LexiconService, CrosswordService, MultiplayerService]
})
export class CrosswordGameModule { }
