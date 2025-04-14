
const apiUrl = "https://script.google.com/macros/s/AKfycbyQri0kb_tQtFRkk0NiC7wQwB2yV24nAHCkJrcH8QeDDP2UFYDMS176375hCucWxPHl/exec";

let rawData = {};
let currentStudents = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(apiUrl)
    .then(res => res.json())
    .then(json => {
      rawData = json.data;
      const weekSelect = document.getElementById("weekSelect");
      const weekNames = Object.keys(rawData).filter(k => k !== "الترتيب العام للصف السادس");
      weekSelect.innerHTML = weekNames.map(w => `<option value="${w}">${w}</option>`).join("");
      displayWeek(weekNames[0]);
      weekSelect.addEventListener("change", e => displayWeek(e.target.value));
    });

  document.getElementById("closeModal").onclick = () => {
    document.getElementById("modal").style.display = "none";
  };
});

function displayWeek(weekName) {
  const data = rawData[weekName];
  currentStudents = data;
  const table = document.getElementById("studentsTable");
  const headers = Object.keys(data[0]);
  const displayHeaders = ["الاسم", "المشاركة 5", "الواجب 10", "السلوك 10", "الاختبار 10", "المجموع 30", "الاختبار 10", "المجموع", "الترتيب", "النقاط"];
  const keys = headers.filter(h => displayHeaders.includes(h));
  table.innerHTML = `
    <thead><tr>${keys.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>
      ${data.map(student => `
        <tr onclick="showDetails('${student['اسم الطالب']}')">
          ${keys.map(k => `<td>${student[k] || 0}</td>`).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;
}

function showDetails(name) {
  const student = currentStudents.find(s => s["اسم الطالب"] === name);
  if (!student) return;
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const metrics = ["المشاركة 5", "الواجب 10", "السلوك 10", "الاختبار 10"];

  let rows = days.map(day => {
    let row = [day];
    let total = 0;
    metrics.forEach(metric => {
      const key = `${day} - ${metric}`;
      const value = Number(student[key] || 0);
      row.push(value);
      total += value;
    });
    row.push(total);
    return row;
  });

  const detailTable = document.getElementById("detailsTable");
  detailTable.innerHTML = `
    <thead><tr><th>اليوم</th><th>المشاركة</th><th>الواجب</th><th>السلوك</th><th>الاختبار</th><th>المجموع</th></tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
  `;

  document.getElementById("studentName").textContent = `تفاصيل: ${name}`;
  document.getElementById("modal").style.display = "block";
}
