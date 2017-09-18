import * as fs from 'fs';

export class LexiconReader {

    readWords(file: string): string[] {
        let content: string[];
        content = fs.readFileSync(file, 'utf8').split('\r\n');
        
        return content;
     }

}