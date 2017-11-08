import { Component } from '@angular/core';

import { CrosswordPlayerService } from '../crossword-player.service';
import { CrosswordMultiplayerService } from '../crossword-multiplayer.service';

@Component({
    selector: 'app-crossword-lobby',
    templateUrl: './crossword-lobby.component.html',
    styleUrls: ['./crossword-lobby.component.css']
})
export class CrosswordLobbyComponent {
    constructor(
        public multiplayerService: CrosswordMultiplayerService,
        public playerService: CrosswordPlayerService
    ) { }
}
