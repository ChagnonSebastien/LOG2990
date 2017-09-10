# Extract list of word frequency
with open("../lexicon/wordFrequency.txt") as f:
    wordFrequency = f.readlines()

# Extract word frequency
wordFrequency = [map(str.strip, x.split('\t')) for x in wordFrequency]

# For each word, dictionary of its frequency (in %)
wordFrequency = {x[0].lower():x[7] for x in wordFrequency}

# Extract list of words
with open("../lexicon/englishWords.txt") as f:
    words = map(str.strip, f.readlines())

# Filter into common and uncommon words
commonWords = []
uncommonWords = []

for word in words:
    frequency = wordFrequency.get(word)
    if frequency is not None and float(frequency) > 1:
        commonWords.append(word)
    else:
        uncommonWords.append(word)

# Dump words as JSON into commonWords.json and uncommonWords.json
import json
with open('../lexicon/commonWords.json', 'w') as outfile:
    json.dump(commonWords, outfile)

with open('../lexicon/uncommonWords.json', 'w') as outfile:
    json.dump(uncommonWords, outfile)