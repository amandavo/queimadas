let periodData = null;
let currentPeriod = "daily";
let currentView = "table";
let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    loadDaily();
    setupFilter();
    setupIcons();
});

function displayError(message) {
    const errorContainer = document.querySelector("#error-message");
    const chartsContainer = document.querySelector(".charts"); 

    if (chartsContainer) {
        chartsContainer.innerHTML = ""; 
    }

    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
    }
}

function clearError() {
    const errorContainer = document.querySelector("#error-message");
    if (errorContainer) {
        errorContainer.textContent = "";
        errorContainer.style.display = "none";
    }
}

function setupIcons() {
    document.querySelectorAll('.period i').forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.period i').forEach(i => i.classList.remove('icon-selected'));
            icon.classList.add('icon-selected');

            const period = icon.getAttribute('data-period');
            clearError();
            if (period === 'daily') {
                currentPeriod = 'daily';
                loadDaily();
            } else if (period === 'monthly') {
                currentPeriod = 'monthly';
                loadMonthly();
            } else if (period === 'annual') {
                currentPeriod = 'annual';
                loadAnnual();
            }
        });
    });

    document.querySelectorAll('.graphic i').forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.graphic i').forEach(i => i.classList.remove('icon-selected'));
            icon.classList.add('icon-selected');

            const type = icon.getAttribute('data-type');
            clearError();
            if (type === 'table') {
                currentView = 'table';
                reRenderCurrentView();
            } else if (type === 'pie') {
                currentView = 'pie';
                reRenderCurrentView();
            } else if (type === 'bar') {
                currentView = 'bar';
                reRenderCurrentView();
            }
        });
    });
}

function setupFilter() {
    const select = document.querySelector("#options");
    if (!select) return;
    select.addEventListener("change", () => {
        if (!periodData) {
            displayError("Os dados ainda não foram carregados. Tente novamente.");
            return;
        }
        reRenderCurrentView();
    });
}

function reRenderCurrentView() {
    const filterType = document.querySelector("#options").value;
    if (currentView === "table") {
        renderFilteredTable(filterType);
    } else if (currentView === "pie") {
        renderPieChart(filterType);
    } else if (currentView === "bar") {
        renderBarChart(filterType);
    }
}

function loadDaily() {
    fetch('/api/daily')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            periodData = data;
            const first = new Date(data.table[0].data_hora_gmt);
            const formatted_date = first.toLocaleDateString('pt-BR');
            document.querySelector("#period").textContent =
                `Período: Diário - ${formatted_date}`;
            reRenderCurrentView();
        })
        .catch(err => {
            console.error("Erro ao carregar dados diário:", err);
            displayError("Erro ao carregar os dados diários. Tente novamente mais tarde.");
        });
}

function loadMonthly() {
    fetch('/api/monthly')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            periodData = data;
            const first = new Date(data.table[0].data_hora_gmt);
            const last = new Date(data.table[data.table.length - 1].data_hora_gmt);
            const formatted_date_first = first.toLocaleDateString('pt-BR');
            const formatted_date_last = last.toLocaleDateString('pt-BR');
            document.querySelector("#period").textContent =
                `Período: Mensal - ${formatted_date_first} até ${formatted_date_last}`;
            reRenderCurrentView();
        })
        .catch(err => {
            console.error("Erro ao carregar dados mensais:", err);
            displayError("Erro ao carregar os dados mensais. Tente novamente mais tarde.");
        });
}

function loadAnnual() {
    fetch('/api/annual')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            periodData = data;
            const first = new Date(data.table[0].data_pas).getFullYear();
            document.querySelector("#period").textContent = `Período: Anual - ${first}`;
            reRenderCurrentView();
        })
        .catch(err => {
            console.error("Erro ao carregar dados anuais:", err);
            displayError("Erro ao carregar os dados anuais. Tente novamente mais tarde.");
        });
}

function renderFilteredTable(filterType) {
    destroyChartIfAny();
    const container = document.querySelector('.charts');
    container.innerHTML = "";
    if (!periodData) return;
    const group = {};

    periodData.table.forEach(row => {
        let key = row[filterType] ?? "—";

        if (!group[key]) {
            group[key] = {
                nome: key,
                total: 0,
                satelite: row.satelite,
                estado: row.estado,
                municipio: row.municipio,
                pais: row.pais,
                bioma: row.bioma
            };
        }
        group[key].total++;
    });

    const tableContainer = document.createElement("div");
    tableContainer.classList.add("daily-table-container");


    const table = document.createElement("table");
    table.classList.add("daily-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>${filterType.toUpperCase()}</th>
                <th>TOTAL</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    const sorted = Object.values(group).sort((a, b) => b.total - a.total).slice(0, 30);
    
    sorted.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.total}</td>
        `;
        tbody.appendChild(tr);
    });

    tableContainer.appendChild(table);
    document.querySelector(".charts").appendChild(tableContainer);
}

function groupAndSortData(data, filterType, limit) {
    const group = {};

    data.forEach(row => {
        let key = row[filterType] ?? "—";
        group[key] = (group[key] || 0) + 1;
    });

    return Object.entries(group)
        .map(([nome, total]) => ({ nome, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
}

function renderPieChart(filterType) {
    destroyChartIfAny();
    const container = document.querySelector('.charts');
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.id = "pieChart";
    container.appendChild(canvas);
    const sorted = groupAndSortData(periodData.table, filterType, 10);
    const labels = sorted.map(i => i.nome);
    const values = sorted.map(i => i.total);
    const totalSum = values.reduce((a, b) => a + b, 0);
    
    const backgroundColors = generateColorPalette(labels.length);
    const plugins = [];
    if (window.ChartDataLabels) plugins.push(ChartDataLabels);

    chartInstance = new Chart(canvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
            }]
        },
        plugins: plugins,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { right: 20 } },
            plugins: {
                legend: { position: "right", align: "center" },
                datalabels: {
                    color: "#000",
                    font: { weight: "bold", size: 11 },
                    formatter: (value) => {
                        let pct = totalSum ? (value / totalSum * 100).toFixed(1) : "0.0";
                        return pct >= 2 ? `${pct}%` : "";
                    }
                }
            }
        }
    });
}

function renderBarChart(filterType) {
    destroyChartIfAny();
    const container = document.querySelector('.charts');
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.id = "barChart";
    container.appendChild(canvas);
    const sorted = groupAndSortData(periodData.table, filterType, 10);
    const labels = sorted.map(i => i.nome);
    const values = sorted.map(i => i.total);
    const backgroundColors = generateColorPalette(labels.length);

    chartInstance = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total",
                data: values,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function destroyChartIfAny() {
    if (chartInstance && typeof chartInstance.destroy === "function") {
        chartInstance.destroy();
        chartInstance = null;
    }
}

function generateColorPalette(n) {
    const colors = [];
    const seed = 37;
    for (let i = 0; i < n; i++) {
        const h = (i * seed) % 360;
        colors.push(`hsl(${h} 75% 55%)`);
    }
    return colors;
}