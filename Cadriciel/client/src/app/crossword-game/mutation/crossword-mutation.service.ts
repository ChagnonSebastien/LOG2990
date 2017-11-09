import { Injectable } from '@angular/core';

import { CrosswordGridService } from '../grid/crossword-grid.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';

import { CrosswordSquare } from '../shared-classes/crossword-square';
import { Hint } from '../shared-classes/hint';

@Injectable()
export class CrosswordMutationService {
    public newGrid: CrosswordSquare[][];
    public newHints: Array<Hint>;

    constructor(
        private gridService: CrosswordGridService,
        private hintService: CrosswordHintsService
    ) { }
}
