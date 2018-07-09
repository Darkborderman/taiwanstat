
//Create a svg and append to div element
let svg = d3.select(Setting.graph.name).append("svg")
    .attr("width", Setting.graph.width)
    .attr("height", Setting.graph.height)

//inner graph
let width=Setting.graph.width-Setting.graph.margin.left-Setting.graph.margin.right;
let height=Setting.graph.height-Setting.graph.margin.top-Setting.graph.margin.bottom;

let graph=svg.append("g")
    .attr("transform", "translate(" + Setting.graph.margin.left + "," + Setting.graph.margin.top + ")");


    let y = d3.scaleLinear().range([height, 0]);
//load json
d3.json("/assets/json/initial_staff_wage.json", function (error, data) {


    let xAxis=[];
    let xUnit=width/data.length;
        
    for(i=0;i<=data.length-1;i++){
        xAxis[i]=xUnit*i;
    }
    let x = d3.scaleOrdinal().range(xAxis);

    if (error) throw error;

    x.domain(data.map(function(d) { return d["行業別"] }));

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(5," + height + ")")
        .call(d3.axisBottom(x));

    y.domain([20000,35000]);

    graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
    
    graph.append("g")
        .attr("class", "y unit")
        .append("text")
        .attr("y", 0)
        .text("$");

    //adding data
        //d mean the data (data[i])
    graph.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("width", 5)
        .attr("x",(d)=>{ return x(d["行業別"])})
        .attr("y", function (d) { return y(d["經常性薪資"]) })
        .attr("height", function (d) { return 10; })
        .text((d)=>{return d;})
        .on("mouseover",function(d){
            console.log(d);
        });
});