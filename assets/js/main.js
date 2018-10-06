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
//Draw 薪資表
d3.csv(`assets/csv/青年勞工現職工作平均每月薪資(fin)/total.csv`, function (error, data) {
    if (error) throw error;
    d3.csv(`assets/csv/消費者物價指數及其年增率-整理後.csv`,function(error,cpi){
        if(error) throw error;

        //generate graph with x,y axis
        let graph=Linegraph.generateGraph(Setting.graph,`#display2`);
        let width=Setting.graph.innerWidth();
        let height=Setting.graph.innerHeight();
        let x=Linegraph.generateXAxis(graph,data,width,height,`年份`);
        let y=Linegraph.generateYAxis(graph,data,height,`薪水(新台幣)`);

        document.getElementById(`display2`).style.cursor=`crosshair`

        Linegraph.generateDot(data,graph,x,y)
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
            });

        //generate Line
        let lineData=Linegraph.formatLineData(data);
        Linegraph.generateLine(lineData,graph,x,y);
        
        //append infomation icon svg
        Linegraph.generateInfo(graph,lineData,`info2`)
            .on(`mouseenter`,()=>{
                document.getElementById(`info2`).style.visibility=`visible`;
            })
            .on(`mouseleave`,()=>{
                document.getElementById(`info2`).style.visibility=`hidden`;
            });
    });
});