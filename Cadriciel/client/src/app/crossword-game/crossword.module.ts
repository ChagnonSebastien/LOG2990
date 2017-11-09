import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CrosswordRoutingModule } from './crossword-routing.module';

import { KeyboardService } from './keyboard/keyboard.service';
import { LexiconService } from './lexicon/lexicon.service';
import { CrosswordService } from './crossword/crossword.service';
import { CrosswordGameService } from './game-manager/crossword-game.service';
import { CrosswordGridService } from './grid/crossword-grid.service';
import { CrosswordHintsService } from './hints/crossword-hints.service';
import { CrosswordPointsService } from './points/crossword-points.service';
import { CrosswordConfigurationService } from './configuration/crossword-configuration.service';
import { CrosswordWordsService } from './words/crossword-words.service';
import { CrosswordSocketService } from './socket/crossword-socket.service';
import { CrosswordPlayerService } from './player/crossword-player.service';
import { CrosswordMultiplayerService } from './multiplayer/crossword-multiplayer.service';
import { CrosswordCountdownService } from './countdown/crossword-countdown.service';
import { CrosswordCheatService } from './cheat/crossword-cheat.service';
import { CrosswordMutationService } from './mutation/crossword-mutation.service';

import { CrosswordMenuComponent } from './menu/crossword-menu.component';
import { CrosswordGameComponent } from './game-manager/crossword-game.component';
import { CrosswordHintsComponent } from './hints/crossword-hints.component';
import { CrosswordGridComponent } from './grid/crossword-grid.component';
import { CrosswordLobbyComponent } from './lobby/crossword-lobby.component';
import { CrosswordPointsComponent } from './points/crossword-points.component';
import { CrosswordEndGameComponent } from './end-game/crossword-end-game.component';
import { CrosswordCountdownComponent } from './countdown/crossword-countdown.component';
import { CrosswordCheatComponent } from './cheat/crossword-cheat.component';

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
        CrosswordCheatService,
        CrosswordMutationService
    ]
})
export class CrosswordModule { }
