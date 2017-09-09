import * as fs from 'fs';

export class FileReader {
    public filepath: string = '../server/englishWords.txt';

    readfile(file: string): string[] {
        let content:string[] = [];
        content = fs.readFileSync(this.filepath, 'utf8').split('\r\n');
        
        return content;
     }

}




