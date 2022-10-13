const readline = require("readline-sync");
var process = require("process");

const scheduledArray = [];
const leaves = [];
const totalNurse = Number(readline.question("Enter the Number of Nurse\n"));
const nurse = new Array(totalNurse).fill(0).map((item, idx) => "N" + (idx + 1));
let previousArray = [...nurse];
const getWeekReport = (numberOfNurse) => {
  const divide = parseInt(numberOfNurse / 3);
  return [divide, parseInt(numberOfNurse % 3) + divide, divide];
};

const pattern = getWeekReport(totalNurse);

const permutations = (arr) => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val) => [
          item,
          ...val,
        ])
      ),
    []
  );
};

const weeekSlots = permutations(pattern);
const week = {
  Monday: weeekSlots[0],
  Tuesday: weeekSlots[1],
  Wednesday: weeekSlots[2],
  Thrusday: weeekSlots[5],
  Friday: weeekSlots[4],
  Saturday: weeekSlots[3],
  Sunday: weeekSlots[1],
};

const weeekPatern = { ...week };

const rotateArray = (array, rounds) => {
  for (let i = 0; i < rounds; i++) {
    array.push(array.shift());
  }
  return array;
};
Object.keys(week).map((day, idx) => {
  const keys = Object.keys(week);
  const currentDay = week[day];
  const yesterday = weeekPatern[keys[idx - 1]];
  let incrementer = 0;
  if (idx === 0) {
    const today = currentDay.map((item, idx) => {
      if (idx === 0) {
        incrementer += item;
        return nurse.slice(idx, item);
      }
      const timeTable = nurse.slice(incrementer, item + incrementer);
      incrementer += item;
      return timeTable;
    });
    week[day] = today;
    scheduledArray.push(today);
    return;
  }
  const roatedArray = rotateArray([...previousArray], 1);
  previousArray = [...roatedArray];
  const today = currentDay.map((item, idx) => {
    if (idx === 0) {
      incrementer += item;
      return roatedArray.slice(idx, item);
    }
    const timeTable = roatedArray.slice(incrementer, item + incrementer);
    incrementer += item;
    return timeTable;
  });
  week[day] = today;
  scheduledArray.push(today);
});

console.log(
  "**************************\nWeeekly Time Table\n************************\n Number of Nurse per Shift."
);
console.table(weeekPatern);
console.log(
  "**************************\nScheduling Time Table\n************************\n"
);
console.table(week);

let exit = false;
while(!exit){
const applyLeave = String(readline.question("Apply leave? y/n\n"));

if (applyLeave === "y") {
  const nurseNumber = Number(readline.question("Enter the Nurse Number\n"));
  const nursePresent = nurseNumber > totalNurse ? false : true;
  if (!nursePresent || leaves.includes("N"+nurseNumber)) {
    console.log("Nurse not found or You have already Applied Leave");
    continue;
  }
  const day = Number(
    readline.question(
      "Enter the Day you want to apply (1-7) (Monday - Sunday)\n"
    )
  );
  if (day > 7 || day < 1) {
    console.log("Invalid Day");
    process.exit(0);
  }
  const keys = Object.keys(week);
  const holiday = week[keys[day - 1]];
  holiday.forEach((item) => {
    if (item.includes("N" + nurseNumber)) {
      let index = item.indexOf("N" + nurseNumber);
      item[index] = "N" + Math.abs(nurseNumber - (totalNurse + 1));
    }
  });
  leaves.push("N" + nurseNumber)
  console.log(
    "**************************\nRe-Scheduling Time Table\n************************\n"
  );
  console.table(week);
  continue;
}
exit = String(readline.question("Exit the Terminal? y/n\n")) === 'y'? true : false
}