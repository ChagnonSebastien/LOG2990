from random import randrange, shuffle
import json
import pprint
import re
import copy
from collections import deque
import timeit
import time

defaultGridSize = 10
#constraintsGene = [(7, False), (3, False), (6, False), (0, False), (5, False), (9, False), (4, True), (7, True), (2, False), (1, True), (4, False), (1, False), (5, True), (8, True), (3, True), (0, True), (6, True), (8, False), (2, True), (9, True)]
# constraintsGene = [(7, False), (3, False), (6, False), (0, False), (5, False), (4, True), (9, False), (4, False), (2, False), (7, True), (1, False), (1, True), (8, True), (0, True), (3, True), (8, False), (9, True), (6, True), (2, True), (5, True)]
#constraintsGene = [(i / 2, True if i % 2 == 0 else False) for i in range(defaultGridSize * 2)]
constraintsGene = [(i % defaultGridSize, True if i < defaultGridSize else False) for i in range(defaultGridSize * 2)]

class Grid:
    'Crossword Grid'

    def __init__(self, size, lexicon, gene):
        self.reset(size, lexicon, gene)

    def reset(self, size, lexicon, gene):
        self.size = size
        self.lexiconFile = lexicon
        self.getLexicon(lexicon)
        self.initializeLexiconByLength()
        self.grid = [ [' ' for j in range(self.size)] for i in range(self.size) ]
        self.gridLetterCounter = [[0 for j in range(self.size)] for i in range(self.size)]
        self.gridContribution = [[[] for j in range(self.size)] for i in range(self.size)]
        self.words = set()
        self.wordsInCrossword = []
        self.originalGene = gene
        self.constraintsToSatisfy = gene
        self.constraintsToSatisfy = deque(self.constraintsToSatisfy)
    
    def getLexicon(self, lexicon):
        with open(lexicon) as lexicon_file:
            self.lexicon = json.load(lexicon_file)

    def initializeLexiconByLength(self):
        self.lexiconByLength = {}
        for word in self.lexicon:
            if len(word) > self.size:
                continue
            if self.lexiconByLength.get(len(word)) is None:
                self.lexiconByLength[len(word)] = []
            self.lexiconByLength[len(word)].append(word)
    
    def sizeOfLexicon(self):
        return len(self.lexicon)

    def pprintLexicon(self):
        pprint.pprint(self.lexicon)

    def toRegex(self, pattern):
        return re.sub(r'\s', '[a-z]', pattern)

    def getWordsWith(self, pattern):
        if len(pattern) < 3:
            return []
        regex = re.compile(self.toRegex(pattern))
        return filter(regex.search, self.lexiconByLength[len(pattern)])

    def bestWordForLine(self, pattern):
        words = set()
        for i in range(3, 11):
            for j in range(i + 1, self.size):
                if pattern == ' ' * self.size or len(pattern[i:j].strip()) > 0:
                    words |= set(self.getWordsWith(pattern[i:j]))
                else:
                    continue
        if len(words) > 0:
            return list(words)[randrange(0, len(words))]
        else:
            return ''

    def getRandomWord(self):
        return self.lexicon[randrange(0, len(self.lexicon))]

    def insertLetter(self, letter, i, j):
        if self.gridLetterCounter[i][j] > 0 and self.grid[i][j] != letter:
            return False
        self.grid[i][j] = letter
        self.gridLetterCounter[i][j] += 1
        return True

    def addContribution(self, contribution, i, j):
        self.gridContribution[i][j].append(contribution)

    def removeContribution(self, contribution, i, j):
        self.gridContribution[i][j].remove(contribution)

    def deleteLetter(self, letter, i, j):
        if self.grid[i][j] != letter:
            return False
        if self.gridLetterCounter[i][j] > 1:
            self.gridLetterCounter[i][j] -= 1
        else:
            self.gridLetterCounter[i][j] = 0
            self.grid[i][j] = ' '
        return True

    def insertWord(self, word, i, j, horizontal):
        if word in self.words:
            return "Error: " + word + " already in grid"

        # size error
        if horizontal and self.size < j + len(word) or not horizontal and self.size < i + len(word):
            return "Error: cannot insert too long"

        # save states for rollback
        tempGrid = copy.deepcopy(self.grid)
        tempCounter = copy.deepcopy(self.gridLetterCounter)
        tempContribution = copy.deepcopy(self.gridContribution)

        # insertion
        contribution = {"word": word, "i": i, "j": j, "horizontal": horizontal}
        #print word
        for letter in word:
            #self.printGrid()
            #time.sleep(0.1)
            if not self.insertLetter(letter, i, j):
                # rollback
                self.grid = tempGrid
                self.gridLetterCounter = tempCounter
                self.gridContribution = tempContribution
                return "Error: invalid match"
            self.addContribution(contribution, i, j)
            if horizontal:
                j += 1
            else:
                i += 1
        self.words.add(word)
        self.wordsInCrossword.append({"word": word, "i": contribution["i"], "j": contribution["j"], "horizontal": horizontal})
        return "Successfully inserted: " + word

    def deleteWord(self, word, i, j, horizontal):
        if word not in self.words:
            return "Error: " + word + " not found in grid"

        # size error
        if horizontal and self.size < j + len(word) or not horizontal and self.size < i + len(word):
            return "Error: cannot delete out of range"

        # save states for rollback
        tempGrid = copy.deepcopy(self.grid)
        tempCounter = copy.deepcopy(self.gridLetterCounter)
        tempContribution = copy.deepcopy(self.gridContribution)

        # deletion
        contribution = {"word": word, "i": i, "j": j, "horizontal": horizontal}
        for letter in word:
            if not self.deleteLetter(letter, i, j):
                # rollback
                self.grid = tempGrid
                self.gridLetterCounter = tempCounter
                self.gridContribution = tempContribution
                return "Error: invalid match"
            self.removeContribution(contribution, i, j)
            if horizontal:
                j += 1
            else:
                i += 1
        self.words.remove(word)
        self.wordsInCrossword.remove({"word": word, "i": i, "j": j, "horizontal": horizontal})
        return "Successfully deleted: " + word

    def insertRandomWord(self):
        if len(self.constraintsToSatisfy) > 0:
            where = self.constraintsToSatisfy.popleft()
        if where[1] == True:
            pattern = ''.join(self.grid[where[0]])
        else:
            pattern = ''.join([self.grid[i][where[0]] for i in range(self.size)])
        wordToInsert = self.bestWordForLine(pattern)
        if len(wordToInsert) == 0:
            return False
        randomIndexes = [i for i in range(0, self.size - len(wordToInsert))]
        bestIndex = 0
        bestScore = 0
        if pattern == ' ' * self.size:
            shuffle(randomIndexes)
        for index in randomIndexes:
            indexScore = 0
            for j, character in enumerate(wordToInsert):
                if character == pattern[index + j]:
                    indexScore += 1
            if indexScore >= bestScore:
                bestIndex = index
                bestScore = indexScore
        #print bestIndex, bestScore
        #self.printGrid()
        if where[1] == True:
            self.insertWord(wordToInsert, where[0], bestIndex, True)
        else:
            self.insertWord(wordToInsert, bestIndex, where[0], False)
        return True
        # shuffle(randomIndexes)
        # for i in randomIndexes:
        #     if where[1] == True:
        #         self.insertWord(wordToInsert, where[0], i, True)
        #     else:
        #         self.insertWord(wordToInsert, i, where[0], False)
        #     if wordToInsert in self.words:
        #         return True
    
    def generate(self):
        start = timeit.default_timer()
        bestScore = 0
        totalScore = 0
        bestGrid = copy.deepcopy(self.grid)
        bestGridLetterCounter = copy.deepcopy(self.gridLetterCounter)
        bestGridContribution = copy.deepcopy(self.gridContribution)
        bestWordsInCrossword = copy.deepcopy(self.wordsInCrossword)
        bestWords = copy.deepcopy(self.words)
        for i in range(3):
            while len(self.constraintsToSatisfy) > 0:
                #self.printGrid()
                if not self.insertRandomWord():
                    self.reset(self.size, self.lexiconFile, self.originalGene)
            gridScore = self.scoreGrid()
            totalScore += gridScore
            #self.printGrid()
            #print "Score of grid: ", gridScore
            if gridScore > bestScore:
                bestScore = gridScore
                bestGrid = copy.deepcopy(self.grid)
                bestGridLetterCounter = copy.deepcopy(self.gridLetterCounter)
                bestGridContribution = copy.deepcopy(self.gridContribution)
                bestWordsInCrossword = copy.deepcopy(self.wordsInCrossword)
                bestWords = copy.deepcopy(self.words)
            self.reset(self.size, self.lexiconFile, self.originalGene)
        self.grid = bestGrid
        self.gridLetterCounter = bestGridLetterCounter
        self.gridContribution = bestGridContribution
        self.wordsInCrossword = bestWordsInCrossword
        self.words = bestWords
        self.printGrid()
        stop = timeit.default_timer()
        pprint.pprint(self.wordsInCrossword)
        #pprint.pprint(self.gridContribution)
        #pprint.pprint(self.gridLetterCounter)
        print "BEST SCORE :", bestScore        
        #print "Total time:", stop - start
        return totalScore

    def scoreGrid(self):
        score = 0
        for line in self.gridLetterCounter:
            for letterCounter in line:
                if letterCounter > 1:
                    score += 1
        return score

    def printGrid(self):
        print '-' * (4 * self.size + 1)
        for line in self.grid:
            print '|',
            for letter in line:
                print letter + ' |',
            print '\n-' + '-' * 4 * self.size

