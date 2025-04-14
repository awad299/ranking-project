
const sheetUrl = "https://script.google.com/macros/s/AKfycbyQri0kb_tQtFRkk0NiC7wQwB2yV24nAHCkJrcH8QeDDP2UFYDMS176375hCucWxPHl/exec";
let fullData = {};

fetch(sheetUrl)
  .then(res => res.json())
  .then(json => {
    if (json.success) {
      fullData = json.data;
      loadWeeks(Object.keys(fullData));
    } else {
      alert("فشل في تحميل البيانات");
    }
  });

function loadWeeks(weeks) {
  const select = document.getElementById("week-select");
  select.innerHTML = "";
  weeks.forEach(week => {
    const option = document.createElement("option");
    option.value = week;
    option.textContent = week;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    showWeekData(select.value);
  });
  showWeekData(weeks[0]);
}

function showWeekData(week) {
  const data = fullData[week];
  const container = document.getElementById("table-container");
  if (!data || !Array.isArray(data)) {
    container.innerHTML = "<p>لا توجد بيانات.</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead><tr><th>اسم الطالب</th><th>الرقم</th><th>الترتيب</th><th>النقاط</th></tr></thead>
    <tbody>
      ${data.map(student => `
        <tr onclick='showPopup(${JSON.stringify(student)})'>
          <td>${student["اسم الطالب"] || ""}</td>
          <td>${student["الرقم"] || ""}</td>
          <td>${student["الترتيب"] || ""}</td>
          <td>${student["النقاط"] || ""}</td>
        </tr>
      `).join("")}
    </tbody>
  `;
  container.innerHTML = "";
  container.appendChild(table);
}

function showPopup(student) {
  const popup = document.getElementById("popup");
  const body = document.getElementById("popup-body");
  const title = document.getElementById("popup-title");
  title.textContent = `تفاصيل: ${student["اسم الطالب"] || ""}`;
  
  let table = "<table><thead><tr><th>اليوم</th><th>المشاركة</th><th>الواجب</th><th>السلوك</th><th>الاختبار</th><th>المجموع</th></tr></thead><tbody>";
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  days.forEach(day => {
    const p = student[`${day} - المشاركة 5`] || 0;
    const h = student[`${day} - الواجب 10`] || 0;
    const b = student[`${day} - السلوك 10`] || 0;
    const t = student[`${day} - الإختبار 10`] || 0;
    const sum = Number(p) + Number(h) + Number(b) + Number(t);
    table += `<tr><td>${day}</td><td>${p}</td><td>${h}</td><td>${b}</td><td>${t}</td><td>${sum}</td></tr>`;
  });
  table += "</tbody></table>";
  body.innerHTML = table;
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
