let histData = null;
let currentRange = "Últimos 7 anos";
let currentOption = "brasil";

function displayError2(message) {
    const errorContainer = document.querySelector("#error-table");
    const chartsContainer = document.querySelector(".comparative");

    if (chartsContainer) {
        chartsContainer.innerHTML = "";
    }

    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
    }
}

function clearError2() {
    const errorContainer = document.querySelector("#error-table");
    if (errorContainer) {
        errorContainer.textContent = "";
        errorContainer.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHistBR();
    setupEvents();
});

function setupEvents() {
    const select = document.querySelector('.container.table select');
    if (select) {
        select.addEventListener("change", (e) => {
            currentOption = e.target.value;
            clearError2();
            if (currentOption === "brasil") {
                loadHistBR();
            } else if (currentOption === "estados") {
                loadHistSP();
            }
        });
    }

    document.querySelectorAll('input[name="years"]').forEach(radio => {
        radio.addEventListener('change', () => {
            currentRange = radio.value;
            clearError2();
            renderComparativeTable();
        });
    });
}

function loadHistBR() {
    fetch('/api/hist-br')
        .then(response => {
            if (!response.ok)
                throw new Error(`Erro na API: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            histData = data;
            clearError2();
            renderComparativeTable();
        })
        .catch(err => {
            console.error("Erro ao carregar histórico BR:", err);
            displayError2("Erro ao carregar dados históricos. Tente novamente mais tarde.");
        });
}

function loadHistSP() {
    fetch('/api/hist-sp')
        .then(response => {
            if (!response.ok)
                throw new Error(`Erro na API: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            histData = data;
            clearError2();
            renderComparativeTable();
        })
        .catch(err => {
            console.error("Erro ao carregar histórico SP:", err);
            displayError2("Erro ao carregar dados históricos. Tente novamente mais tarde.");
        });
}

function renderComparativeTable() {
    const container = document.querySelector('.comparative');
    container.innerHTML = "";

    if (!histData || !histData.table) {
        displayError2("Dados não carregados.");
        return;
    }
    clearError2();

    let rows = histData.table.slice(0, histData.table.length - 3);

    if (currentRange === "Últimos 7 anos") {
        rows = rows.filter(r => !isNaN(parseInt(r.ano))).slice(-7);
    }

    const months = [
        "janeiro", "fevereiro", "marco", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const table = document.createElement("table");
    table.classList.add("comparative-table");
    let thead = `
        <thead>
            <tr>
                <th>ANO</th>
                ${months.map(m => `<th>${m.toUpperCase(m)}</th>`).join("")}
                <th>TOTAL</th>
            </tr>
        </thead>
    `;

    let tbody = "<tbody>";
    rows.forEach(row => {
        tbody += `
            <tr>
                <td>${row.ano ?? "-"}</td>
                ${months.map(m => `<td>${row[m] ?? "-"}</td>`).join("")}
                <td>${row.total  ?? "-"}</td>
            </tr>
        `;
    });
    tbody += "</tbody>";
    table.innerHTML = thead + tbody;
    container.appendChild(table);
    highlightMinMax(table);
}

function highlightMinMax(table) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    if (!rows.length) return;
    const colCount = rows[0].children.length;

    for (let col = 1; col < colCount; col++) {
        let values = [];
        rows.forEach(row => {
            const num = parseFloat(row.children[col].textContent.replace(",", "."));
            if (!isNaN(num)) values.push(num);
        });

        if (!values.length) continue;

        const min = Math.min(...values);
        const max = Math.max(...values);
        rows.forEach(row => {
            const cell = row.children[col];
            const value = parseFloat(cell.textContent.replace(",", "."));

            if (value === min) {
                cell.style.color = "#FFC107";
            }
            if (value === max) {
                cell.style.color = "#E53935";
            }
        });
    }
}
