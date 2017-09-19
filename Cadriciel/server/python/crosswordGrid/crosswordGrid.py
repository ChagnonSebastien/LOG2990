from random import shuffle
import pprint

class CrosswordGrid:
    'Crossword Grid Generator'
    def __init__(self, gridSize):
        self.gridSize = gridSize
        self.availableSquares = [(i, j) for i in range(self.gridSize) for j in range(self.gridSize)]                        
        self.resetGrid()

    def resetGrid(self):
        self.lines = []        
        self.grid = [ [' ' for j in range(self.gridSize)] for i in range(self.gridSize) ]
        shuffle(self.availableSquares)

    def addLetter(self, letter, line, column):
        self.grid[line][column] = letter

    def addWord(self, word, line, column, direction):
        for character in word:
            self.addLetter(character, line, column)
            if direction == 'horizontal':
                column += 1
            elif direction == 'vertical':
                line += 1

    def addBlackSquare(self, line, column):
        self.addLetter('#', line, column)

    def erase(self, line, column):
        self.grid[line][column] = ' '

    def sections(self, line):
        return [section for section in ''.join(line).split('#') if section != '']

    def allSections(self, grid):
        return [ self.sections(line) for line in grid ]

    def horizontalLines(self):
        return self.allSections(self.grid)

    def verticalLines(self):
        return self.allSections(self.transposeGrid(self.grid))

    def toFill(self, grid, direction):
        data = []
        for lineNumber, line in enumerate(grid):
            words = self.sections(line)
            lineStr = ''.join(line)
            wordEnd = 0
            for word in words:
                wordStart = lineStr.index(word[0])
                if ' ' in word:
                    data.append({"length": len(word), "i": lineNumber if direction == "horizontal" else wordStart + wordEnd, "j": wordStart + wordEnd if direction == "horizontal" else lineNumber, "direction": direction, "current": word})
                wordEnd = wordStart + len(word)
                if wordEnd < self.gridSize:
                    lineStr = lineStr[wordEnd:]
        return data

    def wordsToFill(self):
        data = self.toFill(self.grid, "horizontal") + self.toFill(self.transposeGrid(self.grid), "vertical")
        return sorted(data, key=lambda x:x["length"], reverse=True)

    def printGrid(self):
        for line in self.grid:
            print '|',
            for letter in line:
                print letter + ' |',
            print '\n-' + '-' * 4 * self.gridSize

    def isValidHorizontal(self, grid):
        for line in grid:
            sections = [ len(section) for section in ''.join(line).split('#') if section != '' ]
            if len(sections) > 2 or min(sections) < 3:
                return False
            self.lines += sections
        return True

    def transposeGrid(self, grid):
        return [ [grid[i][j] for i in range(self.gridSize)] for j in range(self.gridSize) ]

    def isValidGrid(self):
        self.lines = []
        return self.isValidHorizontal(self.grid) and self.isValidHorizontal(self.transposeGrid(self.grid))

    def score(self):
        return self.lines.count(3)

    def generateGrid(self):
        score = 0
        while score < 25:
            self.resetGrid()
            #print 'Score is', score
            for coordinate in self.availableSquares:
                self.addBlackSquare(coordinate[0], coordinate[1])
                if not self.isValidGrid():
                    self.erase(coordinate[0], coordinate[1])
            score = self.score()
        return self.grid

    def testAll(self):
        # Test cases for isValidGrid
        assert(self.isValidGrid())
        self.addBlackSquare(0,0)
        assert(self.isValidGrid())
        self.addBlackSquare(0,5)
        assert(self.isValidGrid())
        self.addBlackSquare(0,9)
        assert(self.isValidGrid())
        self.addBlackSquare(6,0)
        assert(self.isValidGrid())
        self.addBlackSquare(1,0)
        assert(self.isValidGrid())
        self.addBlackSquare(9,0)
        assert(not self.isValidGrid())
        
        self.resetGrid()
        print 'CrosswordGrid class: all tests passed'

# Automatic unit tests
prototypeGrid = CrosswordGrid(10)
prototypeGrid.testAll()

# Generate random crossword
import timeit
# nTests = 1
# start = timeit.default_timer()
# for i in range(nTests):
#     prototypeGrid.generateGrid()
#     prototypeGrid.printGrid()
#     print ''
#     pprint.pprint(prototypeGrid.wordsToFill())
# end = timeit.default_timer()
# print 'Average time:', (end - start) / nTests