//draw 考慮因素 chart (line graph)
d3.csv(`assets/csv/青年勞工初次尋職時選擇工作的考慮因素(fin)/total-2.csv`, function (error, data) {
    if (error) throw error;

    //generate graph with x,y axis
    let graph=Linegraph.generateGraph(Setting.graph,`#display`);
    let width=Setting.graph.innerWidth();
    let height=Setting.graph.innerHeight();
    let x=Linegraph.generateXAxis(graph,data,width,height,`年份`);
    let y=Linegraph.generateYAxis(graph,data,height,`比率(%)`);

    document.getElementById(`display`).style.cursor=`crosshair`;

    //show tooltip when mousehover,remove it when mouseleave
    Linegraph.generateDot(data,graph,x,y)   
        .on(`mouseenter`,(d,i)=>{
            d3.select(d3.event.target)
                .attr(`r`,Setting.circle.hover.radius)
                .attr(`opacity`,Setting.circle.hover.opacity);
            Linegraph.generateTooltip(d,i,graph,x,y,`%`);
            document.getElementById(`year`).innerText=`年份: ${d[`year`]}`;
            document.getElementById(`type`).innerText=`考慮因素: ${d[`type`]}`;
            document.getElementById(`value`).innerText=`所佔比率: ${d[`value`]}%`;
        })
        .on(`mouseleave`,()=>{
            d3.select(d3.event.target)
                .attr(`r`,Setting.circle.default.radius)
                .attr(`opacity`,Setting.circle.default.opacity);
            Linegraph.removeTooltip();
        })
        .on(`click`,()=>{
        });

    //format data for line,and draw graph
    let lineData=Linegraph.formatLineData(data);
    Linegraph.generateLine(lineData,graph,x,y)

    //append infomation icon svg
    Linegraph.generateInfo(graph,lineData,`info`)
        .on(`mouseenter`,()=>{
            document.getElementById(`info`).style.visibility=`visible`;
        })
        .on(`mouseleave`,()=>{
            document.getElementById(`info`).style.visibility=`hidden`;
        });
});