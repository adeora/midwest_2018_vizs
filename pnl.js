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

Plotly.d3.csv('data/normalized_pnl.csv', (err, rows) => {
    // console.log(rows);
    // rows = rows.slice(0, 100);
    const timesteps = unpack(rows, '').map(v => v / 255);

    const ys = Object.keys(rows[0]).filter(k => k !== '').map(k => {
        // return unpack(rows, k).map(v => v * 100).reduce((a,b,i) => i === 0 ? [100 + b] : a.concat(a[i-1]*(1+b)), 100);
        return unpack(rows, k).map(v => v * 100).reduce((a,b,i) => i === 0 ? [100 + b] : a.concat(a[i-1] + (a[i-1]*b)), 100);
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
        title: 'pnl',
        height: 0.95 * window.innerHeight,
        width: 0.95 * window.innerWidth,
        yaxis: {
            type: 'log',
            autorange: true,
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