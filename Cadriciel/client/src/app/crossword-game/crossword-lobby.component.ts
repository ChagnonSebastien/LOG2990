import { Component } from '@angular/core';

import { CrosswordMultiplayerService } from './crossword-multiplayer.service';

@Component({
    selector: 'app-crossword-lobby',
    templateUrl: './crossword-lobby.component.html',
    styleUrls: ['./crossword-lobby.component.css']
})
export class CrosswordLobbyComponent {
    constructor(private multiplayerService: CrosswordMultiplayerService) {

    }
}
