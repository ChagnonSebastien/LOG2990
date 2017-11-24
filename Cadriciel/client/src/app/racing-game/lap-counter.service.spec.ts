import { LapCounterService } from './lap-counter.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';

let lapCounterService: LapCounterService;

fdescribe('LapCounterService', function () {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [LapCounterService]
        });
        lapCounterService = TestBed.get(LapCounterService);
    });

    it('should be created', () => {
        expect(lapCounterService).toBeTruthy();
    });

    it('should calculate distance between (0,0) and (1,1)', () => {
        const vectorFrom = new THREE.Vector2(0 , 0);
        const vectorTo = new THREE.Vector2(0, 1);
        expect(lapCounterService.calculateDistanceFromIntersection(vectorFrom, vectorTo)).toEqual(1);
    });
});
