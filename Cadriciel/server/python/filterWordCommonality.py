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

# Sort them by length
commonWords = sorted(commonWords, key=lambda x: len(x))
uncommonWords = sorted(uncommonWords, key=lambda x: len(x))

longestCommonWord = commonWords[len(commonWords) - 1]
longestUncommonWord = uncommonWords[len(uncommonWords) - 1]

commonWordsByLength = {x:[] for x in range(1,len(longestCommonWord) + 1)}
uncommonWordsByLength = {x:[] for x in range(1,len(longestUncommonWord) + 1)}

for word in commonWords:
    commonWordsByLength[len(word)].append(word)

for word in uncommonWords:
    uncommonWordsByLength[len(word)].append(word)

lexicon = {"common": commonWordsByLength, "uncommon": uncommonWordsByLength}

# Dump words as JSON into commonWords.json and uncommonWords.json
import json
with open('../lexicon/commonWords.json', 'w') as outfile:
    json.dump(commonWords, outfile)

with open('../lexicon/uncommonWords.json', 'w') as outfile:
    json.dump(uncommonWords, outfile)

# Dump lexicon as JSON
with open('../lexicon/lexicon.json', 'w') as outfile:
    json.dump(lexicon, outfile, sort_keys=True, indent=4, separators=(',', ': '))