import { LineCalculationService } from './line-calculation.service';
import { DecorElementsService } from './decor-elements.service';
import { TestBed } from '@angular/core/testing';

let decorElementsService;

describe('DecorElementsService', function () {

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [DecorElementsService, LineCalculationService]
        });
        decorElementsService = TestBed.get(DecorElementsService);
    });

    it('should be created', () => {
        expect(decorElementsService).toBeTruthy();
    });
});
