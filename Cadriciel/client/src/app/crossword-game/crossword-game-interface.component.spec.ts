import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrosswordGameInterfaceComponent } from './crossword-game-interface.component';
import { HttpModule } from '@angular/http';
import {LexiconService} from './lexicon.service';
import {CrosswordGameInfoService} from './crossword-game-info.service';
import { CrosswordGameInformationComponent} from './crossword-game-information/crossword-game-information.component';

describe('CrosswordGameInterfaceComponent', () => {
    let component: CrosswordGameInterfaceComponent;
    let fixture: ComponentFixture<CrosswordGameInterfaceComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordGameInterfaceComponent, CrosswordGameInformationComponent],
            providers: [LexiconService, CrosswordGameInfoService],
            imports: [HttpModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameInterfaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.setRawCrossword();
        component.listOfWords = ['grip', 'gang', 'satellite', 'minimum', 'guarantee', 'bangles', 'holy', 'tram', 'bible' ];
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should fill word indexes', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {

       const wordsIndexes: {word: string, indexes: Index[], position: string, hint: string}[] =
       [{word: 'grip', indexes: [{i: 2, j: 6}, {i: 2, j: 7}, {i: 2, j: 8}, {i: 2, j: 9}], position: 'horizontal',
        hint: 'The pressure or strength of such a grasp:  a wrestler with an unmatched grip. '},
       {word: 'gang', indexes: [{i: 3, j: 0}, {i: 3, j: 1}, {i: 3, j: 2},
       {i: 3, j: 3}], position: 'horizontal', hint: 'A group of adolescents who band together, especially a group of delinquents. '},
       {word: 'satellite', indexes: [{i: 5, j: 0}, {i: 5, j: 1}, {i: 5, j: 2}, {i: 5, j: 3}, {i: 5, j: 4},
       {i: 5, j: 5}, {i: 5, j: 6}, {i: 5, j: 7}, {i: 5, j: 8}], position: 'horizontal',
        hint: 'Aerospace   An object launched to orbit Earth or another celestial body. '},
       {word: 'minimum', indexes: [{i: 8, j: 3}, {i: 8, j: 4}, {i: 8, j: 5}, {i: 8, j: 6}, {i: 8, j: 7}, {i: 8, j: 8}, {i: 8, j: 9}],
       position: 'horizontal', hint: 'The lowest degree or amount reached or recorded; the lower limit of variation. '},
       {word: 'guarantee', indexes: [{i: 1, j: 1}, {i: 2, j: 1}, {i: 3, j: 1}, {i: 4, j: 1},
        {i: 5, j: 1}, {i: 6, j: 1}, {i: 7, j: 1}, {i: 8, j: 1}, {i: 9, j: 1}],
       position: 'vertical', hint:
       'A promise or an assurance, especially one given in writing, that attests to the quality or durability of a product or service. '},
       {word: 'bangles', indexes: [{i: 0, j: 3}, {i: 1, j: 3}, {i: 2, j: 3}, {i: 3, j: 3}, {i: 4, j: 3}, {i: 5, j: 3}, {i: 6, j: 3}],
       position: 'vertical', hint: 'Plural form of bangle '},
       {word: 'holy', indexes: [{i: 3, j: 5}, {i: 4, j: 5}, {i: 5, j: 5}, {i: 6, j: 5}],
       position: 'vertical', hint: 'Regarded with or worthy of worship or veneration; revered:  a holy book. '},
       {word: 'tram', indexes: [{i: 5, j: 7}, {i: 6, j: 7}, {i: 7, j: 7}, {i: 8, j: 7}],
       position: 'vertical', hint: 'Chiefly British   A streetcar line. '},
       {word: 'bible', indexes: [{i: 1, j: 8}, {i: 2, j: 8}, {i: 3, j: 8}, {i: 4, j: 8}, {i: 5, j: 8}],
       position: 'vertical', hint: 'A holystone. '}];

       expect(component.wordsIndexes).toEqual(wordsIndexes);

     });
   }));



    it('should activate the word indexes when its hint is clicked', () => {
        const activeIndexes: Index[] = [{i: 0, j: 0}, {i: 1, j: 0}, {i: 2, j: 0}];
        const event: Event = new Event('click');
        component.handleClick(event, activeIndexes);
        expect(component.activeIndexes).toEqual(activeIndexes);

    });

    it('should return that a active index is active', () => {
        const activeIndexes: Index[] = [{i: 0, j: 0}];
        const event: Event = new Event('click');
        component.handleClick(event, activeIndexes);
        expect(component.isActive(0, 0)).toBeTruthy();
        });

     it('should cancel the selection of the word when clicking outside the grid', () => {
        const activeIndexes: Index[] = [{i: 0, j: 0}];
        const event: Event = new Event('click');
        component.handleClick(event, activeIndexes);
        component.cancelSelection(event);
        expect(component.activeIndexes.length).toEqual(0);
    });

    it('should return the first column of the raw crossword', () => {
        expect(component.getColumn(0)).toEqual(['0', '0', '0', 'g', '0', 's', '0', '0', '0', '0']);
    });

    it('should prevent the user from entering something else than a letter character', () => {
        const event: any = document.createEvent('CustomEvent');
        event.which = 48;
        event.initEvent('keypress', true, true);
        component.filterInput(event, 0, 0);
        expect(component.correctIndexes.length).toEqual(0);
    });

    it('should delete the correct index when the backspace key is pressed', () => {
        const event: any = document.createEvent('CustomEvent');
        event.which = 103;
        event.initEvent('keypress', true, true);
        component.filterInput(event, 0, 3);
        event.which = 8;
        event.initEvent('keydown', true, true);
        component.handleDelete(event, 0, 0);
        expect(component.correctIndexes.length).toEqual(0);
    });

    it('should return true using the word postion  when all the correct letters of a word are entered', () => {
        const event: any = document.createEvent('CustomEvent');

        event.which = 103; // g
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 0);

        event.which = 97; // a
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 1);

        event.which = 110; // n
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 2);

        event.which = 103; // g
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 3);

        expect(component.checkWordFound(1)).toBeTruthy();
    });

    it('should set the selected k', () => {
        component.selectK(0);
        expect(component.kSelected).toEqual(0);
    });

    it('should return true when a word in the crossword is left to right', () => {
        expect(component.checkHorizontal(component.wordsIndexes[0].position)).toBeTruthy();
    });

    it('should return true when a word in the crossword is top to bottom', () => {
        expect(component.checkVertical(component.wordsIndexes[7].position)).toBeTruthy();
    });

    it('should return true using the word index when all the correct letters of a word are entered', () => {
        const event: any = document.createEvent('CustomEvent');

        event.which = 103; // g
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 0);

        event.which = 97; // a
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 1);

        event.which = 110; // n
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 2);

        event.which = 103; // g
        event.initEvent('keypress', true, true);
        component.filterInput(event, 3, 3);

        expect(component.checkWordWithIndex(3, 0)).toBeTruthy();
    });

});


interface Index {
    i: number;
    j: number;
}



