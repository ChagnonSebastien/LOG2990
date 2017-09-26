import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword-game-interface',
    templateUrl: './crossword-game-interface.component.html',
    styleUrls: ['./crossword-game-interface.component.css']
})
export class CrosswordGameInterfaceComponent implements OnInit {
    public rawCrossword: [[String]] = [['0', '0', '0', '0', 'p', '0', '0', '0', '0', '0'],
                                      ['0', '0', '0', '0', 'u', '0', '0', '0', '0', '0'],
                                      ['0', '0', '0', '0', 'n', '0', 'b', '0', '0', '0'],
                                      ['0', 'h', 'y', 'd', 'e', 'r', 'a', 'b', 'a', 'd'],
                                      ['0', '0', '0', '0', '0', '0', 'n', '0', '0', 'e'],
                                      ['0', '0', '0', '0', '0', '0', 'g', '0', '0', 'l'],
                                      ['0', '0', 'm', 'u', 'm', 'b', 'a', 'i', '0', 'h'],
                                      ['0', '0', '0', '0', '0', '0', 'l', '0', '0', 'i'],
                                      ['0', '0', '0', '0', '0', '0', 'o', '0', '0', '0'],
                                      ['k', 'a', 's', 'h', 'm', 'i', 'r', '0', '0', '0'],
                                      ['0', '0', '0', '0', '0', '0', 'e', '0', '0', '0']];

    // public list0fWords: [String] = ['pune', 'bangalore', 'hyderabad', 'delhi', 'mumbai', 'kashmir' ];
    // public indices: [String] = ['Education Hub', 'Information Technology Hub', 'Cultural Hub', 'Capital of India',
    // 'India financial capital', 'Saffron region'];

    public listOfWordsAndHints: [{word: String, indice: String}] = [{word: 'pune', indice : 'Education Hub' },
    {word: 'banglore', indice : 'Information Technology Hub'}, {word: 'hyderabad', indice : 'Cultural Hub'},
    {word: 'delhi', indice : 'Capital of India'}, {word: 'mumbai', indice : 'India financial capital'},
    {word: 'kashmir', indice : 'Saffron region'} ];
    public wordsIndexes: [[String, {i: number, j: number}]];
    public gridSqaures: [{i: number, j: number, isActive: boolean}];
    public activeSquareCoord: {i: number, j: number};
    public handleClick(i, j) {
          this.activeSquareCoord = {
            i: i,
            j: j
        };
        var indexes :{i:number,j:number}[]= this.findWordIndexes('kashmir',this.rawCrossword[9],9,true);
        console.log(indexes);
    }
    public isActive(i, j): boolean {
       
        return (i === this.activeSquareCoord.i && j === this.activeSquareCoord.j);
     }

     public(fillWordsIndexes){
        
     }

     public findWordIndexes(word:string,gridPart:[String], columnOrRowIndex:number,row:boolean){
        
        var indexes :{i:number,j:number}[]=[];
        //indexes.push({i:1,j:1});
        
        for(var k = 0 ; k < gridPart.length && indexes.length !=word.length ;k++ )
         {  //console.log(gridPart[k]);
            if(gridPart[k]==word[k])
            {   
                if(row)
                indexes.push({i:columnOrRowIndex,j:k})
                   //indexes[k]=({i:columnOrRowIndex,j:k});
                else 
                indexes.push({i:k,j:columnOrRowIndex});
            }
            else 
                {
                
                //console.log(indexes);
                indexes.splice(0,indexes.length);}
         }
        // console.log(indexes);
         return(indexes);
     }

    constructor() { }
    public ngOnInit() {
        // on init set the active as none of the grid squares
        this.activeSquareCoord = {
            i: -1,
            j: -1
        };
    }

}
