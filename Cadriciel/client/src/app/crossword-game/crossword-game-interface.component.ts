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

    public list0fWords : [String];
    public wordsIndex:[[String,{i:number,j:number}]];
    public gridSqaures : [{i:number,j:number,isActive:boolean}];
    public activeSquareCoord : {i:number,j:number};
    
    
    public handleClick(i,j){
        console.log("hello");
        console.log(this.activeSquareCoord.i);
          this.activeSquareCoord={
            i:i,
            j:j
        };
    }
    public isActive(i,j):boolean{
       // console.log(this.activeSquareCoord.i);
        return (i == this.activeSquareCoord.i && j ==this.activeSquareCoord)
       
     }


    constructor() { }
    public ngOnInit() {

        this.activeSquareCoord={
            i:-1,
            j:-1
        };

        
    }

}
