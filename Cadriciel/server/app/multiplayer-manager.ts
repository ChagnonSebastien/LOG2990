import { CrosswordLobbyService } from './crossword-multiplayer/crossword-lobby-service';
import { CrosswordGameplayService } from './crossword-multiplayer/crossword-gameplay-service';

export class MultiplayerManager {
    private static multiplayerManager: MultiplayerManager;
    private crosswordLobbyService: CrosswordLobbyService;
    private crosswordGameplayService: CrosswordGameplayService;

    private constructor() {
        this.crosswordLobbyService = CrosswordLobbyService.getInstance();
        this.crosswordGameplayService = CrosswordGameplayService.getInstance();
    }

    // Singleton
    public static getInstance() {
        if (this.multiplayerManager === undefined) {
            this.multiplayerManager = new MultiplayerManager();
        }
        return this.multiplayerManager;
    }

    public handleCrosswordGameRequests() {
        this.crosswordLobbyService.listenForLobbyRequests();
        this.crosswordGameplayService.listenForGameplayRequests();
    }
}
