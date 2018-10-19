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

    let yearData=Linegraph.formatYearData(data,'2016');

    console.log(yearData);

    //show tooltip when mousehover,remove it when mouseleave
    Linegraph.generateDot(data,graph,x,y)   
        .on(`mouseenter`,(d,i)=>{
            d3.select(d3.event.target)
                .attr(`r`,(d)=>{
                    if(d[`type`]==`待遇高`||d[`type`]==`工作穩定`||d[`type`]==`工作負擔較輕`)
                    return Setting.circle.strong.hover.radius;
                    else return Setting.circle.normal.hover.radius;
                })
                .attr(`opacity`,(d)=>{
                    if(d[`type`]==`待遇高`||d[`type`]==`工作穩定`||d[`type`]==`工作負擔較輕`)
                    return Setting.circle.strong.hover.opacity;
                    else return Setting.circle.normal.hover.opacity;
                });
            Linegraph.generateTooltip(d,i,graph,x,y,`%`);
            document.getElementById(`year`).innerText=`年份: ${d[`year`]}`;
            document.getElementById(`type`).innerText=`考慮因素: ${d[`type`]}`;
            document.getElementById(`value`).innerText=`所佔比率: ${d[`value`]}%`;


            yearData=Linegraph.formatYearData(data,d.year);
            console.log(yearData);

            d3.select(`#stat`).append(`div`)
                .attr("id","temp-stat");
            for(item in yearData){
                d3.select(`#temp-stat`).append(`div`)
                .style('color',(d)=>{
                    return Setting[`color`][yearData[item].type];
                })
                .text(`${yearData[item].type} ${yearData[item].value}%`)
            }
        })
        .on(`mouseleave`,()=>{
            d3.select(d3.event.target)
            .attr(`opacity`,(d)=>{
                if(d[`type`]==`待遇高`||d[`type`]==`工作穩定`||d[`type`]==`工作負擔較輕`)
                return Setting.circle.strong.default.opacity;
                else return Setting.circle.normal.default.opacity;
            })
            .attr(`r`,(d)=>{
                if(d[`type`]==`待遇高`||d[`type`]==`工作穩定`||d[`type`]==`工作負擔較輕`)
                return Setting.circle.strong.default.radius;
                else return Setting.circle.normal.default.radius;
            })
            Linegraph.removeTooltip();

            d3.select(`#temp-stat`).remove()
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