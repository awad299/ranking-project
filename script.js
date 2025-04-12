const SHEET_URL = "https://script.google.com/macros/s/AKfycbyAML44GCL8BKxdM1QB8jmCzsQz8wBdxyv-CTlVBdL-QwQhYpeS7I-PKh9RcfU8v4bm/exec";

const output = document.getElementById("output");
const selector = document.getElementById("sheetSelector");

async function fetchData() {
  output.innerHTML = "⏳ جاري تحميل البيانات...";

  try {
    const res = await fetch(SHEET_URL);
    const json = await res.json();
    const data = json["النتائج"];

    selector.innerHTML = "";

    for (const sheetName in data) {
      const option = document.createElement("option");
      option.value = sheetName;
      option.textContent = sheetName;
      selector.appendChild(option);
    }

    renderTable(data[selector.value]);

    selector.addEventListener("change", () => {
      renderTable(data[selector.value]);
    });
  } catch (error) {
    output.innerHTML = "❌ حدث خطأ في تحميل البيانات. تحقق من الرابط.";
    console.error(error);
  }
}

function renderTable(data) {
  if (!Array.isArray(data)) {
    output.innerHTML = "⚠️ لا توجد بيانات متاحة.";
    return;
  }

  let html = "<table><thead><tr>";
  html += Object.keys(data[0]).map(h => `<th>${h}</th>`).join("");
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    html += Object.values(row).map(val => `<td>${val || ""}</td>`).join("");
    html += "</tr>";
  });

  html += "</tbody></table>";
  output.innerHTML = html;
}

fetchData();
