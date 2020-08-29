let employees = [[1, 5, [2, 3]], [2, 3, []], [3, 3, []]];
let id = 1;
function GetImportance(employees, id) {
  let e = 0;
  let d = [];
  for (let i of employees) {
    if (i[0] === id) {
      d = i[2];
      e += i[1];
    }
    if (d.length === 0) {return e;}
    return e + c(employees, d); 
  }
}


function c(employees, id) {
  let e = 0;
  for (let i of employees) {
    if (id.includes(i[0])) {
      if (i[2].length === 0) { e += i[1];}
      e += c(employees, i[2]);
    }   
  }
  return e;
}
console.log(GetImportance(employees, id));


