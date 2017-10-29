import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { CrosswordService } from './crossword.service';

describe('CrosswordService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [CrosswordService]
        });
    });
/*
    it('Should be created', inject([CrosswordService], (service: CrosswordService) => {
        service.setCollection('crosswords_tests');
        expect(service).toBeTruthy();
    }));


    it('Should get crossword of level easy', inject([CrosswordService], (service: CrosswordService) => {
        service.setCollection('crosswords_tests');
        service.getCrossword('easy').then(res => {
            expect(res.difficulty).toMatch('easy');
        });
    }));

    it('Should get crossword of level normal', inject([CrosswordService], (service: CrosswordService) => {
        service.setCollection('crosswords_tests');
        service.getCrossword('normal').then(res => {
            expect(res.difficulty).toMatch('normal');
        });
    }));

    it('Should get crossword of level hard', inject([CrosswordService], (service: CrosswordService) => {
        service.setCollection('crosswords_tests');
        service.getCrossword('hard').then(res => {
            expect(res.difficulty).toMatch('hard');
        });
    }));*/

});
