import { TestBed } from '@angular/core/testing';

import { CrosswordSocketService } from './crossword-socket.service';

let socketService: CrosswordSocketService;

describe('#CrosswordSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordSocketService]
        });
        socketService = TestBed.get(CrosswordSocketService);
    });

    it('should construct', () => {
        expect(socketService).toBeDefined();
    });

    it('should create a socket', () => {
        expect(socketService.socket).toBeDefined();
    });
});
