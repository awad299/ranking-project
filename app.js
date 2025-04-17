
const apiUrl = "https://script.google.com/macros/s/AKfycbw5LCQVD6n0CmvjoPTh_NW_IRXkEU3nv-FF19ug_eAXphox8zVeec6IVkVWQd_UN6Kw/exec";
const sheetSelector = document.getElementById("sheetSelector");
const studentsTable = document.getElementById("studentsTable");
const studentDetailsTable = document.getElementById("studentDetails").querySelector("tbody");
const detailsModal = document.getElementById("detailsModal");
const studentNameHeader = document.getElementById("studentName");

let allData = {};

document.querySelector(".close-button").addEventListener("click", () => {
  detailsModal.style.display = "none";
});

window.onclick = function(event) {
  if (event.target === detailsModal) {
    detailsModal.style.display = "none";
  }
};

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    allData = data["النتائج"];
    Object.keys(allData).forEach(sheet => {
      const option = document.createElement("option");
      option.value = sheet;
      option.textContent = sheet;
      sheetSelector.appendChild(option);
    });

    if (sheetSelector.options.length > 0) {
      sheetSelector.selectedIndex = 0;
      displaySheet(sheetSelector.value);
    }
  });

sheetSelector.addEventListener("change", () => {
  displaySheet(sheetSelector.value);
});

function displaySheet(sheetName) {
  const sheetData = allData[sheetName];
  studentsTable.querySelector("thead").innerHTML = "";
  studentsTable.querySelector("tbody").innerHTML = "";

  if (sheetName.includes("الصف السادس الاسبوع")) {
    buildWeeklyTable(sheetName, sheetData);
  } else {
    buildRankingTable(sheetData);
  }
}

function buildRankingTable(data) {
  const header = ["الترتيب", "الرقم", "النقاط", "اسم الطالب"];
  const thead = studentsTable.querySelector("thead");
  const tbody = studentsTable.querySelector("tbody");
  thead.innerHTML = `<tr>${header.map(h => `<th>${h}</th>`).join("")}</tr>`;

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row["الترتيب"]}</td>
      <td>${row["الرقم"]}</td>
      <td>${row["النقاط"]}</td>
      <td>${row["اسم الطالب"]}</td>
    `;
    tbody.appendChild(tr);
  });
}

function buildWeeklyTable(sheetName, data) {
  const thead = studentsTable.querySelector("thead");
  const tbody = studentsTable.querySelector("tbody");
  const header = ["اسم الطالب", "المشاركة", "الواجب", "السلوك", "الاختبار", "المجموع"];
  thead.innerHTML = `<tr>${header.map(h => `<th>${h}</th>`).join("")}</tr>`;

  data["الترتيب"].forEach(student => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="clickable-name">${student["اسم الطالب"]}</td>
      <td>${student["المشاركة"]}</td>
      <td>${student["الواجب"]}</td>
      <td>${student["السلوك"]}</td>
      <td>${student["الاختبار"]}</td>
      <td>${student["المجموع"]}</td>
    `;
    tr.querySelector(".clickable-name").addEventListener("click", () => {
      showDetails(sheetName, student["اسم الطالب"]);
    });
    tbody.appendChild(tr);
  });
}

function showDetails(sheetName, studentName) {
  const details = allData[sheetName]["تفاصيل"][studentName] || [];
  studentDetailsTable.innerHTML = "";
  studentNameHeader.textContent = `تفاصيل: ${studentName}`;
  details.forEach(day => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${day["اليوم"]}</td>
      <td>${day["المشاركة"]}</td>
      <td>${day["الواجب"]}</td>
      <td>${day["السلوك"]}</td>
      <td>${day["الاختبار"]}</td>
      <td>${day["المجموع"]}</td>
    `;
    studentDetailsTable.appendChild(row);
  });
  detailsModal.style.display = "block";
}
