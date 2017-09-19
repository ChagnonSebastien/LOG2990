import {assert} from 'chai';
import { LexiconReader } from "./lexicon-reader";

describe('LexiconReader', ()=>{
    let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
    let lexiconReader: LexiconReader = new LexiconReader();

    // readWords method

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

    // readWordsOfLength method

    it("Should return no words for words of length of 0", ()=>{
        let wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, 0);

        assert(wordsOfLength.length == 0);
    });

    it("Should return no words for words of length of 100", ()=>{
        let wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, 100);

        assert(wordsOfLength.length == 0);
    });

    it("Should return a string containing words when length is 5", ()=>{
        let wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, 5);

        assert(wordsOfLength.length != 0);
    });

    // getWordsWithChar

    it("Should return empty array when searching for words with a at position 100", ()=>{
        let wordsWithChar: string[] = lexiconReader.getWordsWithChar(lexiconFilePath, 'a', 100);

        assert(wordsWithChar.length == 0);
    });

    it("Should return an array of words with a at position 0", ()=>{
        let wordsWithChar: string[] = lexiconReader.getWordsWithChar(lexiconFilePath, 'a', 0);

        assert(wordsWithChar[0][0] == 'a');
    });

    // getWordsMatchingPattern
    
});