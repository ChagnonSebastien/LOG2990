import { Word } from '../crossword';

export class CrosswordDB {
    public _id: string;
    public difficulty: string;
    public listOfWords: Array<string>;
    public crossword: Array<Array<string>>;
    public wordsWithIndex: Array<Word>;
}
