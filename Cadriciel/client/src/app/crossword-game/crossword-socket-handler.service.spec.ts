import { TestBed } from '@angular/core/testing';

import { SocketHandlerSerivce } from './crossword-socket-handler.service';

let socketHandlerSerivce: SocketHandlerSerivce;
describe('SocketHandlerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SocketHandlerSerivce
            ]
        });
        socketHandlerSerivce = TestBed.get(SocketHandlerSerivce);
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
        expect(socketHandlerSerivce.connectionStatus()).toBeFalsy();
    });

});
