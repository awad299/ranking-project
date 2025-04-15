const scriptUrl = "https://script.google.com/macros/s/AKfycbzf1-nsN9EmHVY9xCAT4HISK3EQ5iGmfWF42VnosOA1OYUu_99oVm1QnWTDOUaXquIe/exec";
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

  if (typeof data === "string") {
    tableContainer.innerHTML = `<p>${data}</p>`;
    return;
  }

  const table = document.createElement("table");
  const headers = ["اسم الطالب", "المشاركة", "الواجب", "السلوك", "الإختبار", "المجموع"];
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
    let totalParticipation = 0, totalHomework = 0, totalBehavior = 0, totalTest = 0;

    ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].forEach(day => {
      totalParticipation += parseInt(row[`${day} - المشاركة`] || 0);
      totalHomework += parseInt(row[`${day} - الواجب`] || 0);
      totalBehavior += parseInt(row[`${day} - السلوك`] || 0);
      totalTest += parseInt(row[`${day} - الإختبار`] || 0);
    });

    const total = totalParticipation + totalHomework + totalBehavior + totalTest;

    const values = [
      row["اسم الطالب"],
      totalParticipation,
      totalHomework,
      totalBehavior,
      totalTest,
      total
    ];

    values.forEach(val => {
      const td = tr.insertCell();
      td.textContent = val || "";
    });

    tr.addEventListener("click", () => showStudentDetails(row["اسم الطالب"], data));
  });

  tableContainer.appendChild(table);
});

function showStudentDetails(name, weekData) {
  studentNameTitle.textContent = "تفاصيل: " + name;
  studentDetailsTable.innerHTML = "";
  const studentRow = weekData.find(row => row["اسم الطالب"] === name);
  if (!studentRow) return;

  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  days.forEach(day => {
    const tr = document.createElement("tr");
    let total = 0;
    const row = [day];

    ["المشاركة", "الواجب", "السلوك", "الإختبار"].forEach(type => {
      const key = `${day} - ${type}`;
      const val = parseInt(studentRow[key] || "0");
      row.push(val);
      total += val;
    });

    row.push(total);

    row.forEach((val, i) => {
      const td = document.createElement("td");
      td.textContent = val;
      if (i > 0 && i < 5) {
        if (val >= 10) td.className = "green";
        else if (val > 0) td.className = "orange";
        else td.className = "red";
      }
      tr.appendChild(td);
    });

    studentDetailsTable.appendChild(tr);
  });

  modal.style.display = "block";
}

modalClose.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };
