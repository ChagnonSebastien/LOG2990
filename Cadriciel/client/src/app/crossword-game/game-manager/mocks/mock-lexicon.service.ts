import { Observable } from 'rxjs/Observable';

import { LexiconService } from '../../lexicon/lexicon.service';

export class MockLexiconService extends LexiconService {
    public getWordDefinitions(words: Array<string>): Observable<any> {
        return Observable.of(words);
    }
}
