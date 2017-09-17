class CrosswordGrid:
    "Crossword Grid Generator"
    def __init__(self, gridSize):
        self.gridSize = gridSize
        self.grid = [[" " for x in range(gridSize)] for y in range(gridSize)]

    def addLetter(self, letter, line, column):
        self.grid[line][column] = letter

    def addBlackSquare(self, line, column):
        self.addLetter('#', line, column)

    def printGrid(self):
        for line in self.grid:
            print "|",
            for letter in line:
                print letter + " |",
            print "\n-" + "-" * 4 * self.gridSize

    def isValidHorizontal(self, grid):
        for line in grid:
            sections = [section for section in ''.join(line).split('#') if section != '']
            if len(sections) > 2:
                return False
        return True

    def transposeGrid(self, grid):
        return [[grid[i][j] for i in range(self.gridSize)] for j in range(self.gridSize)]

    def isValidGrid(self):
        return self.isValidHorizontal(self.grid) and self.isValidHorizontal(self.transposeGrid(self.grid))

    def testAll(self):
        # Test cases for isValidGrid
        assert(self.isValidGrid())
        self.addBlackSquare(0,0)
        assert(self.isValidGrid())
        self.addBlackSquare(0,6)
        assert(self.isValidGrid())
        self.addBlackSquare(0,9)
        assert(self.isValidGrid())
        self.addBlackSquare(8,0)
        assert(self.isValidGrid())
        self.addBlackSquare(5,0)
        assert(not self.isValidGrid())
        # Reset grid
        self.grid = [[" " for x in range(self.gridSize)] for y in range(self.gridSize)]
        print 'CrosswordGrid class: all tests passed'

# Automatic unit tests
prototypeGrid = CrosswordGrid(10)
prototypeGrid.testAll()

# 