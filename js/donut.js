// Donut: all sizes energy consumption by Screen_Tech
(() => {
    const sel = d3.select("#donut");

    const render = (rows) => {
        sel.selectAll("svg").remove();

        const { width: W, height: H } = sel.node().getBoundingClientRect();
        const r = Math.min(W, H) / 2;

        const svg = sel.append("svg").attr("width", W).attr("height", H)
            .append("g").attr("transform", `translate(${W / 2},${H / 2})`);

        const data = rows.map(d => ({
            tech: d.Screen_Tech,
            mean: +d["Mean(Labelled energy consumption (kWh/year))"]
        }));

        const color = d3.scaleOrdinal().domain(data.map(d => d.tech)).range(d3.schemeTableau10);
        const arc = d3.arc().innerRadius(r * 0.5).outerRadius(r * 0.9);
        const pie = d3.pie().value(d => d.mean).sort(null);

        svg.selectAll("path")
            .data(pie(data))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.tech))
            .append("title").text(d => `${d.data.tech}: ${d.data.mean.toFixed(1)} kWh`);

        // Legend
        const legend = svg.append("g").attr("transform", `translate(${-r},${-r})`);
        legend.selectAll("g").data(data).join("g").attr("transform", (d, i) => `translate(0,${i * 18})`)
            .call(g => {
                g.append("rect").attr("width", 12).attr("height", 12).attr("fill", d => color(d.tech));
                g.append("text").attr("x", 18).attr("y", 10).text(d => d.tech);
            });
    };

    d3.csv("./data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(rows => {
        render(rows);
        new ResizeObserver(() => render(rows)).observe(sel.node());
    });
})();
