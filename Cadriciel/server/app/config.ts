// countdown
export const INITIAL_COUNTDOWN_VALUE = 30; // seconds
export const ONE_SECOND = 1000; // milliseconds

// game manager
export const INITIAL_GAME_ID = 0;

// crossword
export const CROSSWORD_GRID_SIZE = 10;
export const MAX_CROSSWORDS_PER_LEVEL = 5;
export const BLANK_SQUARE = ' ';
export const BLACK_SQUARE = '#';

// database
export const DATABASE_URL = 'mongodb://admin:walleandtomato@ds123084.mlab.com:23084/skafy';
export const CROSSWORD_COLLECTION = 'crosswords';

// server
export const SERVER_PORT = '3000';

// routes
export const API_URL = 'http://localhost:3000/api';

// lexicon
export const LEXICON_PATH = './app/words.json';
export const MIN_WORD_LENGTH = 3;
export const WORD_API = 'http://api.wordnik.com:80/v4/word.json';
export const DEFINITIONS_OPTIONS = 'definitions?limit=200&includeRelated=true&useCanonical=false' +
    '&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
export const FREQUENCY_OPTIONS = 'frequency?useCanonical=false&startYear=2012&endYear=' +
    '2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

// track
export const MAX_NUMBER_OF_TOP_TIMES = 5;
