import { TerrainGenerationService } from './terrain-generation.service';
import { RacingGameModule } from './racing-game.module';
import { TestBed, inject } from '@angular/core/testing';

describe('TerrainGenerationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RacingGameModule
            ],
            providers: [TerrainGenerationService]
        });
    });

    it('should be created', inject([TerrainGenerationService], (service: TerrainGenerationService) => {
        expect(service).toBeTruthy();
    }));
});
