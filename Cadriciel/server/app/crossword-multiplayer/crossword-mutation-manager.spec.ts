import { CrosswordMutationManager } from './crossword-mutation-manager';
import { expect } from 'chai';

import { CROSSWORD_GRID_SIZE } from '../config';
import { Word } from '../../../commun/word';
import { Crossword } from '../../../commun/crossword/crossword';

let mutationManager: CrosswordMutationManager;

describe('#CrosswordMutationManager', () => {
    before(() => {
        mutationManager = CrosswordMutationManager.getInstance();
    });

    it('should be a singleton', () => {
        expect(mutationManager).to.equal(CrosswordMutationManager.getInstance());
    });

    describe('newGame()', () => {
        const testId = 'testId';

        it('should manage a new game', () => {
            const crosswordGame = mutationManager.newGame(testId, 'easy');
            expect(crosswordGame.crossword.length).to.equal(CROSSWORD_GRID_SIZE);
            expect(crosswordGame.difficulty).to.equal('easy');
            expect(crosswordGame.listOfWords.length)
                .to.equal(crosswordGame.wordsWithIndex.length);
            expect(mutationManager.getNextMutation(testId))
                .to.equal(crosswordGame);
        });

        it('should initialize the found words of the game to be empty', () => {
            expect(mutationManager['foundWords'].get(testId).length).to.equal(0);
        });
    });

    describe('foundWord()', () => {

        it('should add the word found to foundWords', () => {
            const testId = 'testId';
            const crossword = mutationManager.getNextMutation(testId);
            const foundWord = crossword.wordsWithIndex[0];

            mutationManager.foundWord(testId, foundWord);

            expect(mutationManager['foundWords'].get(testId).length).to.equal(1);
            expect(
                mutationManager['foundWords']
                    .get(testId)
                    .filter((word) => {
                        return word === foundWord;
                    }).length
            ).to.equal(1);
        });

        it('should generate a mutated crossword that contains the words found', () => {
            const testId = 'testId';
            const crossword = mutationManager.getNextMutation(testId);
            const foundWord = crossword.wordsWithIndex[0];

            mutationManager.foundWord(testId, foundWord);

            const mutatedCrossword = mutationManager.getNextMutation(testId);
            expect(mutatedCrossword.listOfWords.filter((word) => {
                return foundWord.word === word;
            }).length).to.equal(1);

            expect(mutatedCrossword.wordsWithIndex.filter((word) => {
                return foundWord.word === word.word;
            }).length).to.equal(1);
        });
    });

    describe('getNextMutation()', () => {
        it('should return the next crossword mutation for an ongoing crossword game', () => {
            const crossword = mutationManager.getNextMutation('testId');
            expect(crossword.difficulty).to.equal('easy');
            expect(crossword.crossword.length).to.equal(CROSSWORD_GRID_SIZE);
            expect(crossword.listOfWords.length).to.be.at.least(0);
            expect(crossword.wordsWithIndex.length)
                .to.equal(crossword.listOfWords.length);
        });

        it('should return undefined for a crossword game that does not exist', () => {
            expect(mutationManager.getNextMutation('doesNotExistId')).to.be.undefined;
        });
    });
});
