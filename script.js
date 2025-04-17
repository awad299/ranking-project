const scriptUrl = "https://script.google.com/macros/s/AKfycbw5LCQVD6n0CmvjoPTh_NW_IRXkEU3nv-FF19ug_eAXphox8zVeec6IVkVWQd_UN6Kw/exec";
const weekSelect = document.getElementById("weekSelect");
const tableContainer = document.getElementById("tableContainer");
const modal = document.getElementById("studentModal");
const modalClose = document.querySelector(".close");
const studentNameTitle = document.getElementById("studentNameTitle");
const studentDetailsTable = document.querySelector("#studentDetailsTable");

let sheetData = {};

fetch(scriptUrl)
  .then(res => res.json())
  .then(json => {
    sheetData = json["النتائج"];
    weekSelect.innerHTML = '<option disabled selected>اختر الأسبوع</option>';
    for (let sheetName in sheetData) {
      const option = document.createElement("option");
      option.value = sheetName;
      option.textContent = sheetName;
      weekSelect.appendChild(option);
    }
  });

weekSelect.addEventListener("change", () => {
  const weekName = weekSelect.value;
  const data = sheetData[weekName];
  tableContainer.innerHTML = "";

  if (typeof data === "string") {
    tableContainer.innerHTML = `<p>${data}</p>`;
    return;
  }

  if (data.الترتيب) {
    renderWeeklyTable(data.الترتيب, weekName);
  } else {
    renderRankingTable(data, weekName);
  }
});

function renderRankingTable(data, weekName) {
  const table = document.createElement("table");
  const thead = table.createTHead();
  const row = thead.insertRow();
  ["الرقم", "اسم الطالب", "النقاط", "الترتيب"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    row.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(item => {
    const tr = tbody.insertRow();
    ["الرقم", "اسم الطالب", "النقاط", "الترتيب"].forEach(h => {
      const td = tr.insertCell();
      td.textContent = item[h];
    });
  });

  tableContainer.appendChild(table);
}

function renderWeeklyTable(data, weekName) {
  const table = document.createElement("table");
  const thead = table.createTHead();
  const row = thead.insertRow();
  ["اسم الطالب", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    row.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(item => {
    const tr = tbody.insertRow();
    ["اسم الطالب", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"].forEach(h => {
      const td = tr.insertCell();
      td.textContent = item[h];
    });

    tr.addEventListener("click", () => showStudentDetails(item["اسم الطالب"], weekName));
  });

  tableContainer.appendChild(table);
}

function showStudentDetails(name, weekName) {
  const details = sheetData[weekName]["تفاصيل"][name];
  if (!details) return;

  studentNameTitle.textContent = "تفاصيل: " + name;
  studentDetailsTable.innerHTML = "";

  details.forEach(d => {
    const tr = document.createElement("tr");
    ["اليوم", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"].forEach(key => {
      const td = document.createElement("td");
      td.textContent = d[key];
      tr.appendChild(td);
    });
    studentDetailsTable.appendChild(tr);
  });

  modal.style.display = "block";
}

modalClose.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };
