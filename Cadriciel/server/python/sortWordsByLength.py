# Extract list of words
with open("../lexicon/englishWords.txt") as f:
    words = map(str.strip, f.readlines())

# Sort list of words by length ascending
wordsThatFit = filter(lambda x: len(x) < 11, words)
sortedWords = sorted(wordsThatFit, key=lambda x: len(x))

# Dump sorted words as JSON
import json
with open('../lexicon/englishWords-sorted.json', 'w') as outfile:
    json.dump(sortedWords, outfile)