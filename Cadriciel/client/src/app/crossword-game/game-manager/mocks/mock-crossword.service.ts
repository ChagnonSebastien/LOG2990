import { CrosswordService } from '../../crossword/crossword.service';

export class MockCrosswordService extends CrosswordService {
    public getCrossword(level: string) {
        return Promise.resolve({
            '_id': '59f23db6cfb7c4030284fe83',
            'difficulty': 'easy',
            'wordsWithIndex': [
                { 'i': 0, 'j': 0, 'word': 'huh', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8f' },
                { 'i': 0, 'j': 9, 'word': 'downstairs', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe8e' },
                { 'i': 0, 'j': 5, 'word': 'aloud', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8d' },
                { 'i': 2, 'j': 6, 'word': 'slow', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8c' },
                { 'i': 2, 'j': 6, 'word': 'swelling', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe8b' },
                { 'i': 4, 'j': 1, 'word': 'exposed', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8a' },
                { 'i': 3, 'j': 4, 'word': 'donna', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe89' },
                { 'i': 3, 'j': 2, 'word': 'oxford', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe88' },
                { 'i': 8, 'j': 0, 'word': 'sad', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe87' },
                { 'i': 6, 'j': 0, 'word': 'cash', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe86' },
                { 'i': 9, 'j': 3, 'word': 'bingo', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe85' },
                { 'i': 0, 'j': 0, 'word': 'hum', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe84' }
            ],
            'listOfWords': [
                'huh', 'downstairs', 'aloud', 'slow', 'swelling', 'exposed', 'donna', 'oxford', 'sad', 'cash', 'bingo', 'hum'
            ],
            'crossword': [
                ['h', 'u', 'h', '#', '#', 'a', 'l', 'o', 'u', 'd'],
                ['u', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', 'o'],
                ['m', ' ', '#', ' ', '#', '#', 's', 'l', 'o', 'w'],
                ['#', ' ', 'o', ' ', 'd', ' ', 'w', ' ', ' ', 'n'],
                ['#', 'e', 'x', 'p', 'o', 's', 'e', 'd', '#', 's'],
                ['#', ' ', 'f', ' ', 'n', ' ', 'l', ' ', ' ', 't'],
                ['c', ' ', 'o', ' ', 'n', ' ', 'l', ' ', ' ', 'a'],
                ['a', ' ', 'r', ' ', 'a', ' ', 'i', ' ', ' ', 'i'],
                ['s', 'a', 'd', '#', '#', ' ', 'n', ' ', ' ', 'r'],
                ['h', ' ', '#', 'b', 'i', 'n', 'g', 'o', '#', 's']
            ]
        });
    }
}
