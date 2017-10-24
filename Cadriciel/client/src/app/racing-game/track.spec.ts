import { Track } from './track';

describe('Track', () => {
    const track = new Track(
        1,
        'a',
        'b',
        'c',
        [],
        [],
        [],
        []
    );

    it('should be created', function () {
        expect(track).toBeDefined();
    });
});
