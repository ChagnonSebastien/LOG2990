import * as fs from 'fs';

export class FileReader {
    public filepath: string = '../server/englishWords.txt';

    readfile(file: string): string[] {
<<<<<<< HEAD
        let content:string[] = [];
        content = fs.readFileSync(this.filepath, 'utf8').split('\r\n');
        
        return content;
     }

=======
        let content:string[];

        fs.readFile(file, "utf8", function read(err, data) {
            if (err) {
                throw err;
            }
            content = data.split('\r\n');

            console.log(content);
        });

        return content;
     }



>>>>>>> server able to read lexicon and store in list
}




