import * as fs from 'fs';

export class FileReader {
    public filepath: string = '../server/englishWords.txt';

    readfile(file: string): string[] {
        let content:string[];

        fs.readFile(file, "utf8", function read(err, data) {
            if (err) {
                throw err;
            }
            content = data.split('\r');

            console.log(content);
        });

        return content;
     }



}




