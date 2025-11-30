function cleanNumber(number) {
  let cleanedNumber = number;
  cleanedNumber = cleanedNumber
    .replace("'", "")
    .replace("+", "")
    .replaceAll("-", "")
    .replaceAll(" ", "");
  if (cleanedNumber.startsWith("0"))
    cleanedNumber = cleanedNumber.replace("0", "62");
  return cleanedNumber;
}

function fileConverter(data, mimeType) {
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}

module.exports = {
  cleanNumber,
  fileConverter,
};
