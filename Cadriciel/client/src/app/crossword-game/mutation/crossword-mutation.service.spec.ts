import { TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { CrosswordMutationService } from './crossword-mutation.service';
import { CrosswordGridService } from '../grid/crossword-grid.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';
import { CrosswordWordsService } from '../words/crossword-words.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordPointsService } from '../points/crossword-points.service';
import { CrosswordKeyboardService } from '../keyboard/crossword-keyboard.service';
import { LexiconService } from '../lexicon/lexicon.service';
import { CrosswordService } from '../crossword/crossword.service';
import { CrosswordSquare } from '../shared-classes/crossword-square';

import { CROSSWORD_GRID_SIZE } from '../../../../../server/app/config';
import { Crossword } from '../../../../../commun/crossword/crossword';

let mutationService: CrosswordMutationService;
let wordsService: CrosswordWordsService;
let hintsService: CrosswordHintsService;
let gridService: CrosswordGridService;
let pointsService: CrosswordPointsService;
let crosswordService: CrosswordService;

fdescribe('#CrosswordMutationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordMutationService,
                CrosswordGridService,
                CrosswordHintsService,
                CrosswordWordsService,
                CrosswordConfigurationService,
                CrosswordPointsService,
                CrosswordKeyboardService,
                LexiconService,
                CrosswordService
            ]
        });
        mutationService = TestBed.get(CrosswordMutationService);
        wordsService = TestBed.get(CrosswordWordsService);
        gridService = TestBed.get(CrosswordGridService);
        hintsService = TestBed.get(CrosswordHintsService);
        pointsService = TestBed.get(CrosswordPointsService);
        crosswordService = TestBed.get(CrosswordService);
    });

    it('should construct', () => {
        expect(mutationService).toBeDefined();
    });

    describe('mutate()', () => {
        it('should mutate the grid', () => {
            mutationService.mutate();
            expect(gridService.grid.length).toEqual(CROSSWORD_GRID_SIZE);
        });

        it('should mutate the words', () => {
            mutationService.mutate();
            expect(wordsService.numberOfWords()).toEqual(0);
        });

        it('should mutate the hints', () => {
            mutationService.mutate();
            expect(hintsService.hints.length).toEqual(0);
            expect(hintsService.selectedWord).toBeUndefined();
            expect(hintsService.opponentSelectedWord).toBeUndefined();
        });

        it('should update the mutation', () => {
            spyOn(mutationService, 'updateMutation');
            mutationService.mutate();
            expect(mutationService.updateMutation).toHaveBeenCalled();
        });
    });

    describe('updateMutation', () => {
        it('should update the mutation with found words', () => {
            spyOn(pointsService, 'getFoundWords');

            mutationService.updateMutation();

            expect(pointsService.getFoundWords).toHaveBeenCalled();
        });
    });

    describe('updateMultiplayerMutation()', () => {
        it('should update the mutation in multiplayer mode', async () => {
            const mockCrossword = new Crossword();
            await mutationService.updateMultiplayerMutation(mockCrossword);
            expect(mutationService.newGrid.length).toEqual(mockCrossword.crossword.length);
            expect(mutationService.newHints.length).toEqual(mockCrossword.wordsWithIndex.length);
        });
    });

    describe('mutateMultiplayer()', () => {
        it('should mutate the grid', () => {
            mutationService.mutate();
            expect(gridService.grid.length).toEqual(CROSSWORD_GRID_SIZE);
        });

        it('should mutate the words', () => {
            mutationService.mutate();
            expect(wordsService.numberOfWords()).toEqual(0);
        });

        it('should mutate the hints', () => {
            mutationService.mutate();
            expect(hintsService.hints.length).toEqual(0);
            expect(hintsService.selectedWord).toBeUndefined();
            expect(hintsService.opponentSelectedWord).toBeUndefined();
        });
    });
});
