
const scriptUrl = "https://script.google.com/macros/s/AKfycbzn75e2mARv8VScQujhR876f6FUgLm0mpmFn_dsFGUcqH00rqqP0u2W4uFxE-69UXQ0/exec";

fetch(scriptUrl)
  .then(res => res.json())
  .then(json => {
    const data = json["النتائج"];
    const selector = document.getElementById("sheetSelector");
    const container = document.getElementById("tableContainer");

    Object.keys(data).forEach(sheet => {
      const option = document.createElement("option");
      option.value = sheet;
      option.textContent = sheet;
      selector.appendChild(option);
    });

    selector.addEventListener("change", () => {
      const sheetName = selector.value;
      const rows = data[sheetName];
      container.innerHTML = "";

      if (typeof rows === "string") {
        container.textContent = rows;
        return;
      }

      const table = document.createElement("table");
      const thead = table.createTHead();
      const tbody = table.createTBody();

      if (rows.length === 0) {
        container.textContent = "لا توجد بيانات";
        return;
      }

      const headerRow = thead.insertRow();
      Object.keys(rows[0]).forEach(key => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
      });

      rows.forEach(row => {
        const tr = tbody.insertRow();
        Object.values(row).forEach(cell => {
          const td = tr.insertCell();
          td.textContent = cell !== undefined ? cell : "";
        });
      });

      container.appendChild(table);
    });
  });