# generations of evolution
nGenerations = 100
geneA = constraintsGene
geneB = constraintsGene

def mutateGene(gene):
    rand1 = randrange(0, len(gene))
    rand2 = randrange(0, len(gene))
    temp = gene[rand1]
    gene[rand1] = gene[rand2]
    gene[rand2] = temp
    return gene

bestScoreOfAllGenerations = 0
for i in range(nGenerations):
    #geneA = mutateGene(geneA)
    gridA = Grid(10, 'englishWords.json', geneA)
    gridB = Grid(10, 'englishWords.json', geneB)

    scoreA = gridA.generate()
    scoreB = gridB.generate()
    if scoreA > scoreB:
        geneB = geneA
    else:
        geneA = geneB
    print "Best gene in generation", i, "is", geneA, "with score", scoreA if scoreA > scoreB else scoreB

print "Final gene after", i, "generations is", geneA

# uncommonGrid = Grid(10, 'uncommonWords.json')
# # print grid.constraintsToSatisfy
# #pprint.pprint(grid.gridContribution)
# #print grid.sizeOfLexicon()
# #grid.pprintLexicon()
# # print grid.insertWord('hello', 0, 0, horizontal=True)
# # print grid.insertWord('hello', 1, 0, True)
# # print grid.insertWord('lisa', 2, 2, True)
# # print grid.insertWord('oval', 0, 4, False)
# # print grid.insertWord('audrey', 2, 4, True)
# # grid.deleteWord('hello', 0, 0, True)
# # pprint.pprint(grid.gridContribution)
# # grid.deleteWord('oval', 0, 4, False)
# uncommonGrid.generate()

# commonGrid = Grid(10, 'commonWords.json')
# commonGrid.generate()

# intermediateGrid = Grid(10, 'englishWords.json')
# intermediateGrid.generate()