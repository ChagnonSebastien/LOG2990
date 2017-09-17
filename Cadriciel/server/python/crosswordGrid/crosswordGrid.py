gridSize = 10

grid = [[" " for x in range(gridSize)] for y in range(gridSize)]

def printGrid(grid):
    for line in grid:
        print "|",
        for letter in line:
            print letter + " |",
        print "\n-" + "-" * 4 * gridSize

def isValidHorizontal(grid):
    for line in grid:
        sections = [section for section in ''.join(line).split('#') if section != '']
        if len(sections) > 2:
            return False
    return True

def transposeGrid(grid):
    return [[grid[i][j] for i in range(gridSize)] for j in range(gridSize)]

def isValidGrid(grid):
    return isValidHorizontal(grid) and isValidHorizontal(transposeGrid(grid))

# Test cases for isValidGrid
assert(isValidGrid(grid))
grid[0][0] = '#'
assert(isValidGrid(grid))
grid[0][6] = '#'
assert(isValidGrid(grid))
grid[0][9] = '#'
assert(isValidGrid(grid))
grid[8][0] = '#'
assert(isValidGrid(grid))
grid[5][0] = '#'
assert(not isValidGrid(grid))
grid[0][3] = '#'
assert(not isValidGrid(grid))

printGrid(grid)