gridSize = 10

grid = [[" " for x in range(gridSize)] for y in range(gridSize)]

def printGrid(grid):
    for line in grid:
        print "|",
        for letter in line:
            print letter + " |",
        print "\n-" + "-" * 4 * gridSize

printGrid(grid)