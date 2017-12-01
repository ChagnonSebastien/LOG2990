import * as chai from 'chai';
import * as spies from 'chai-spies';

chai.use(spies);
const expect = chai.expect;

import { MultiplayerManager } from './multiplayer-manager';
import { CrosswordLobbyService } from './crossword-multiplayer/crossword-lobby-service';
import { CrosswordGameplayService } from './crossword-multiplayer/crossword-gameplay-service';

let multiplayerManager: MultiplayerManager;
let lobbyService: CrosswordLobbyService;
let gameplayService: CrosswordGameplayService;

describe('#MultiplayerManager', () => {
    before(() => {
        lobbyService = CrosswordLobbyService.getInstance();
        gameplayService = CrosswordGameplayService.getInstance();
        multiplayerManager = MultiplayerManager.getInstance();
    });

    it('should be a singleton', () => {
        expect(MultiplayerManager.getInstance()).to.equal(MultiplayerManager.getInstance());
    });

    describe('handleCrosswordGameRequests()', () => {
        it('should listen for lobby requests', () => {
            const lobbySpy = chai.spy.on(lobbyService, 'listenForLobbyRequests');
            multiplayerManager.handleCrosswordGameRequests();
            expect(lobbySpy).to.have.been.called();
        });

        it('should listen for gameplay requests', () => {
            const gameplaySpy = chai.spy.on(gameplayService, 'listenForGameplayRequests');
            multiplayerManager.handleCrosswordGameRequests();
            expect(gameplaySpy).to.have.been.called();
        });
    });
});
