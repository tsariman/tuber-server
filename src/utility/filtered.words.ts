
const offensiveWords: {[offense: string]: number } = {
  'arse': 1,
  'ass': 1,
  'balllicker': 1,
  'ballsack': 1,
  'bastard': 2,
  'bitch': 3,
  'biatch': 1,
  'bimbo': 1,
  'birdbrain': 1,
  'biznatch': 1,
  'bloodclaat': 1,
  'brickhead': 1,
  'boob': 1,
  'booger': 1,
  'bootlicker': 1,
  'booty': 1,
  'boozer': 1,
  'bugger': 1,
  'bullshit': 3,
  'buffoon': 1,
  'bum': 1,
  'butthole': 1,
  'buttkisser': 1,
  'buttlicker': 1,
  'buttmunch': 1,
  'butt-wipe': 1,
  'buttwad': 1,
  'clit': 1,
  'clod': 1,
  'clunge': 1,
  'cock': 4,
  'coochie': 1,
  'craphole': 1,
  'cretin': 1,
  'crikey': 1,
  'cuck': 1,
  'custard': 1,
  'cum': 1,
  'cunt': 3,
  'cuss': 1,
  'damn': 1,
  'derp': 1,
  'dick': 1,
  'dildo': 1,
  'dimwit': 1,
  'doofus': 1,
  'dookie': 1,
  'dumbarse': 1,
  'dumbass': 1,
  'dummy': 1,
  'dunce': 1,
  'dyke': 1,
  'farter': 1,
  'fatass': 1,
  'frigger': 1,
  'fuck': 1,
  'fuckass': 1,
  'fuckface': 1,
  'hell': 1,
  'nigga': 1,
  'nigra': 1,
  'piss': 1,
  'prick': 1,
  'pussy': 1,
  'shit': 1,
  'shite': 1,
  'slurper': 1,
  'slut': 1,
  'sucker': 1,
  'tits': 1,
  'turd': 1,
  'twat': 1,
  'wanker': 1,
  'whore': 1,
}

export function filterOffensiveWords(text: string): string {
  const words = text.split(' ');
  const filteredWords = words.map(word => {
    if (offensiveWords[word.toLowerCase()]) {
      return '*'.repeat(word.length);
    }
    return word;
  });
  return filteredWords.join(' ');
}

/** Return true if he text contains any offensive words */
export function hasOffensiveWords(text: string): boolean {
  const words = text.split(' ')
  return words.some(word => offensiveWords[word.toLowerCase()])
}

/** Return `true` if text contains spam links or any url. */
export function hasSpamLinks(text: string): boolean {
  return text.includes('http')
}