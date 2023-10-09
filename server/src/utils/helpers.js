const swapKeyValue = (obj) => {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
};

const r = (re, flags = "u") =>
  new RegExp(
    re
      .replace(/#[^\n]*/gm, "")
      .replace(/\\#/gm, "#")
      .replace(/\s/gm, ""),
    flags
  );

const validator = (re) => (str) => re.test(str);

const extractor = (re) => (str) => re.exec(str).groups;

const upperCase = (str) => str.toUpperCase();
const lowerCase = (str) => str.toLowerCase();
const replace = (str, pattern, callback) => str.replace(pattern, callback);

const alphabet = "a-zа-щєґіїюяь";

const commonCyrillicToLatin = {
  а: "a",
  в: "b",
  с: "c",
  е: "e",
  к: "k",
  м: "m",
  н: "h",
  о: "o",
  т: "t",
  х: "x",
  у: "y",
};

const anyWordInListPattern = (list) =>
  r(
    String.raw`
    # Any of words in list
    (?:^|\s)
      (${list.join("|")}
    )(?=\s|$)
`,
    "gi"
  );

const latinCyrillic = new RegExp(`[${alphabet}]`, "gi");

const commonLatinToCyrillic = swapKeyValue(commonCyrillicToLatin);

const commonLetters = { ...commonLatinToCyrillic, ...commonCyrillicToLatin };

const commonPair = (commonLetters) => (letter) =>
  "[" +
  (commonLetters[letter.toLowerCase()]
    ? commonLetters[letter.toLowerCase()] + "|" || ""
    : "") +
  letter +
  "]";

const getLetterPairs = commonPair(commonLetters);

const alphabetAgnosticRegex = (str) =>
  new RegExp(str.replace(latinCyrillic, getLetterPairs).toUpperCase(), "i");

const capitalizeFirstLetter = ([firstLetter = "", ...rest]) =>
  firstLetter.toUpperCase() + rest.join("").toLowerCase();

const createWordCapitalizer = (alphabet) => (inputString) => {
  const wordRegex = new RegExp(`[${alphabet}]+`, "gi");

  const replaceWords = (regex, callback) => (value) =>
    typeof value === "string" ? value.replace(regex, callback) : value;

  return replaceWords(wordRegex, capitalizeFirstLetter)(inputString);
};

const capitalizeUkrainianWords = createWordCapitalizer("а-щєґіїюяь'");

export {
  swapKeyValue,
  alphabetAgnosticRegex,
  capitalizeUkrainianWords,
  capitalizeFirstLetter,
  r,
  alphabet,
  validator,
  extractor,
  anyWordInListPattern,
  upperCase,
  lowerCase,
  replace,
};
