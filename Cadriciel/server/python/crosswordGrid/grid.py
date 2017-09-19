from random import randrange
import json
import pprint

class Grid:
    'Crossword Grid'

    def __init__(self, size, lexicon):
        self.size = size
        self.getLexicon(lexicon)
        self.initializeLexiconByLength()
    
    def getLexicon(self, lexicon):
        with open(lexicon) as lexicon_file:
            self.lexicon = json.load(lexicon_file)

    def initializeLexiconByLength(self):
        self.lexiconByLength = {}
        for word in self.lexicon:
            if self.lexiconByLength.get(len(word)) is None:
                self.lexiconByLength[len(word)] = []
            self.lexiconByLength[len(word)].append(word)
    
    def sizeOfLexicon(self):
        return len(self.lexicon)

    def pprintLexicon(self):
        pprint.pprint(self.lexiconByLength[10])

    def getRandomWord(self):
        return self.lexicon[randrange(0, len(self.lexicon))]

grid = Grid(10, 'englishWords.json')
print grid.sizeOfLexicon()
grid.pprintLexicon()
for i in range(10):
    print grid.getRandomWord()