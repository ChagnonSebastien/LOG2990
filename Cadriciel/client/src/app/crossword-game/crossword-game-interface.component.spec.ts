import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrosswordGameInterfaceComponent } from './crossword-game-interface.component';

describe('CrosswordGameInterfaceComponent', () => {
    let component: CrosswordGameInterfaceComponent;
    let fixture: ComponentFixture<CrosswordGameInterfaceComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordGameInterfaceComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameInterfaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        component.rawCrossword = [['c', '0', '0', '0', 'p', '0', 'c', 'a', 't', 'e'],
        ['a', '0', '0', '0', 'u', '0', '0', '0', '0', '0'],
        ['t', '0', '0', '0', 'n', '0', 'b', '0', '0', '0'],
        ['0', 'h', 'y', 'd', 'e', 'r', 'a', 'b', 'a', 'd'],
        ['0', '0', '0', '0', '0', '0', 'n', '0', '0', 'e'],
        ['0', '0', '0', '0', '0', '0', 'g', '0', '0', 'l'],
        ['0', '0', 'm', 'u', 'm', 'b', 'a', 'i', '0', 'h'],
        ['0', '0', '0', '0', '0', '0', 'l', '0', '0', 'i'],
        ['0', '0', '0', '0', '0', '0', 'o', '0', '0', '0'],
        ['k', 'a', 's', 'h', 'm', 'i', 'r', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', 'e', '0', '0', '0']];

        component.listOfWordsAndHints = [{word: 'pune', indice : 'Education Hub' },
        {word: 'bangalore', indice : 'Information Technology Hub'}, {word: 'hyderabad', indice : 'Cultural Hub'},
        {word: 'delhi', indice : 'Capital of India'}, {word: 'mumbai', indice : 'India financial capital'},
        {word: 'kashmir', indice : 'Saffron region'}, {word: 'cate', indice : 'A choice of dainty food'},
        {word: 'cat', indice : 'A small domesticated mammal kept as a pet '} ];
        expect(component).toBeTruthy();
    });

    it('should fill word indexes', () => {

       const wordsIndexes: {word: string, indexes: Index[], position: string, hint: string}[] =
       [{word: 'pune', indexes: [{i: 0, j: 4}, {i: 1, j: 4}, {i: 2, j: 4}, {i: 3, j: 4}], position: 'vertical', hint: 'Education Hub'},
       {word: 'bangalore', indexes: [{i: 2, j: 6}, {i: 3, j: 6}, {i: 4, j: 6},
       {i: 5, j: 6}, {i: 6, j: 6}, {i: 7, j: 6}, {i: 8, j: 6}, {i: 9, j: 6},
       {i: 10, j: 6}], position: 'vertical', hint: 'Information Technology Hub'},
       {word: 'hyderabad', indexes: [{i: 3, j: 1}, {i: 3, j: 2}, {i: 3, j: 3}, {i: 3, j: 4}, {i: 3, j: 5},
       {i: 3, j: 6}, {i: 3, j: 7}, {i: 3, j: 8}, {i: 3, j: 9}], position: 'horizontal', hint: 'Cultural Hub'},
       {word: 'delhi', indexes: [{i: 3, j: 9}, {i: 4, j: 9}, {i: 5, j: 9}, {i: 6, j: 9}, {i: 7, j: 9}],
       position: 'vertical', hint: 'Capital of India'},
       {word: 'mumbai', indexes: [{i: 6, j: 2}, {i: 6, j: 3}, {i: 6, j: 4}, {i: 6, j: 5}, {i: 6, j: 6}, {i: 6, j: 7}],
       position: 'horizontal', hint: 'India financial capital'},
       {word: 'kashmir', indexes: [{i: 9, j: 0}, {i: 9, j: 1}, {i: 9, j: 2}, {i: 9, j: 3}, {i: 9, j: 4}, {i: 9, j: 5}, {i: 9, j: 6}],
       position: 'horizontal', hint: 'Saffron region'},
       {word: 'cate', indexes: [{i: 0, j: 6}, {i: 0, j: 7}, {i: 0, j: 8}, {i: 0, j: 9}],
       position: 'horizontal', hint: 'A choice of dainty food'},
       {word: 'cat', indexes: [{i: 0, j: 0}, {i: 1, j: 0}, {i: 2, j: 0}],
       position: 'vertical', hint: 'A small domesticated mammal kept as a pet '}];
       expect(component.wordsIndexes).toEqual(wordsIndexes);
    });

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
        expect(component.getColumn(0)).toEqual(['c', 'a', 't', '0', '0', '0', '0', '0', '0', 'k', '0']);
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
        event.which = 99;
        event.initEvent('keypress', true, true);
        component.filterInput(event, 0, 0);
        event.which = 8;
        event.initEvent('keydown', true, true);
        component.handleDelete(event, 0, 0);
        expect(component.correctIndexes.length).toEqual(0);
    });

    it('should return true using the word postion  when all the correct letters of a word are entered', () => {
        const event: any = document.createEvent('CustomEvent');

        event.which = 99; // c
        event.initEvent('keypress', true, true);
        component.filterInput(event, 0, 0);

        event.which = 97; // a
        event.initEvent('keypress', true, true);
        component.filterInput(event, 1, 0);

        event.which = 116; // t
        event.initEvent('keypress', true, true);
        component.filterInput(event, 2, 0);

        expect(component.checkWordFound(7)).toBeTruthy();
    });

    it('should set the selected k', () => {
        component.selectK(0);
        expect(component.kSelected).toEqual(0);
    });

    it('should return true when a word in the crossword is left to right', () => {
        expect(component.checkHorizontal(component.wordsIndexes[6].position)).toBeTruthy();
    });

    it('should return true when a word in the crossword is top to bottom', () => {
        expect(component.checkVertical(component.wordsIndexes[7].position)).toBeTruthy();
    });

    it('should return true using the word index when all the correct letters of a word are entered', () => {
        const event: any = document.createEvent('CustomEvent');

        event.which = 99; // c
        event.initEvent('keypress', true, true);
        component.filterInput(event, 0, 0);

        event.which = 97; // a
        event.initEvent('keypress', true, true);
        component.filterInput(event, 1, 0);

        event.which = 116; // t
        event.initEvent('keypress', true, true);
        component.filterInput(event, 2, 0);

        expect(component.checkWordWithIndex(1, 0)).toBeTruthy();
    });

});


interface Index {
    i: number;
    j: number;
}



