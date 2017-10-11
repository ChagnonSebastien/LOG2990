import { ObstacleService } from './obstacle.service';
import { AdminModule } from './../../admin/admin.module';
import { TestBed, inject } from '@angular/core/testing';

describe('ObstacleService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AdminModule
            ],
            providers: [ObstacleService]
        });
    });

    it('should be created', inject([ObstacleService], (service: ObstacleService) => {
        expect(service).toBeTruthy();
    }));

});
