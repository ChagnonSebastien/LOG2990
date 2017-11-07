import { TestBed } from '@angular/core/testing';

import { CrosswordSocketService } from './crossword-socket.service';

let socketHandlerSerivce: CrosswordSocketService;
describe('SocketHandlerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordSocketService
            ]
        });
        socketHandlerSerivce = TestBed.get(CrosswordSocketService);
    });

    it('should be created', () => {
        expect(socketHandlerSerivce).toBeDefined();
    });

    it('should return an active socket player', () => {
        const HOST_NAME = 'http://' + window.location.hostname;
        const SERVER_PORT = ':3000';
        expect(socketHandlerSerivce.requestSocket(HOST_NAME + SERVER_PORT)).toBeDefined();
    });

    it('should disconnect the socket', () => {
        const HOST_NAME = 'http://' + window.location.hostname;
        const SERVER_PORT = ':3000';
        socketHandlerSerivce.requestSocket(HOST_NAME + SERVER_PORT);
        socketHandlerSerivce.disconnectSocket();
        expect(socketHandlerSerivce.connected()).toBeFalsy();
    });

});
