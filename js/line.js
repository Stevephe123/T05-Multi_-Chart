// Line chart: average power prices 1998–2024
(() => {
    const sel = d3.select("#lineChart");

    const render = (rows) => {
        sel.selectAll("svg").remove();

        const { width: W, height: H } = sel.node().getBoundingClientRect();
        const m = { top: 24, right: 20, bottom: 40, left: 60 };
        const w = W - m.left - m.right;
        const h = H - m.top - m.bottom;

        const data = rows.map(d => ({
            year: +d.Year,
            avg: +d["Average Price (notTas-Snowy)"]
        })).filter(d => d.year && d.avg);

        const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, w]);
        const y = d3.scaleLinear().domain([0, d3.max(data, d => d.avg)]).nice().range([h, 0]);

        const svg = sel.append("svg").attr("width", W).attr("height", H);
        const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

        g.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        g.append("g").call(d3.axisLeft(y));

        const line = d3.line().x(d => x(d.year)).y(d => y(d.avg));
        g.append("path").datum(data).attr("fill", "none").attr("stroke", "#8ad0ff").attr("stroke-width", 2).attr("d", line);

        g.append("text").attr("x", w / 2).attr("y", h + 32).attr("text-anchor", "middle").text("Year");
        g.append("text").attr("x", -h / 2).attr("y", -44).attr("transform", "rotate(-90)").attr("text-anchor", "middle").text("Average Price ($/MWh)");
    };

    d3.csv("./data/Ex5_ARE_Spot_Prices.csv").then(rows => {
        render(rows);
        new ResizeObserver(() => render(rows)).observe(sel.node());
    });
})();
