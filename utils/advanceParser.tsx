export const extractTextBetweenToAndOn = text => {
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
