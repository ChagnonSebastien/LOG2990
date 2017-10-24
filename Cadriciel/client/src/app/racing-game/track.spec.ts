import { Track } from './track';

describe('Track', () => {
    const track = new Track(
        'name',
        'desc',
        'diff',
        [],
        [],
        [],
        []
    );

    it('should be created', function () {
        expect(track).toBeDefined();
    });
});
