import { Word } from '../../../commun/word';

export class CrosswordDB {
    public id: string;
    public difficulty: string;
    public listOfWords: Array<string>;
    public crossword: Array<Array<string>>;
    public wordsWithIndex: Array<Word>;
}
