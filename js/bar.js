// Bar: 55-inch TVs by screen tech
(() => {
    const sel = d3.select("#barChart");

    const render = (rows) => {
        sel.selectAll("svg").remove();

        const { width: W, height: H } = sel.node().getBoundingClientRect();
        const m = { top: 20, right: 10, bottom: 40, left: 60 };
        const w = W - m.left - m.right;
        const h = H - m.top - m.bottom;

        const svg = sel.append("svg").attr("width", W).attr("height", H);
        const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

        const data = rows.map(d => ({
            tech: d.Screen_Tech,
            mean: +d["Mean(Labelled energy consumption (kWh/year))"]
        }));

        const x = d3.scaleBand().domain(data.map(d => d.tech)).range([0, w]).padding(0.3);
        const y = d3.scaleLinear().domain([0, d3.max(data, d => d.mean)]).nice().range([h, 0]);

        g.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x));
        g.append("g").call(d3.axisLeft(y));

        g.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.tech))
            .attr("y", d => y(d.mean))
            .attr("width", x.bandwidth())
            .attr("height", d => h - y(d.mean))
            .attr("fill", "#8ad0ff")
            .append("title").text(d => `${d.tech}: ${d.mean.toFixed(1)} kWh`);
    };

    d3.csv("./data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(rows => {
        render(rows);
        new ResizeObserver(() => render(rows)).observe(sel.node());
    });
})();
