const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22'
];

const unpack = (rows, key) => rows.map(row => +row[key]);
const average = (arr) => arr.map(x => x / arr.length).reduce((a, v) => a + v);
const squaredDiffs = (arr, avg) => arr.map(x => Math.pow(x - avg, 2)); 

Plotly.d3.csv('data/normalized_pnl.csv', (err, rows) => {
    // console.log(rows);
    // rows = rows.slice(0, 100);
    const timesteps = unpack(rows, '').map(v => v / 255);

    const ys = Object.keys(rows[0]).filter(k => k !== '').map(k => {
        const arr = unpack(rows, k);
        const stdevs = arr.map((y, i) => arr.slice((i > 50) ? i - 50 : 0, i + 1)).map((subarr, i) => {
            if (i < 50) {
                return 0;
            }
            const avg = average(subarr);
            const sqdiffs = squaredDiffs(subarr, avg);
            const stdev = Math.sqrt(average(sqdiffs));
            return (stdev === 0) ? 0 : 1 / stdev;
        });
        stdevs[0] = stdevs[1];
        console.log(stdevs);
        // return unpack(rows, k)
        return stdevs;
    });

    const data = Object.keys(rows[0]).filter(k => k !== '').map((k, i) => {
        const y = ys[i];
        const trace = {
            type: 'scatter',
            mode: 'line+markers+text',
            text: [k],
            textposition: 'top',
            mode: 'lines',
            name: k,
            x: [timesteps[0], timesteps[1]],
            y: [y[0], y[1]],
            color: i % colors.length,
            fill: 'tozeroy',
        };
        return trace;
    });

    const layout = {
        title: 'Inverse 50-Day Rolling Std (1 / 50-day rolling std)',
        height: 0.95 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        xaxis: {
            title: 'Time (Years)',
        },
        yaxis: {
            // type: 'log',
            // autorange: true,
            title: 'Inverse 50-Day Rolling Std'
        }
    };
    Plotly.plot('graph', data, layout);

    let index = 2;
    const interval = setInterval(() => {
        console.log(index);
        // const new_traces = Object.keys(rows[0]).filter(k => k !== '').map((k, i) => {
        //     const y = ;
        //     return [y[index]];
        // });
        const  new_traces = ys.map(y => [y[index]]); 
        index += 1;
        const indices = new Array(new_traces.length).fill().map((d, i) => i);
        const timestep = timesteps[index];
        const xs = new Array(new_traces.length).fill([timestep]);
        Plotly.extendTraces('graph', {
            x: xs,
            y: new_traces,
        }, indices);
    }, 1);


});