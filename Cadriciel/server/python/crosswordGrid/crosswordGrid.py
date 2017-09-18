from random import shuffle

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

    def addBlackSquare(self, line, column):
        self.addLetter('#', line, column)

    def erase(self, line, column):
        self.grid[line][column] = ' '

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
        while score < 24:
            self.resetGrid()
            #print 'Score is', score
            for coordinate in self.availableSquares:
                self.addBlackSquare(coordinate[0], coordinate[1])
                if not self.isValidGrid():
                    self.erase(coordinate[0], coordinate[1])
            score = self.score()

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
nTests = 100
start = timeit.default_timer()
for i in range(nTests):
    prototypeGrid.generateGrid()
    prototypeGrid.printGrid()
    print ''
end = timeit.default_timer()
print 'Average time:', (end - start) / nTests