const scriptUrl = "https://script.google.com/macros/s/AKfycbw5LCQVD6n0CmvjoPTh_NW_IRXkEU3nv-FF19ug_eAXphox8zVeec6IVkVWQd_UN6Kw/exec";

const weekSelect = document.getElementById("weekSelect");
const tableContainer = document.getElementById("tableContainer");
const modal = document.getElementById("studentModal");
const modalClose = document.querySelector(".close");
const studentNameTitle = document.getElementById("studentNameTitle");
const studentDetailsTable = document.querySelector("#studentDetailsTable tbody");

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

  if (!data) {
    tableContainer.innerHTML = "<p>لا توجد بيانات</p>";
    return;
  }

  // إذا كانت صفحة الترتيب العام
  if (Array.isArray(data)) {
    renderGeneralTable(data);
  } else {
    renderWeeklyTable(data);
  }
});

function renderGeneralTable(data) {
  const table = document.createElement("table");
  const headers = ["الرقم", "اسم الطالب", "النقاط", "الترتيب"];
  const thead = table.createTHead();
  const headRow = thead.insertRow();
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(row => {
    const tr = tbody.insertRow();
    headers.forEach(h => {
      const td = tr.insertCell();
      td.textContent = row[h] || "";
    });
  });

  tableContainer.appendChild(table);
}

function renderWeeklyTable(data) {
  const table = document.createElement("table");
  const headers = ["اسم الطالب", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"];
  const thead = table.createTHead();
  const headRow = thead.insertRow();
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data["الترتيب"].forEach(row => {
    const tr = tbody.insertRow();
    headers.forEach(h => {
      const td = tr.insertCell();
      td.textContent = row[h] || "";
    });
    tr.addEventListener("click", () => showStudentDetails(row["اسم الطالب"], data["تفاصيل"]));
  });

  tableContainer.appendChild(table);
}

function showStudentDetails(name, detailsData) {
  const records = detailsData[name];
  if (!records) return;

  studentNameTitle.textContent = "تفاصيل: " + name;
  studentDetailsTable.innerHTML = "";

  records.forEach(record => {
    const tr = document.createElement("tr");
    const fields = ["اليوم", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"];
    fields.forEach(f => {
      const td = document.createElement("td");
      td.textContent = record[f] ?? "";
      tr.appendChild(td);
    });
    studentDetailsTable.appendChild(tr);
  });

  modal.style.display = "block";
}

modalClose.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };
