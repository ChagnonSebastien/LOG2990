import { DecorElementsService } from './decor-elements.service';
import { TestBed } from '@angular/core/testing';

let decorElementsService;

describe('DecorElementsService', function () {

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [DecorElementsService]
        });
        decorElementsService = TestBed.get(DecorElementsService);
        /*terrainGenerationService.generate(
            new THREE.Scene,
            25,
            new Track(
                'name',
                'description',
                'type',
                [new THREE.Vector2(0, 0), new THREE.Vector2(100, 100), new THREE.Vector2(0, 200)],
                [new Obstacle(ObstacleType.Puddle, 1, 0.4, 0.3)],
                [],
                [
                    new Obstacle(ObstacleType.Booster, 2, 0.3, 0.9),
                    new Obstacle(ObstacleType.Booster, 1, 0.2, 0.7),
                    new Obstacle(ObstacleType.Booster, 2, 0.1, 0.3)
                ]
            ),
            new THREE.Texture());*/
    });

    it('should be created', () => {
        expect(decorElementsService).toBeTruthy();
    });
});
