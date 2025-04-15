
const scriptUrl = "https://script.google.com/macros/s/AKfycbzn75e2mARv8VScQujhR876f6FUgLm0mpmFn_dsFGUcqH00rqqP0u2W4uFxE-69UXQ0/exec";

const sheetSelect = document.getElementById("sheetSelect");
const tableContainer = document.getElementById("tableContainer");
let allData = {};

fetch(scriptUrl)
  .then(res => res.json())
  .then(json => {
    allData = json["النتائج"];
    Object.keys(allData).forEach(sheet => {
      const option = document.createElement("option");
      option.value = sheet;
      option.textContent = sheet;
      sheetSelect.appendChild(option);
    });
  });

sheetSelect.addEventListener("change", () => {
  const sheetName = sheetSelect.value;
  const data = allData[sheetName];

  tableContainer.innerHTML = "";

  if (!Array.isArray(data)) {
    tableContainer.innerHTML = `<p>${data}</p>`;
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headers = Object.keys(data[0]);
  const headerRow = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  data.forEach(row => {
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = row[h] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
});
