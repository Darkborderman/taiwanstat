//draw 考慮因素 chart (line graph)
d3.csv(`assets/csv/青年勞工初次尋職時選擇工作的考慮因素(fin)/total-2.csv`, function (error, data) {

    if (error) throw error;
    else console.log(data);

    let graph=generateGraph(Setting.graph1);

    let width=Setting.graph1.innerWidth();
    let height=Setting.graph1.innerHeight();

    let x=generateXAxis(graph,data,width,height,'年份');
    let y=generateYAxis(graph,data,height,'比率(%)');

    //insert data(dot graph)

    graph.append(`g`)
        .attr(`class`,`dot graph`)
        .selectAll(`circle`)
        .data(data)
        .enter()
        .append(`circle`)
        .attr('r',Setting.circle.radius)
        .attr(`fill`,`lightgray`)
        .attr(`cx`,(d)=>{return x(d[`year`]);})
        .attr(`cy`,(d)=>{return y(d[`value`]);})
        .attr(`class`,(d)=>{
            return `${d[`year`]} ${d[`type`]}`;
        })
        .on(`mouseenter`,(d)=>{
            console.log(d);
            d3.select(d3.event.target).attr('r',Setting.circle.radius*1.5);
            generateDescription(d,graph);
        })
        .on('mouseleave',(d)=>{
            d3.select(d3.event.target).attr('r',Setting.circle.radius);
            removeDescription();
        })
        .on(`click`,(d)=>{
        });

    //format data for line

    let valueline = d3.line()
        .x(function(d) { return x(d[`year`]); })
        .y(function(d) { return y(d[`value`]); });

    let lineData=[];
    for(let i=0;i<=11;i++) lineData[i]=data.slice(i*6,(i*6)+6);

    // draw line
    for(let i=0;i<=10;i++)
    {
        graph.append(`g`)
        .attr(`clas`,`line graph`)
        .data([lineData[i]])
        .append(`path`)
        .attr(`class`,(d)=>{
            return `${d[0][`type`]} line`;
        })
        .attr("fill","none")
        .attr(`d`,valueline);
    }
});
//Draw 薪資表
d3.csv(`assets/csv/青年勞工現職工作平均每月薪資(fin)/total.csv`, function (error, data) {
    if (error) throw error;
    else console.log(data);

    if (error) throw error;
    else console.log(data);

    let graph=generateGraph(Setting.graph2);

    let width=Setting.graph2.innerWidth();
    let height=Setting.graph2.innerHeight();

    let x=generateXAxis(graph,data,width,height,'年份');
    let y=generateYAxis(graph,data,height,'比率(%)');

});

function generateDescription(d,graph){

    graph.append("text")
    .attr("id","tooltip")
    .attr("class",`${d[`type`]}`)
    .attr("x",d3.event.pageX-200)
    .attr("y",d3.event.pageY-200)
    .text(`${d['type']} ${d[`value`]}%`)
    .transition()
    .duration(300)
    .style("opacity",1)
    .style("text-align","center")
    console.log(d3.event.pageX);
    
    document.getElementById("year").innerText=`年份: ${d['year']}`;
    document.getElementById("type").innerText=`考慮因素: ${d['type']}`;
    document.getElementById("value").innerText=`所佔比率: ${d['value']}`;
}

function removeDescription(){
    d3.select("#tooltip").remove();
}

function generateYAxis(graph,data,height,unit){
    
    let max= Math.max.apply(Math, data.map(function(o) { return o['value']; }));
    let min= Math.min.apply(Math, data.map(function(o) { return o['value']; }));

    let y=d3.scaleLinear().domain([min,max]).range([height,0]);

    graph.append(`g`)
        .attr(`class`, `y axis`)
        .call(d3.axisLeft(y));

    graph.append(`g`)
        .attr(`class`, `y unit`)
        .append(`text`)
        .attr(`y`, -10)
        .attr(`x`, -50)
        .text(`${unit}`);
    
    return y;
}

function generateXAxis(graph,data,width,height,unit){

    let max= Math.max.apply(Math, data.map(function(o) { return o['year']; }));
    let min= Math.min.apply(Math, data.map(function(o) { return o['year']; }));

    let x=d3.scaleLinear().domain([min,max]).range([0,width-10]);

    graph.append(`g`)
        .attr(`class`, `x axis`)
        .attr(`transform`, `translate(0,${height})`)
        .call(d3.axisBottom(x));

    graph.append(`g`)
        .attr(`class`, `x unit`)
        .append(`text`)
        .attr(`y`, 310)
        .attr(`x`, 710)
        .text(`${unit}`);

    return x;
}

function generateGraph(format){

    let svg=d3.select(format.name).append(`svg`)
        .attr(`width`, format.width)
        .attr(`height`, format.height);

    let graph=svg.append(`g`)
        .attr(`transform`, `translate(${format.margin.left},${format.margin.top})`);

    return graph;
}
