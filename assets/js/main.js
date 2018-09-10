
//Create a svg and append to div element
let svg = d3.select(Setting.graph.name).append(`svg`)
    .attr(`width`, Setting.graph.width)
    .attr(`height`, Setting.graph.height)

//inner graph
let width=Setting.graph.width-Setting.graph.margin.left-Setting.graph.margin.right;
let height=Setting.graph.height-Setting.graph.margin.top-Setting.graph.margin.bottom;

    let graph=svg.append(`g`)
    .attr(`transform`, `translate(` + Setting.graph.margin.left + `,` + Setting.graph.margin.top + `)`);

//load csv
d3.csv(`assets/csv/青年勞工初次尋職時選擇工作的考慮因素(fin)/total-2.csv`, function (error, data) {

    if (error) throw error;
    else console.log(data);

    //TODO data should be split 11 as a array element


    //Y-axis

    let y=d3.scaleLinear().domain([0,80]).range([height,0]);

    graph.append(`g`)
    .attr(`class`, `y axis`)
    .call(d3.axisLeft(y));

    graph.append(`g`)
    .attr(`class`, `y unit`)
    .append(`text`)
    .attr(`y`, -10)
    .attr(`x`, -50)
    .text(`比率(%)`);

    //X-axis

    let x=d3.scaleLinear().domain([2005,2017]).range([0,width]);

    graph.append(`g`)
        .attr(`class`, `x axis`)
        .attr(`transform`, `translate(0,` + height + `)`)
        .call(d3.axisBottom(x))
        .selectAll(`text`)
            .attr(`x`,0)
            .attr(`y`,20)

    //Data insert

    graph.append('g')
    .attr('class','dot graph')
    .selectAll(`bar`)
    .data(data)
    .enter()
    .append(`rect`)
    .style(`opacity`,0.7)
    .attr(`width`,7)
    .attr(`height`,7)
    .attr(`x`,(d)=>{return x(d[`year`]);})
    .attr(`y`,(d)=>{return y(d[`value`]);})
    .attr(`class`,(d)=>{
        return `${d[`year`]} ${d[`type`]}`;
    });

    //draw line

    let valueline = d3.line()
    .x(function(d) { return x(d[`year`]); })
    .y(function(d) { return y(d[`value`]); });

    let lineData=[];

    for(let i=0;i<=11;i++)
    lineData[i]=data.slice(i*6,(i*6)+6);

    console.log(lineData);

  
    // define the line
    for(let i=0;i<=11;i++)
    {
        graph.append("g")
        .attr('clas','line graph')
        .data([lineData[i]])
        .append('path')
        .attr('stroke','red')
        .attr('fill','none')
        .attr('stroke-width','2px')
        .attr('d',valueline)
    }
});