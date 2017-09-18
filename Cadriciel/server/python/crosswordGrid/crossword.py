from crosswordGrid import *
import json
import pprint
import re
from string import maketrans

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

    def patternToRegex(self, pattern):
        return re.sub(r'\s','[a-z]', pattern)

    def allWordsThatMatch(self, pattern):
        wordsOfSameLength = self.getWordsOfLength(len(pattern))
        regex = re.compile(self.patternToRegex(pattern))
        return filter(regex.search, wordsOfSameLength)

gridGenerator = CrosswordGrid(10)
crossword = Crossword(gridGenerator, 'lexicon.json')
print len(crossword.getWordsOfLength(9))

print crossword.allWordsThatMatch(' a   e')
crossword.gridGenerator.generateGrid()
crossword.gridGenerator.printGrid()