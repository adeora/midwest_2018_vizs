/*
TODO:
- change timestep to years (252 days per year)
- axes labels
- graph titles
- better colors
*/

const unpack = (rows, key) => rows.map(row => +row[key]);
const average = (arr) => arr.map(x => x / arr.length).reduce((a, v) => a + v);

const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6'
];

let ys;
let timesteps;

Plotly.d3.csv('https://s3-us-west-2.amazonaws.com/public-stuff-abhi/factor_data_TEST_new.csv', (err, rows) => {
    timesteps = unpack(rows, 'timestep').map(v => v / 255);
    // iterate over the columns

    const keys = Object.keys(rows[0]).filter(k => k !== 'timestep' && k !== 'RAIN');

    ys = keys.map(k => unpack(rows, k).slice(50));

    // const data = Object.keys(rows[0]).filter(k => k !== 'timestep' && k !== 'RAIN').map((k, i) => {
    const data = keys.map((k, i) => {
        const y = ys[i];
        const trace = {
            type: 'scatter',
            mode: 'lines',
            name: k,
            // x: timesteps,
            // y: y,
            x: [timesteps[0], timesteps[1]],
            y: [y[0], y[1]],
            line: {
                color: colors[i],
            },
            fill: 'tozeroy',
        }

        if (average(y) > 1 && (k === 'SENTI' || k === 'TEMP')) {
            trace['xaxis'] = 'x5';
            trace['yaxis'] = 'y5';
        }
        
        if (k === 'VIX') {
            trace['xaxis'] = 'x2';
            trace['yaxis'] = 'y2';
        }

        if (average(y) < 1 && k !== 'RAIN') {
            trace['xaxis'] = 'x3';
            trace['yaxis'] = 'y3';
        }

        if (average(y) > 100) {
            trace['xaxis'] = 'x4';
            trace['yaxis'] = 'y4';
        }


        return trace;
    });

    console.log(data);

    const layout = {
        // 0-0.3, 0.35-0.65, 0.7-0.9

        // 1) other small bigs
        xaxis: {
            domain: [0, 1],
            title: 'Time (Years)',
        },
        yaxis: {
            domain: [0, 0.25],
            anchor: 'x',
            title: 'COPP & OIL'
        },

        // 2) VIX
        xaxis2: {
            domain: [0, 0.45],
            anchor: 'y2',
            title: 'Time (Years)',
        },
        yaxis2: {
            domain: [0.40, 0.6],
            anchor: 'x2',
            title: 'VIX'
        },
        
        // 3) small w/o VIX
        xaxis3: {
            domain: [0, 0.45],
            anchor: 'y3',
            title: 'Time (Years)',
        },
        yaxis3: {
            domain: [0.7, 1],
            anchor: 'x3',
            title: 'US_TRY & 3M_R'
        },

        // 4) big bigs
        xaxis4: {
            domain: [0.55, 1],
            anchor: 'y4',
            title: 'Time (Years)',
        },
        yaxis4: {
            domain: [0.7, 1],
            anchor: 'x4',
            title: 'BIG_IX & SMALL_IX',
        },

        // 5) some small bigs
        xaxis5: {
            domain: [0.55, 1],
            anchor: 'y5',
            title: 'Time (Years)',
        },
        yaxis5: {
            domain: [0.40, 0.6],
            anchor: 'x5',
            title: 'TEMP & SENTI'
        },
        title: 'Macro Factors',
        height: 0.95 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        hovermode: 'closest',
    };

    // document.getElementById('graph').on('plotly_beforehover', () => false);

    // Plotly.newPlot('graph', data, layout);
    Plotly.plot('graph', data, layout);
 });

function startDisplay() {
    let index = 2;
    const interval = setInterval(() => {
        const  new_traces = ys.map(y => [y[index]]); 
        index += 1;
        const indices = new Array(new_traces.length).fill().map((d, i) => i);
        const timestep = timesteps[index];
        const xs = new Array(new_traces.length).fill([timestep]);
        Plotly.extendTraces('graph', {
            x: xs,
            y: new_traces,
        }, indices);
    }, 300);

}
