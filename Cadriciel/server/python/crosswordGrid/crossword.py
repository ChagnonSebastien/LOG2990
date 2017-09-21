from crosswordGrid import *
import json
import pprint
import re
from string import maketrans
from random import randint

class Crossword:
    'Crossword prototype'

    def __init__(self, gridGenerator, lexicon):
        with open(lexicon) as lexicon_file:
            self.lexicon = json.load(lexicon_file)
        self.gridGenerator = gridGenerator
        self.generateCrossword()

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

    def generateCrossword(self):
        self.gridGenerator.generateGrid()
        wordsToFill = self.gridGenerator.wordsToFill()
        print wordsToFill
        for wordToFill in wordsToFill:
            self.gridGenerator.printGrid()
            nextToFill = self.gridGenerator.wordsToFill()[0]
            wordChoices = self.allWordsThatMatch(nextToFill["current"])
            #print nextToFill
            if len(wordChoices) > 0:
                wordChoice = wordChoices[randint(0, len(wordChoices) - 1)]
                print wordChoice, "at index", nextToFill["i"], nextToFill["j"], "direction: ", nextToFill["direction"]
                self.gridGenerator.addWord(wordChoice, nextToFill["i"], nextToFill["j"], nextToFill["direction"])
        self.gridGenerator.printGrid()

gridGenerator = CrosswordGrid(10)
crossword = Crossword(gridGenerator, 'lexicon.json')
#print len(crossword.getWordsOfLength(9))

#print crossword.allWordsThatMatch(' a   e')
#crossword.gridGenerator.generateGrid()
#crossword.gridGenerator.printGrid()