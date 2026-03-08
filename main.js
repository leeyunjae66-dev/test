
const THEME_STORAGE_KEY = 'theme';

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const button = document.getElementById('theme-toggle');
  if (button) {
    button.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

class StockChart extends HTMLElement {
  constructor() {
    super();
    this.chart = null;
    const shadow = this.attachShadow({ mode: 'open' });

    const chartWrapper = document.createElement('div');
    chartWrapper.setAttribute('id', 'chart');

    shadow.appendChild(chartWrapper);

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
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
        mode: currentTheme,
        palette: 'palette1'
      }
    };

    this.chart = new ApexCharts(chartWrapper, options);
    this.chart.render();

    setInterval(() => {
        const newData = this.generateRandomData(1, this.chart.w.globals.series[0].data.length);
        this.chart.appendData([{
            data: newData
        }]);
    }, 3000);

    document.addEventListener('themechange', (event) => {
      if (!this.chart) {
        return;
      }

      this.chart.updateOptions(
        {
          theme: {
            mode: event.detail.theme,
            palette: 'palette1'
          }
        },
        false,
        true
      );
    });
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

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const themeToggleButton = document.getElementById('theme-toggle');
if (themeToggleButton) {
  themeToggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}
