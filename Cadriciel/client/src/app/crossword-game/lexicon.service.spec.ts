import { TestBed } from '@angular/core/testing';
import {
    HttpModule,
    Response,
    ResponseOptions,
    XHRBackend,
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LexiconService } from './lexicon.service';

const WORDS = ['word1', 'word2', 'word3', 'word4', 'word5'];

describe('#LexiconService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                LexiconService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
    });

    describe('getWordDefinitions()', () => {
        it('should return an Observable<Array<string>>', () => {
            const lexiconService = TestBed.get(LexiconService);

            const mockResponse = ['definition 1', 'definition 2'];
            const mockBackend = TestBed.get(XHRBackend);
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });

            lexiconService.getWordDefinitions(WORDS).subscribe((definitions) => {
                expect(definitions.length).toBe(5);
                definitions.map((definition) => {
                    expect(definition).toEqual('definition 1');
                });
            });
        });
    });
});
