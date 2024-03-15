export function getTwoChoicesFromCurrentChoices(array, setCurrChoices) {
  const index1 = Math.floor(Math.random() * array.length);
  let index2 = Math.floor(Math.random() * array.length);
  while (index2 === index1) {
    index2 = Math.floor(Math.random() * array.length);
  }

  let indexArray = [];
  if (index1 > index2) {
    indexArray = [index1, index2];
  } else {
    indexArray = [index2, index1];
  }
  const lChoice = array.splice(indexArray[0], 1);
  const rChoice = array.splice(indexArray[1], 1);

  setCurrChoices(array);
  return [lChoice[0], rChoice[0]];
}
