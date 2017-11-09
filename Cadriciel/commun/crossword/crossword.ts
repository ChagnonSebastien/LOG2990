import { Word } from '../word';

export class Crossword {
    public id: string;
    public difficulty: string;
    public listOfWords: Array<string>;
    public crossword: Array<Array<string>>;
    public wordsWithIndex: Array<Word>;
}
