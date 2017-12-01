import { expect } from 'chai';

import { CrosswordGameplayService } from './crossword-gameplay-service';

import { TEST_HOST, TEST_PORT } from '../../testing/mock-socket-server';
import { Word } from '../../../commun/word';
import { HintSelection } from '../../../commun/crossword/hint-selection';

let gameplayService: CrosswordGameplayService;

describe('#CrosswordGameplayerService', () => {
    let socket: SocketIOClient.Socket;

    before(() => {
        gameplayService = CrosswordGameplayService.getInstance();
    });

    beforeEach((done) => {
        socket = io.connect(`${TEST_HOST}:${TEST_PORT}`);
        socket.on('connect', () => {
            done();
        });
    });

    after(() => {
        if (socket.connected) {
            socket.disconnect();
        }
    });

    it('should be a singleton', () => {
        expect(CrosswordGameplayService.getInstance()).to.equal(CrosswordGameplayService.getInstance());
    });

    describe('listenForGameplayRequests()', () => {
        it('should listen for found words socket requests and emit to opponent', () => {
            socket.emit('found word', new Word(0, 0, 'fakeWord', true));
        });

        it('should listen for hint selections socket requests and emit to opponent', () => {
            socket.emit('selected hint', new HintSelection('previousWord', new Word(0, 0, 'fakeWord', true)));
        });

        it('should listen for unselect all socket requests', () => {
            socket.emit('unselect all');
        });
    });
});
