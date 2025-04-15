
const API_URL = "https://script.google.com/macros/s/AKfycbxVxFRjiisvBKay5F9YMruf-I6Gvcme9BMVuxV1kNbpyHZsfyKVmm_PUNxkra1rfSgt/exec";

// تحميل قائمة الأوراق ثم البيانات عند الاختيار
async function loadSheets() {
  const response = await fetch(API_URL);
  const result = await response.json();
  if (result.data) {
    const sheetSelect = document.getElementById("sheetSelect");
    for (const sheetName in result.data) {
      const option = document.createElement("option");
      option.value = sheetName;
      option.textContent = sheetName;
      sheetSelect.appendChild(option);
    }

    // عرض بيانات الورقة الأولى تلقائيًا
    displayData(result.data[sheetSelect.value]);

    sheetSelect.addEventListener("change", () => {
      displayData(result.data[sheetSelect.value]);
    });
  }
}

function displayData(students) {
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";
  students.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student["اسم الطالب"]}</td>
      <td>${student["المشاركة"]}</td>
      <td>${student["الواجب"]}</td>
      <td>${student["السلوك"]}</td>
      <td>${student["الاختبار"]}</td>
      <td>${student["المجموع"]}</td>
    `;
    tbody.appendChild(row);
  });
}

loadSheets();
