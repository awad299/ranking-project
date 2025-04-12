const SHEET_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgUfqq8iE8JGSYKTKTItVz-1cmwxBfviIFHC3_WDokoDphqO5DaUQ3k4myaHWQlHMvPG6HTZDMziPif6LYFxk0bbBwJjJSOf4bINyL0cnOBxxAZkbcrJXpcIke-AhrCzBA05h3FbZbOJbqVZ-Qm44ErLQHC4gpRc8GP0WQU2pMylyFXLUcHNo8gACtc-sPvICneQUKYvNAL66R5TwhLSYv_DMaZc9hnl694kjSfQJqJUdW9SgTMvTQfT1hW9yLXQgn_3pOraSnnLvo3VJyLLQasgK6vcw&lib=McV44pOckP5YBKfAf6ofWizjQ8ssKZD3w";

const output = document.getElementById("output");
const selector = document.getElementById("sheetSelector");
let data = {};

async function fetchData() {
  output.innerHTML = "جاري تحميل البيانات...";
  try {
    const res = await fetch(SHEET_URL);
    const json = await res.json();

    if (!json["النتائج"]) {
      output.innerHTML = "البيانات غير متوفرة.";
      return;
    }

    data = json["النتائج"];
    selector.innerHTML = "";

    Object.keys(data).forEach(sheet => {
      const option = document.createElement("option");
      option.value = sheet;
      option.textContent = sheet;
      selector.appendChild(option);
    });

    if (Object.keys(data).length > 0) {
      selector.value = Object.keys(data)[0];
      renderTable(selector.value);
    }
  } catch (err) {
    output.innerHTML = "حدث خطأ في تحميل البيانات.";
    console.error(err);
  }
}

function renderTable(sheetName) {
  const rows = data[sheetName];
  if (!rows || rows.length === 0) {
    output.innerHTML = "لا توجد بيانات.";
    return;
  }

  let html = "<table><thead><tr>";
  rows[0].forEach(cell => {
    html += `<th>${cell}</th>`;
  });
  html += "</tr></thead><tbody>";

  rows.slice(1).forEach(row => {
    html += "<tr>";
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  output.innerHTML = html;
}

selector.addEventListener("change", () => {
  renderTable(selector.value);
});

fetchData();