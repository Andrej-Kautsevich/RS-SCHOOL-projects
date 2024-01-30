// Функция для подсчета подсказок
export function countRowHints(template) {
  const hints = [];
  for (let i = 0; i < template.length; i++) {
    let count = 0;
    const rowHints = [];
    for (let j = 0; j < template[i].length; j++) {
      if (template[i][j] === 1) {
        count++;
      } else if (count > 0) {
        rowHints.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      rowHints.push(count);
    }
    hints.push(rowHints);
  }
  return hints;
}

export function countColumnHints(template) {
  const hints = [];
  for (let i = 0; i < template[i].length; i++) {
    let count = 0;
    const columnHints = [];
    for (let j = 0; j < template.length; j++) {
      if (template[j][i] === 1) {
        count++;
      } else if (count > 0) {
        columnHints.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      columnHints.push(count);
    }
    hints.push(columnHints);
  }
  return hints;
}
