const apiURL = "https://script.google.com/macros/s/AKfycbw5LCQVD6n0CmvjoPTh_NW_IRXkEU3nv-FF19ug_eAXphox8zVeec6IVkVWQd_UN6Kw/exec";

let allData = {};
let currentSheet = "";

fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    allData = data["النتائج"];
    const selector = document.getElementById("sheetSelector");
    Object.keys(allData).forEach(sheet => {
      const option = document.createElement("option");
      option.textContent = sheet;
      selector.appendChild(option);
    });
    selector.addEventListener("change", () => renderSheet(selector.value));
    renderSheet(selector.value);
  });

function renderSheet(sheetName) {
  currentSheet = sheetName;
  const container = document.getElementById("contentArea");
  container.innerHTML = "";

  const sheet = allData[sheetName];
  const data = sheet["الترتيب"] || sheet;

  const table = document.createElement("table");
  const headers = Object.keys(data[0]);
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(student => {
    const row = tbody.insertRow();
    headers.forEach(h => {
      const cell = row.insertCell();
      cell.textContent = student[h];
    });

    if (sheet["تفاصيل"]) {
      row.addEventListener("click", () => showDetails(student["اسم الطالب"]));
    }
  });

  container.appendChild(table);
}

function showDetails(name) {
  const details = allData[currentSheet]["تفاصيل"][name];
  if (!details) return;

  const modal = document.getElementById("modal");
  const content = document.getElementById("studentDetails");

  content.innerHTML = `<h3>تفاصيل: ${name}</h3>`;
  const table = document.createElement("table");

  const headers = ["اليوم", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"];
  const thead = table.createTHead().insertRow();
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    thead.appendChild(th);
  });

  const tbody = table.createTBody();
  details.forEach(d => {
    const row = tbody.insertRow();
    headers.forEach(h => {
      const cell = row.insertCell();
      cell.textContent = d[h] || 0;
    });
  });

  content.appendChild(table);
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
