import { CommandsService } from './events/commands.service';
import { RaceService } from './events/race.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { Track } from './track';
import * as THREE from 'three';

const track = new Track('name', 'description', 'type', [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 0),
    new THREE.Vector2(100, 100)
], [], [], [], -1, 0, []);

describe('CountdownService', function () {
    const countdownService = new CountdownService(new AudioService(new RaceService()), new CommandsService());

    it('construction test', () => {
        expect(countdownService).toBeDefined();
        expect(countdownService['count'] === 6);
    });

    it('create 3D countdown', (done) => {
        countdownService.createCountdown(track).then(result => {
            expect(countdownService.countdownMesh).toBeDefined();
            done();
        });
    });

    it('starts countdown', () => {
        countdownService.startCountdown();
        expect(countdownService['timer']).toBeDefined();
        expect(countdownService['count'] !== 6);
    });
});
