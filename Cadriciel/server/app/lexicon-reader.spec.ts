import {assert} from 'chai';
import { LexiconReader } from "./lexicon-reader";

describe('LexiconReader', ()=>{
    let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
    let lexiconReader: LexiconReader = new LexiconReader();

    it("Should return the first word of the lexicon ", ()=>{
        let firstWord:string = lexiconReader.readWords(lexiconFilePath)[0];

        assert(firstWord == 'aalii');
    });

    it("Should return the last word of the lexicon ", ()=>{
        let words: string[] = lexiconReader.readWords(lexiconFilePath);
        let lastWord: string = words[words.length - 1];

        assert(lastWord == 'zymotic');
    });

    it("Should return the word in the middle of the lexicon ", ()=>{
        let words: string[] = lexiconReader.readWords(lexiconFilePath);
        let middleWord: string = words[words.length/2];

        assert(middleWord == 'jocosity');
    });

    it("Should not return an empty array as the lexicon ", ()=>{
        let words: string[] = lexiconReader.readWords(lexiconFilePath);

        assert(words != []);
    });

    
});