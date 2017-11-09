import { TestBed, inject } from '@angular/core/testing';
import { RenderService } from './render.service';

let renderService: RenderService;

describe('Draw Track Render', () => {

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
        renderService = TestBed.get(RenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

    it('Clear intersections, segments', () => {
        renderService.clear();
        expect(renderService['intersections']).toEqual([]);
        expect(renderService['segments']).toEqual([]);
        expect(renderService.trackClosed).toEqual(false);
    });
});
