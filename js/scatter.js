// Scatter plot: energy consumption vs star rating
(() => {
    const sel = d3.select("#scatterChart");
    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    const render = (rows) => {
        sel.selectAll("svg").remove();

        const { width: W, height: H } = sel.node().getBoundingClientRect();
        const m = { top: 24, right: 18, bottom: 40, left: 48 };
        const w = W - m.left - m.right;
        const h = H - m.top - m.bottom;

        const svg = sel.append("svg").attr("width", W).attr("height", H);
        const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

        const data = rows.map(d => ({
            brand: d.brand,
            tech: d.screen_tech,
            size: +d.screensize,
            star: +d.star2,
            energy: +d.energy_consumpt
        })).filter(d => d.star && d.energy);

        const x = d3.scaleLinear().domain(d3.extent(data, d => d.star)).nice().range([0, w]);
        const y = d3.scaleLinear().domain(d3.extent(data, d => d.energy)).nice().range([h, 0]);
        const color = d3.scaleOrdinal().domain([...new Set(data.map(d => d.tech))]).range(d3.schemeTableau10);

        g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x));
        g.append("g").attr("class", "axis").call(d3.axisLeft(y));

        g.append("text").attr("x", w / 2).attr("y", h + 34).attr("text-anchor", "middle").text("Star Rating");
        g.append("text").attr("x", -h / 2).attr("y", -36).attr("transform", "rotate(-90)").attr("text-anchor", "middle").text("Energy Consumption (kWh)");

        g.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => x(d.star))
            .attr("cy", d => y(d.energy))
            .attr("r", 5)
            .attr("fill", d => color(d.tech))
            .attr("fill-opacity", 0.8)
            .on("mouseenter", (e, d) => {
                tooltip.style("opacity", 1).html(`${d.brand}<br>${d.tech}<br>${d.star}★ — ${d.energy} kWh`);
            })
            .on("mousemove", (e) => tooltip.style("left", e.pageX + "px").style("top", e.pageY + "px"))
            .on("mouseleave", () => tooltip.style("opacity", 0));
    };

    let cached;
    d3.csv("./data/Ex5_TV_energy.csv").then(rows => {
        cached = rows;
        render(cached);
        new ResizeObserver(() => render(cached)).observe(sel.node());
    });
})();
