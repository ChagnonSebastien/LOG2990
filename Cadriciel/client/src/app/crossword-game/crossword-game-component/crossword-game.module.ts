import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CrosswordGameInterfaceComponent } from '../crossword-game-interface/crossword-game-interface.component';
import { CrosswordMenuComponent } from './crossword-menu.component';
import { CrosswordGameComponent } from '../crossword-game.component';
import { CrosswordHintsComponent } from '../crossword-hints.component';
import { CrosswordGameRoutingModule } from './crossword-game-routing.module';
import { CrosswordGameInformationComponent } from '../crossword-game-information/crossword-game-information.component';
import { CrosswordGameInfoService } from '../services/crossword-game-info.service';
import { OldLexiconService } from '../services/lexicon.service';

import { LexiconService } from '../lexicon.service';
import { CrosswordService } from '../crossword.service';
import { CrosswordGameService } from '../crossword-game.service';
import { CrosswordHintsService } from '../crossword-hints.service';
import { KeyboardService } from '../keyboard.service';
import { CrosswordGridService } from '../crossword-grid.service';

import { MultiplayerService } from '../services/crossword-multiplayer.service';
import { CrosswordGameRoomComponent } from '../crossword-game-room/crossword-game-room.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrosswordGameRoutingModule,
        HttpModule
    ],
    declarations: [
        CrosswordMenuComponent,
        CrosswordGameComponent,
        CrosswordGameInterfaceComponent,
        CrosswordGameInformationComponent,
        CrosswordGameRoomComponent,
        CrosswordHintsComponent
    ],
    exports: [
        CrosswordGameComponent,
        CrosswordGameInterfaceComponent
    ],
    providers: [
        CrosswordGameInfoService,
        OldLexiconService,
        CrosswordService,
        MultiplayerService,
        KeyboardService,
        LexiconService,
        CrosswordGameService,
        CrosswordHintsService,
        CrosswordGridService
    ]
})
export class CrosswordGameModule { }
