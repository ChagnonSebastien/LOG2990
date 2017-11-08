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
import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';
import { CrosswordWordsService } from './crossword-words.service';
import { CrosswordSocketService } from './crossword-socket.service';
import { CrosswordPlayerService } from './crossword-player.service';
import { CrosswordMultiplayerService } from './crossword-multiplayer.service';
import { CrosswordCountdownService } from './crossword-countdown.service';
import { CrosswordCheatService } from './crossword-cheat.service';

import { CrosswordMenuComponent } from './crossword-menu/crossword-menu.component';
import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordHintsComponent } from './crossword-hints/crossword-hints.component';
import { CrosswordGridComponent } from './crossword-grid/crossword-grid.component';
import { CrosswordLobbyComponent } from './crossword-lobby/crossword-lobby.component';
import { CrosswordPointsComponent } from './crossword-points/crossword-points.component';
import { CrosswordEndGameComponent } from './crossword-end-game.component';
import { CrosswordCountdownComponent } from './crossword-countdown.component';
import { CrosswordCheatComponent } from './crossword-cheat.component';

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
        CrosswordHintsComponent,
        CrosswordGridComponent,
        CrosswordLobbyComponent,
        CrosswordPointsComponent,
        CrosswordEndGameComponent,
        CrosswordCountdownComponent,
        CrosswordCheatComponent
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
        CrosswordConfigurationService,
        CrosswordWordsService,
        CrosswordSocketService,
        CrosswordPlayerService,
        CrosswordMultiplayerService,
        CrosswordCountdownService,
        CrosswordCheatService
    ]
})
export class CrosswordModule { }
