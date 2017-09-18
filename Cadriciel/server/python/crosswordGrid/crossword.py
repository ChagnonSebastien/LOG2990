from crosswordGrid import *
import json
import pprint

class Crossword:
    'Crossword prototype'

    def __init__(self, gridGenerator, lexicon):
        with open(lexicon) as lexicon_file:
            self.lexicon = json.load(lexicon_file)
        self.gridGenerator = gridGenerator

    def printLexicon(self):
        pprint.pprint(self.lexicon)

    def getWordsOfLength(self, length):
        return self.lexicon["common"][str(length)] + self.lexicon["uncommon"][str(length)]

gridGenerator = CrosswordGrid(10)
crossword = Crossword(gridGenerator, 'lexicon.json')
print len(crossword.getWordsOfLength(9))