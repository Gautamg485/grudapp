export const extractTextBetweenToAndOn = text => {
  if (text.indexOf('credited') !== -1) {
    const regex = /(?<=by\s)(.*?@[\w.-]+)/;

    const match = text.match(regex);
    if (match) {
      console.log(match[0]);
      return match[0];
    }
  }
  const regex = /to (.*?) on/;
  const nextregex = /at (.*?) on/;
  const match = text.match(regex);
  if (match) {
    return match[1].trim();
  } else if (text.match(nextregex)) {
    return text.match(nextregex)[1].trim();
  } else {
    return null;
  }
};

export const getRegexFromArray = list => {
  const escapedMerchantNames = list.map(name =>
    name.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'),
  );

  // Create the regex pattern from the bank names
  const merchantPattern = `\\b(${escapedMerchantNames.join('|')})\\b`;

  // Return a case-insensitive global regex
  let regexPattern = new RegExp(merchantPattern, 'gi');
  // console.warn('regexregex ' + regex);

  return regexPattern;
};

export const getMatchedValueFromRegex = (regexArr, text) => {
  let regex = getRegexFromArray(regexArr);

  const match = text.match(regex);

  if (match) {
    return match[0].trim();
  }

  return '';
};
