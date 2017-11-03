import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CrosswordRoutingModule } from './crossword-routing.module';

import { KeyboardService } from './keyboard.service';
import { LexiconService } from './lexicon.service';
import { CrosswordService } from './crossword.service';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';
import { PlayerHandlerService } from './crossword-player-handler.service';
import { PlayerManagerService } from './crossword-player-manager.service';
import { GameManagerService } from './crossword-game-manager.service';
import { CrosswordMenuComponent } from './crossword-menu/crossword-menu.component';
import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordHintsComponent } from './crossword-hints/crossword-hints.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        CrosswordRoutingModule
    ],
    declarations: [
        CrosswordMenuComponent,
        CrosswordGameComponent,
        CrosswordHintsComponent
    ],
    exports: [

    ],
    providers: [
        KeyboardService,
        LexiconService,
        CrosswordService,
        CrosswordGridService,
        CrosswordGameService,
        CrosswordHintsService,
        CrosswordPointsService,
        SocketHandlerSerivce,
        PlayerHandlerService,
        PlayerManagerService,
        GameManagerService,

    ]
})
export class CrosswordModule { }
