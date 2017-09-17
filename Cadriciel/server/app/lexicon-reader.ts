import * as fs from 'fs';
import * as request from 'request';

export class LexiconReader {

    readWords(file: string): string[] {
        let content: string[];
        content = fs.readFileSync(file, 'utf8').split('\r\n');
        return content;
     }


    readWordsOfLength(file:string, wordLength: number): string[] {
         let lexicon: string[] = this.readWords(file);
         let wordsOfLength: string[] = [];

         for(let i of lexicon) {
             if(i.length == wordLength)
                wordsOfLength.push(i);
         }

         return wordsOfLength;
     }

     getWordsWithChar(file: string, character: string, position: number) {
         let lexicon: string[] = this.readWords(file);
         let wordsWithChar: string[] = [];

         for(let i of lexicon) {
             if(i.charAt(position) == character) {
                 wordsWithChar.push(i);
             }
         }

         return wordsWithChar;
     }

   /* public async getWordFrequency(word:string): number {
        let uri = 'http://api.wordnik.com:80/v4/word.json';
        let options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
        var wordFrequency: number;

        request(`${uri}/${word}/${options}`, (error, response, body) => {
            if (error) {
                throw error;
            }
            if (body == "[]") {
                wordFrequency = 0;
            } else {
                console.log("Entered else");
                //body = JSON.parse(body);
                //wordFrequency = Number(body[0].totalCount);
                wordFrequency = 666;
                return wordFrequency;
            }
        });
     }*/
}




