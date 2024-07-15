let myChart;

async function convertirMoneda() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return null;
    }
}

async function convertirValor() {
    const valor = (document.getElementById("valor").value);
    const moneda = document.getElementById("moneda").value;
    const resultadoP = document.getElementById("resultado");
    const data = await convertirMoneda();

    if (data) {
        const valorConvertido = valor / data[moneda].valor;
        resultadoP.textContent = `El valor convertido es ${valorConvertido.toFixed(2)} ${data[moneda].codigo}`;
        return data;
    } else {
        resultadoP.textContent = "Error al obtener datos de la API.";
        return null;
    }
}

async function crearGrafico() {
    const data = await convertirValor();
    let datosUrl = "";

    if (data) {
        if (moneda === "dolar") {
            datosUrl = "https://mindicador.cl/api/dolar/2024";
        } else if (moneda === "euro") {
            datosUrl = "https://mindicador.cl/api/euro/2024";
        } else if (data[moneda] === "uf") {
            datosUrl = "https://mindicador.cl/api/uf/2024";
        }
    }

    const res = await fetch(datosUrl);
    const cambios = await res.json();

    const info = cambios.serie.slice(0, 10); 

    const labels = info.map((cambio) => cambio.fecha.split("T")[0].split('-').reverse().join('-'));
    const dataValues = info.map((cambio) => cambio.valor);

    const datasets = [{
        label: "Cambio",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 255, 255, 1)",
        data: dataValues,
    }];

    return { labels, datasets };
}

async function renderGrafica() {
    const data = await crearGrafico();
    if (myChart) {
        myChart.destroy(); 
    }

    const config = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Valores de los últimos 10 días',
              data,
              pointRadius: 7,
              borderColor: 'white',
              borderWidth: 1,
              pointBackgroundColor: 'orange',
              pointBorderColor: 'transparent',
              datalabels: {
                color: 'white'
              }
            }
          ]
        },
        options: {
          responsive: true,
          devicePixelRatio: window.devicePixelRatio,
          maintainAspectRatio: false,
          scales: {
            y: { ticks: { color: 'white', callback: value => '$' + value } },
            x: { ticks: { color: 'white' } }
          },
          plugins: { legend: { labels: { color: 'white' } } }
        }
      };

    const ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.style.backgroundColor = "white";

    myChart = new Chart(ctx, config); 
    };

    renderGrafica();
