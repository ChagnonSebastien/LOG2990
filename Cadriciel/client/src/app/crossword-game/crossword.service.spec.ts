import { TestBed } from '@angular/core/testing';
import {
    HttpModule,
    Response,
    ResponseOptions,
    XHRBackend,
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { CrosswordService } from './crossword.service';

let crosswordService: CrosswordService;
let mockBackend: MockBackend;

describe('#CrosswordService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
        crosswordService = TestBed.get(CrosswordService);
        mockBackend = TestBed.get(XHRBackend);
    });

    it('should construct', () => {
        expect(crosswordService).toBeDefined();
    });

    describe('getCrossword()', () => {
        it('should return an easy crossword', (done) => {
            const mockCrossword = {
                '_id': '59f23db6cfb7c4030284fe83',
                'difficulty': 'easy',
                'wordsWithIndex': [
                    { 'i': 0, 'j': 0, 'word': 'huh', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8f' },
                    { 'i': 0, 'j': 9, 'word': 'downstairs', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe8e' },
                    { 'i': 0, 'j': 5, 'word': 'aloud', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8d' },
                    { 'i': 2, 'j': 6, 'word': 'slow', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8c' },
                    { 'i': 2, 'j': 6, 'word': 'swelling', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe8b' },
                    { 'i': 4, 'j': 1, 'word': 'exposed', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8a' },
                    { 'i': 3, 'j': 4, 'word': 'donna', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe89' },
                    { 'i': 3, 'j': 2, 'word': 'oxford', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe88' },
                    { 'i': 8, 'j': 0, 'word': 'sad', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe87' },
                    { 'i': 6, 'j': 0, 'word': 'cash', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe86' },
                    { 'i': 9, 'j': 3, 'word': 'bingo', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe85' },
                    { 'i': 0, 'j': 0, 'word': 'hum', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe84' }
                ],
                'listOfWords': [
                    'huh', 'downstairs', 'aloud', 'slow', 'swelling', 'exposed', 'donna', 'oxford', 'sad', 'cash', 'bingo', 'hum'
                ],
                'crossword': [
                    ['h', 'u', 'h', '#', '#', 'a', 'l', 'o', 'u', 'd'],
                    ['u', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', 'o'],
                    ['m', ' ', '#', ' ', '#', '#', 's', 'l', 'o', 'w'],
                    ['#', ' ', 'o', ' ', 'd', ' ', 'w', ' ', ' ', 'n'],
                    ['#', 'e', 'x', 'p', 'o', 's', 'e', 'd', '#', 's'],
                    ['#', ' ', 'f', ' ', 'n', ' ', 'l', ' ', ' ', 't'],
                    ['c', ' ', 'o', ' ', 'n', ' ', 'l', ' ', ' ', 'a'],
                    ['a', ' ', 'r', ' ', 'a', ' ', 'i', ' ', ' ', 'i'],
                    ['s', 'a', 'd', '#', '#', ' ', 'n', ' ', ' ', 'r'],
                    ['h', ' ', '#', 'b', 'i', 'n', 'g', 'o', '#', 's']
                ]
            };

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockCrossword)
                })));
            });

            crosswordService.getCrossword('easy').then((crossword) => {
                expect(crossword).toBeDefined();
                expect(crossword.difficulty).toEqual('easy');
                expect(crossword.listOfWords.length).toBeGreaterThan(0);
                expect(crossword.crossword.length).toEqual(crossword.crossword[0].length);
                expect(crossword.wordsWithIndex.length).toEqual(crossword.listOfWords.length);
                done();
            });
        });

        it('should return a normal crossword', (done) => {
            const mockCrossword = {
                '_id': '59f52726c8d7f604c8c1e906',
                'difficulty': 'normal',
                'wordsWithIndex': [
                    { 'i': 0, 'j': 0, 'word': 'groin', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e916' },
                    { 'i': 0, 'j': 9, 'word': 'semolina', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e915' },
                    { 'i': 0, 'j': 6, 'word': 'fess', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e914' },
                    { 'i': 2, 'j': 3, 'word': 'statism', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e913' },
                    { 'i': 4, 'j': 0, 'word': 'beneficial', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e912' },
                    { 'i': 4, 'j': 6, 'word': 'crusty', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e911' },
                    { 'i': 4, 'j': 4, 'word': 'filly', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e910' },
                    { 'i': 0, 'j': 6, 'word': 'fit', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e90f' },
                    { 'i': 0, 'j': 4, 'word': 'net', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e90e' },
                    { 'i': 7, 'j': 1, 'word': 'kail', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e90d' },
                    { 'i': 7, 'j': 6, 'word': 'sora', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e90c' },
                    { 'i': 9, 'j': 5, 'word': 'cyan', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e90b' },
                    { 'i': 3, 'j': 0, 'word': 'obey', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e90a' },
                    { 'i': 6, 'j': 2, 'word': 'dark', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e909' },
                    { 'i': 9, 'j': 1, 'word': 'oka', 'horizontal': true, '_id': '59f52726c8d7f604c8c1e908' },
                    { 'i': 0, 'j': 1, 'word': 'ran', 'horizontal': false, '_id': '59f52726c8d7f604c8c1e907' }
                ],
                'listOfWords': [
                    'groin',
                    'semolina',
                    'fess',
                    'statism',
                    'beneficial',
                    'crusty',
                    'filly',
                    'fit',
                    'net',
                    'kail',
                    'sora',
                    'cyan',
                    'obey',
                    'dark',
                    'oka',
                    'ran'
                ],
                'crossword': [
                    ['g', 'r', 'o', 'i', 'n', '#', 'f', 'e', 's', 's'],
                    [' ', 'a', ' ', ' ', 'e', ' ', 'i', ' ', ' ', 'e'],
                    ['#', 'n', '#', 's', 't', 'a', 't', 'i', 's', 'm'],
                    ['o', '#', ' ', ' ', '#', ' ', '#', ' ', ' ', 'o'],
                    ['b', 'e', 'n', 'e', 'f', 'i', 'c', 'i', 'a', 'l'],
                    ['e', ' ', '#', ' ', 'i', ' ', 'r', ' ', ' ', 'i'],
                    ['y', ' ', 'd', ' ', 'l', ' ', 'u', ' ', ' ', 'n'],
                    ['#', 'k', 'a', 'i', 'l', '#', 's', 'o', 'r', 'a'],
                    [' ', ' ', 'r', ' ', 'y', ' ', 't', ' ', ' ', '#'],
                    ['#', 'o', 'k', 'a', '#', 'c', 'y', 'a', 'n', '#']
                ]
            };

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockCrossword)
                })));
            });

            crosswordService.getCrossword('normal').then((crossword) => {
                expect(crossword).toBeDefined();
                expect(crossword.difficulty).toEqual('normal');
                expect(crossword.listOfWords.length).toBeGreaterThan(0);
                expect(crossword.crossword.length).toEqual(crossword.crossword[0].length);
                expect(crossword.wordsWithIndex.length).toEqual(crossword.listOfWords.length);
                done();
            });
        });

        it('should return a hard crossword', (done) => {
            const mockCrossword = {
                '_id': '59e8fffdbedde9058848c0c7',
                'difficulty': 'hard',
                'wordsWithIndex': [
                    { 'i': 0, 'j': 0, 'word': 'sweatshop', 'horizontal': true, '_id': '59e8fffdbedde9058848c0d3' },
                    { 'i': 0, 'j': 8, 'word': 'panorama', 'horizontal': false, '_id': '59e8fffdbedde9058848c0d2' },
                    { 'i': 2, 'j': 0, 'word': 'quercetin', 'horizontal': true, '_id': '59e8fffdbedde9058848c0d1' },
                    { 'i': 2, 'j': 6, 'word': 'trait', 'horizontal': false, '_id': '59e8fffdbedde9058848c0d0' },
                    { 'i': 4, 'j': 2, 'word': 'agora', 'horizontal': true, '_id': '59e8fffdbedde9058848c0cf' },
                    { 'i': 7, 'j': 7, 'word': 'oak', 'horizontal': true, '_id': '59e8fffdbedde9058848c0ce' },
                    { 'i': 6, 'j': 3, 'word': 'sect', 'horizontal': true, '_id': '59e8fffdbedde9058848c0cd' },
                    { 'i': 2, 'j': 4, 'word': 'coopery', 'horizontal': false, '_id': '59e8fffdbedde9058848c0cc' },
                    { 'i': 2, 'j': 2, 'word': 'exam', 'horizontal': false, '_id': '59e8fffdbedde9058848c0cb' },
                    { 'i': 8, 'j': 0, 'word': 'proxy', 'horizontal': true, '_id': '59e8fffdbedde9058848c0ca' },
                    { 'i': 5, 'j': 0, 'word': 'cam', 'horizontal': true, '_id': '59e8fffdbedde9058848c0c9' },
                    { 'i': 7, 'j': 2, 'word': 'oof', 'horizontal': false, '_id': '59e8fffdbedde9058848c0c8' }
                ],
                'listOfWords': [
                    'sweatshop', 'panorama', 'quercetin', 'trait', 'agora', 'oak', 'sect', 'coopery', 'exam', 'proxy', 'cam', 'oof'
                ],
                'crossword': [
                    ['s', 'w', 'e', 'a', 't', 's', 'h', 'o', 'p', '#'],
                    [' ', ' ', '#', ' ', '#', ' ', '#', ' ', 'a', ' '],
                    ['q', 'u', 'e', 'r', 'c', 'e', 't', 'i', 'n', '#'],
                    [' ', ' ', 'x', ' ', 'o', ' ', 'r', ' ', 'o', ' '],
                    [' ', '#', 'a', 'g', 'o', 'r', 'a', '#', 'r', ' '],
                    ['c', 'a', 'm', '#', 'p', ' ', 'i', ' ', 'a', ' '],
                    [' ', ' ', '#', 's', 'e', 'c', 't', '#', 'm', ' '],
                    [' ', ' ', 'o', ' ', 'r', ' ', '#', 'o', 'a', 'k'],
                    ['p', 'r', 'o', 'x', 'y', '#', ' ', ' ', '#', ' '],
                    [' ', ' ', 'f', ' ', '#', ' ', ' ', ' ', ' ', ' ']
                ]
            };

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockCrossword)
                })));
            });

            crosswordService.getCrossword('hard').then((crossword) => {
                expect(crossword).toBeDefined();
                expect(crossword.difficulty).toEqual('hard');
                expect(crossword.listOfWords.length).toBeGreaterThan(0);
                expect(crossword.crossword.length).toEqual(crossword.crossword[0].length);
                expect(crossword.wordsWithIndex.length).toEqual(crossword.listOfWords.length);
                done();
            });
        });
    });
});
