import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { CrosswordGameInfoService } from './crossword-game-info.service';

describe('CrosswordGameInfoService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [CrosswordGameInfoService]
        });
    });

    it('Should be created', inject([CrosswordGameInfoService ], (service: CrosswordGameInfoService ) => {
        service.setCollection('crosswords_tests');
        expect(service).toBeTruthy();
    }));


    it('Should get crossword of level easy', inject([CrosswordGameInfoService ], (service: CrosswordGameInfoService ) => {
        service.setCollection('crosswords_tests');
        service.getCrossword('easy').then(res => {
            expect(res.difficulty).toMatch('easy');
        });
    }));

    it('Should get crossword of level normal', inject([CrosswordGameInfoService ], (service: CrosswordGameInfoService ) => {
        service.setCollection('crosswords_tests');
        service.getCrossword('normal').then(res => {
            expect(res.difficulty).toMatch('normal');
        });
    }));

    it('Should get crossword of level hard', inject([CrosswordGameInfoService ], (service: CrosswordGameInfoService ) => {
        service.setCollection('crosswords_tests');
        service.getCrossword('hard').then(res => {
            expect(res.difficulty).toMatch('hard');
        });
    }));

});
