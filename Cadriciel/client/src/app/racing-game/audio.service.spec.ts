import { AudioService } from './audio.service';

describe('test AudioService', function () {
    const audioService = new AudioService();

    it('construction test', () => {
        expect(audioService).toBeDefined();
    });
});
