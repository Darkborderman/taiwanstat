
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
    })
    .on('mouseleave',(d)=>{
        d3.select(d3.event.target).attr('r',Setting.circle.radius);
    })
    .on(`click`,(d)=>{
        
        DescriptionGenerate(d,data.slice(0,6));
    });

    //format data for line

    let valueline = d3.line()
    .x(function(d) { return x(d[`year`]); })
    .y(function(d) { return y(d[`value`]); });

    let lineData=[];
    for(let i=0;i<=11;i++)
    lineData[i]=data.slice(i*6,(i*6)+6);

    // draw line
    for(let i=0;i<=11;i++)
    {
        graph.append(`g`)
        .attr(`clas`,`line graph`)
        .data([lineData[i]])
        .append(`path`)
        .attr(`class`,(d)=>{
            return `${d[0][`type`]} line`;
        })
        .attr("fill","none")
        .attr(`d`,valueline)
    }
    
    //Add total chart
});

function DescriptionGenerate(d,sampleNumber){
    console.log(d['year']);
    console.log(sampleNumber);
    for(data in sampleNumber){
        if(sampleNumber[data]['year']==d['year'])
        {
            document.getElementById("total").innerText=sampleNumber[data][`value`];
        }
    }

    document.getElementById("year").innerText=`年份: ${d['year']}`;
    document.getElementById("type").innerText=`考慮因素: ${d['type']}`;
    document.getElementById("value").innerText=`所佔比率: ${d['value']}`;

}