import { pipe } from "ramda";

import {
  r,
  alphabet,
  alphabetAgnosticRegex,
  anyWordInListPattern,
  replace,
  lowerCase,
  upperCase,
  capitalizeFirstLetter,
  capitalizeUkrainianWords,
} from "./utils/helpers.js";

const validationWeaponPattern = r(
  String.raw`
# Weapon number or id
^
  (
    (
      (?<weaponSeriesFirst>[${alphabet}]+)
      (?<weaponNumberFirst>\d+)
    )
    |
    (
      (?<weaponNumberSecond>\d+)
      (?<weaponSeriesSecond>[${alphabet}]+)
    )
  )
$
`,
  "i"
);

const queryWeaponPattern = r(
  String.raw`
# Weapon Seria and Number
^
  #Optional
  (
    ?<weaponSeriesFirst>[${alphabet}]+
  )?
  (
    ?<weaponSeriesSecond>[${alphabet}]+
  )?
  (
    ?<weaponNumberFirst>(\d+)
  )?
  (
    ?<weaponNumberSecond>(\d+)
  )?
$
`,
  "i"
);

const weaponQueryMapper = ({
  weaponSeriesFirst,
  weaponSeriesSecond,
  weaponNumberFirst,
  weaponNumberSecond,
}) => {
  const weaponSeries = weaponSeriesFirst || weaponSeriesSecond;
  const weaponNumber = weaponNumberFirst || weaponNumberSecond;

  return {
    weaponNumber,
    weaponSeries: weaponSeries && alphabetAgnosticRegex(weaponSeries),
  };
};

const abbreviations = ["ТН", "ДПА", "ГУНП", "РВ", "МУ", "ГУМВСУ", "РВВС"];

const prepositions = ["у", "в", "обл\\.", "м\\."];

const capitalizeAll = (list) => (str) =>
  replace(str, anyWordInListPattern(list), upperCase);

const lowercaseAll = (list) => (str) =>
  replace(str, anyWordInListPattern(list), lowerCase);

const normalizeAuthority = pipe(
  capitalizeUkrainianWords,
  capitalizeAll(abbreviations),
  lowercaseAll(prepositions)
);

const weaponMapper = ({
  _id,
  status,
  organUnit,
  producer,
  weaponType,
  weaponKind,
  reasonSearch,
  ...rest
}) => ({
  organUnit: organUnit && normalizeAuthority(organUnit),
  producer: producer && capitalizeFirstLetter(producer),
  weaponType: weaponType && capitalizeFirstLetter(weaponType),
  weaponKind: weaponKind && capitalizeFirstLetter(weaponKind),
  reasonSearch: reasonSearch && capitalizeFirstLetter(reasonSearch),
  ...rest,
});

export {
  validationWeaponPattern,
  queryWeaponPattern,
  weaponMapper,
  weaponQueryMapper,
};
