
const scriptURL = "https://script.google.com/macros/s/AKfycbwrkE8E5whpVP2e4q8VfqeBnDR03P2b3y1UH79Icea5UgMGqPAUTCVrAM4AYV_4D_K-/exec";
let allData = {};

fetch(scriptURL)
  .then(res => res.json())
  .then(json => {
    allData = json["النتائج"];
    const select = document.getElementById("sheetSelect");
    Object.keys(allData).forEach(sheetName => {
      const option = document.createElement("option");
      option.value = sheetName;
      option.textContent = sheetName;
      select.appendChild(option);
    });
  });

document.getElementById("sheetSelect").addEventListener("change", function () {
  const selectedSheet = this.value;
  const data = allData[selectedSheet];
  const container = document.getElementById("tableContainer");
  container.innerHTML = "";

  if (typeof data === "string") {
    container.innerHTML = `<p>${data}</p>`;
    return;
  }

  // تعريف الأعمدة
  let columns = [];
  if (selectedSheet.includes("الترتيب العام")) {
    columns = ["الرقم", "اسم الطالب", "النقاط", "الترتيب"];
  } else {
    columns = ["اسم الطالب", "المشاركة", "الواجب", "السلوك", "الإختبار", "المجموع"];
  }

  const table = document.createElement("table");
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  const sortedData = selectedSheet.includes("الترتيب العام")
    ? data
    : [...data].sort((a, b) => (b["المجموع"] || 0) - (a["المجموع"] || 0));

  sortedData.forEach(row => {
    const tr = tbody.insertRow();
    columns.forEach(col => {
      const td = tr.insertCell();
      td.textContent = row[col] || 0;
    });
  });

  container.appendChild(table);
});
