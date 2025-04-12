
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyAML44GCL8BKxdM1QB8jmCzsQz8wBdxyv-CTlVBdL-QwQhYpeS7I-PKh9RcfU8v4bm/exec";
const output = document.getElementById("output");
const selector = document.getElementById("sheetSelector");

async function fetchData() {
    try {
        const res = await fetch(SHEET_URL);
        const json = await res.json();
        const sheets = Object.keys(json["النتائج"]);
        selector.innerHTML = sheets.map(s => `<option value="${s}">${s}</option>`).join("");
        selector.addEventListener("change", () => renderTable(json["النتائج"][selector.value]));
        renderTable(json["النتائج"][sheets[0]]);
    } catch (err) {
        output.innerHTML = "⚠ حدث خطأ أثناء تحميل البيانات";
    }
}

function renderTable(data) {
    if (!data || data.length === 0) {
        output.innerHTML = "⚠ لا توجد بيانات متاحة.";
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
