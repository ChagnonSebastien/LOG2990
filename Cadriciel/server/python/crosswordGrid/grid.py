class Grid:
    "Crossword Grid Generator"
    def __init__(self, gridSize):
        self.gridSize = gridSize
        self.grid = [[" " for x in range(gridSize)] for y in range(gridSize)]

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

    def test(self):
        # Test cases for isValidGrid
        assert(self.isValidGrid())
        self.grid[0][0] = '#'
        assert(self.isValidGrid())
        self.grid[0][6] = '#'
        assert(self.isValidGrid())
        self.grid[0][9] = '#'
        assert(self.isValidGrid())
        self.grid[8][0] = '#'
        assert(self.isValidGrid())
        self.grid[5][0] = '#'
        assert(not self.isValidGrid())
        self.grid = [[" " for x in range(self.gridSize)] for y in range(self.gridSize)]

# Automatic unit tests
prototypeGrid = Grid(10)
prototypeGrid.test()