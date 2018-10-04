//draw 考慮因素 chart (line graph)
d3.csv(`assets/csv/青年勞工初次尋職時選擇工作的考慮因素(fin)/total-2.csv`, function (error, data) {

    if (error) throw error;
    //else console.log(data);

    //generate graph with x,y axis
    let graph=Linegraph.generateGraph(Setting.graph,`#display`);
    let width=Setting.graph.innerWidth();
    let height=Setting.graph.innerHeight();
    let x=Linegraph.generateXAxis(graph,data,width,height,`年份`);
    let y=Linegraph.generateYAxis(graph,data,height,`比率(%)`);

    //insert data(dot graph)
    graph.append(`g`)
        .attr(`class`,`dot graph`)
        .selectAll(`circle`)
        .data(data)
        .enter()
        .append(`circle`)
        .attr(`class`,(d)=>{return `${d[`year`]} ${d[`type`]}`;})
        .attr(`fill`,(d)=>{return Setting.color[d[`type`]];})
        .attr(`opacity`,Setting.circle.default.opacity)
        .attr(`r`,Setting.circle.default.radius)
        .attr(`cx`,(d)=>{return x(d[`year`]);})
        .attr(`cy`,(d)=>{return y(d[`value`]);})
        //show tooltip when mousehover,remove it when mouseleave
        .on(`mouseenter`,(d,i)=>{
            d3.select(d3.event.target)
                .attr(`r`,Setting.circle.hover.radius)
                .attr(`opacity`,Setting.circle.hover.opacity);
            Linegraph.generateTooltip(d,i,graph,x,y,`%`);
            document.getElementById(`year`).innerText=`年份: ${d[`year`]}`;
            document.getElementById(`type`).innerText=`考慮因素: ${d[`type`]}`;
            document.getElementById(`value`).innerText=`所佔比率: ${d[`value`]}%`;
        })
        .on(`mouseleave`,(d)=>{
            d3.select(d3.event.target)
                .attr(`r`,Setting.circle.default.radius)
                .attr(`opacity`,Setting.circle.default.opacity);
            Linegraph.removeTooltip();
        })
        //generate small graph when click dot
        .on(`click`,(d)=>{
            let graphData=[];
            for(item in data){
                if(data[item][`year`]==d[`year`]) graphData.push(data[item]);
            }
            graphData.sort(function(a,b){
                return parseFloat(b[`value`])-parseFloat(a[`value`]);
            });
            generateInnergraph(graphData,`#inner-display`);
        });

    let valueline = d3.line()
        .x(function(d) { return x(d[`year`]); })
        .y(function(d) { return y(d[`value`]); });

    let lineData=Linegraph.formatLineData(data);
    // draw line
    for(let i=0;i<lineData.typeKind;i++)
    {
        graph.append(`g`)
        .attr(`class`,`line graph`)
        .data([lineData[i]])
        .append(`path`)
        .attr(`class`,(d)=>{return `${d[`type`]} line`;})
        .attr(`stroke`,(d)=>{return Setting.color[d[`type`]]})
        .attr(`stroke-width`,Setting.line.default.strokeWidth)
        .attr(`opacity`,Setting.line.default.opacity)
        .attr(`fill`,`none`)
        .attr(`d`,valueline);
    }
});
//Draw 薪資表
d3.csv(`assets/csv/青年勞工現職工作平均每月薪資(fin)/total.csv`, function (error, data) {

    if (error) throw error;
    //else console.log(data);
    d3.csv(`assets/csv/消費者物價指數及其年增率-整理後.csv`,function(error,cpi){

        if(error) throw error;
        //else console.log(cpi);

        let graph=Linegraph.generateGraph(Setting.graph,`#display2`);
        let width=Setting.graph.innerWidth();
        let height=Setting.graph.innerHeight();
        let x=Linegraph.generateXAxis(graph,data,width,height,`年份`);
        let y=Linegraph.generateYAxis(graph,data,height,`薪水(新台幣)`);
    
        //insert data(dot graph)
        graph.append(`g`)
        .attr(`class`,`dot graph`)
        .selectAll(`circle`)
        .data(data)
        .enter()
        .append(`circle`)
        .attr(`class`,(d)=>{return `${d[`year`]} ${d[`type`]}`;})
        .attr(`fill`,(d)=>{return Setting.color[d[`type`]];})
        .attr(`opacity`,Setting.circle.default.opacity)
        .attr(`r`,Setting.circle.default.radius)
        .attr(`cx`,(d)=>{return x(d[`year`]);})
        .attr(`cy`,(d)=>{return y(d[`value`]);})
        .on(`mouseenter`,(d,i)=>{
            d3.select(d3.event.target)
                .attr(`r`,Setting.circle.hover.radius)
                .attr(`opacity`,Setting.circle.hover.opacity);
            Linegraph.generateTooltip(d,i,graph,x,y,`元`);

            //find cpi of current dot to calculate real wage
            let realwage,currentCPI;
            for(item in cpi){
                if(cpi[item][`year`]==d[`year`]){
                    currentCPI=cpi[item][`value`];
                    realwage=d[`value`]*(100/cpi[item][`value`]);
                    break;
                }
            }
            
            document.getElementById(`year2`).innerText=`年份: ${d[`year`]}`;
            if(d[`type`]==`平均薪資`) document.getElementById(`type2`).innerText=``;
            else document.getElementById(`type2`).innerText=`學歷: ${d[`type`]}`;
            document.getElementById(`value2`).innerText=`平均每月薪資: ${d[`value`]}元,消費者物價指數:${currentCPI}`;
            document.getElementById(`realwage`).innerText=`真實薪資=${Math.floor(realwage)}元`;
        })
        .on(`mouseleave`,(d)=>{
            d3.select(d3.event.target)
                .attr(`r`,Setting.circle.default.radius)
                .attr(`opacity`,Setting.circle.default.opacity);
            Linegraph.removeTooltip();
        })
        .on(`click`,(d)=>{
            let graphData=[];
            for(item in data){
                if(data[item][`year`]==d[`year`]) graphData.push(data[item]);
            }
            graphData.sort(function(a,b){
                return parseFloat(b[`value`])-parseFloat(a[`value`]);
            });
            generateInnergraph(graphData,`#inner-display2`);

        });
    
        let valueline = d3.line()
        .x(function(d) { return x(d[`year`]); })
        .y(function(d) { return y(d[`value`]); });
    
        let lineData=Linegraph.formatLineData(data);
        // draw line
        for(let i=0;i<lineData.typeKind;i++)
        {
            graph.append(`g`)
            .attr(`class`,`line graph`)
            .data([lineData[i]])
            .append(`path`)
            .attr(`class`,(d)=>{return `${d[`type`]} line`;})
            .attr(`stroke`,(d)=>{return Setting.color[d[`type`]]})
            .attr(`stroke-width`,Setting.line.default.strokeWidth)
            .attr(`opacity`,Setting.line.default.opacity)
            .attr(`fill`,`none`)
            .attr(`d`,valueline);
        }
    });
});

function generateInnergraph(graphData,container){

    d3.select(container).selectAll(`*`).remove();
    let graph=generateGraph(Setting.innerGraph,container);
    let width=Setting.innerGraph.innerWidth();
    let height=Setting.innerGraph.innerHeight();
    let max= Math.max.apply(Math, graphData.map(function(o) { return o[`value`]; }));
    
    graph.append(`g`)
    .attr(`class`,`bar graph`)
    .selectAll(`rect`)
    .data(graphData)
    .enter()
    .append(`rect`)
    .attr(`width`,40)
    .attr(`fill`,`white`)
    .attr(`height`,(d)=>{return 10+(d[`value`]/max)*300})
    .attr(`x`,(d,i)=>{return 200-i*20;})
    .attr(`y`,(d)=>{return 10;})
    .attr(`class`,(d)=>{
        return `${d[`year`]} ${d[`type`]}`;
    })
    .on(`mouseenter`,(d)=>{
        d3.select(d3.event.target).attr(`fill`,`lightblue`);
    })
    .on(`mouseleave`,(d)=>{
        d3.select(d3.event.target).attr(`fill`,`white`);
    })
    
    console.log(graphData);
    return 0;

}