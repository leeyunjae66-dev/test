
class StockChart extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const chartWrapper = document.createElement('div');
    chartWrapper.setAttribute('id', 'chart');

    shadow.appendChild(chartWrapper);

    const options = {
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      series: [{
        name: 'Sample Stock',
        data: this.generateRandomData(20)
      }],
      xaxis: {
        type: 'datetime',
        range: 60 * 60 * 1000 * 24 * 7 // 7 days
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          }
        }
      },
      stroke: {
        curve: 'smooth'
      },
      theme: {
        mode: 'dark',
        palette: 'palette1'
      }
    };

    const chart = new ApexCharts(chartWrapper, options);
    chart.render();

    setInterval(() => {
        const newData = this.generateRandomData(1, chart.w.globals.series[0].data.length);
        chart.appendData([{
            data: newData
        }]);
    }, 3000);
  }

  generateRandomData(count, offset = 0) {
    const data = [];
    const time = new Date().getTime();
    for (let i = 0; i < count; i++) {
        const x = time + (i + offset) * 60 * 60 * 1000; // hourly data
        const y = Math.floor(Math.random() * (180 - 150 + 1)) + 150;
        data.push([x, y]);
    }
    return data;
  }
}

customElements.define('stock-chart', StockChart);
