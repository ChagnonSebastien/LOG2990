import * as fs from 'fs';

export class LexiconReader {

    readWords(file: string): string[] {
        let content: string[];
        content = fs.readFileSync(file, 'utf8').split('\r\n');
        
        return content;
     }

     readJson(file: string): string[] {
         let jsonContent: string[];
         jsonContent = JSON.parse(fs.readFileSync(file, 'utf8'));

         return jsonContent;
     }

     readWordsOfLengthJson(file:string, wordLength: number): string[] {
         let jsonContent: string[];
         jsonContent = JSON.parse(fs.readFileSync(file, 'utf8'));
         let wordsOfLength: string[] = [];

         for(let i of jsonContent) {
             if(i.length == wordLength)
                wordsOfLength.push(i);
         }

         return wordsOfLength;
     }

     getWordsContainingLetter(listOfWords:string[], char: string, position: number): string[]{
        let wordsContainingLetter: string[] = [];

        for(let i of listOfWords) {
            if(i.charAt(position) == char)
                wordsContainingLetter.push(i);
        }

        return wordsContainingLetter;
     }

}




