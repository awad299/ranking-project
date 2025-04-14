
const scriptURL = "https://script.google.com/macros/s/AKfycbyQri0kb_tQtFRkk0NiC7wQwB2yV24nAHCkJrcH8QeDDP2UFYDMS176375hCucWxPHl/exec";

let allData = {};
const select = document.getElementById("week-select");
const container = document.getElementById("data-container");

fetch(scriptURL)
  .then(response => response.json())
  .then(json => {
    allData = json["النتائج"] || json.data || {};
    select.innerHTML = '<option disabled selected>اختر الأسبوع</option>';
    Object.keys(allData).forEach(week => {
      const option = document.createElement("option");
      option.value = week;
      option.textContent = week;
      select.appendChild(option);
    });
  })
  .catch(error => {
    select.innerHTML = '<option disabled>فشل في تحميل البيانات</option>';
    console.error(error);
  });

function displayWeekData(week) {
  const data = allData[week];
  if (!data || !Array.isArray(data)) return;

  let html = "<table><thead><tr>";
  const headers = Object.keys(data[0]);
  headers.forEach(h => html += `<th>${h}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    headers.forEach(h => html += `<td>${row[h] ?? ""}</td>`);
    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}
