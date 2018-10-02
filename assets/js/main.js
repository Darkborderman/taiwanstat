//draw 考慮因素 chart (line graph)
d3.csv(`assets/csv/青年勞工初次尋職時選擇工作的考慮因素(fin)/total-2.csv`, function (error, data) {

    if (error) throw error;
    //else console.log(data);

    let graph=generateGraph(Setting.graph,`#display`);
    let width=Setting.graph.innerWidth();
    let height=Setting.graph.innerHeight();
    let x=generateXAxis(graph,data,width,height,`年份`);
    let y=generateYAxis(graph,data,height,`比率(%)`);

    //insert data(dot graph)
    graph.append(`g`)
        .attr(`class`,`dot graph`)
        .selectAll(`circle`)
        .data(data)
        .enter()
        .append(`circle`)
        .attr(`r`,Setting.circle.radius)
        .attr(`fill`,`lightgray`)
        .attr(`cx`,(d)=>{return x(d[`year`]);})
        .attr(`cy`,(d)=>{return y(d[`value`]);})
        .attr(`class`,(d)=>{
            return `${d[`year`]} ${d[`type`]}`;
        })
        //show tooltip when mousehover,remove it when mouseleave
        .on(`mouseenter`,(d,i)=>{
            d3.select(d3.event.target).attr(`r`,Setting.circle.radius*1.5);
            generateTooltip(d,i,graph,x,y,'%');
            document.getElementById(`year`).innerText=`年份: ${d[`year`]}`;
            document.getElementById(`type`).innerText=`考慮因素: ${d[`type`]}`;
            document.getElementById(`value`).innerText=`所佔比率: ${d[`value`]}%`;
        })
        .on(`mouseleave`,(d)=>{
            d3.select(d3.event.target).attr(`r`,Setting.circle.radius);
            removeTooltip();
        })
        //generate small graph when click dot
        .on(`click`,(d)=>{
            let graphData=[];
            for(item in data){
                if(data[item]['year']==d['year']) graphData.push(data[item]);
            }
            graphData.sort(function(a,b){
                return parseFloat(b[`value`])-parseFloat(a[`value`]);
            });
            generateInnergraph(graphData,"#inner-display");
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

        let graph=generateGraph(Setting.graph,`#display2`);
        let width=Setting.graph.innerWidth();
        let height=Setting.graph.innerHeight();
        let x=generateXAxis(graph,data,width,height,`年份`);
        let y=generateYAxis(graph,data,height,`薪水(新台幣)`);
    
        //insert data(dot graph)
        graph.append(`g`)
        .attr(`class`,`dot graph`)
        .selectAll(`circle`)
        .data(data)
        .enter()
        .append(`circle`)
        .attr(`r`,Setting.circle.radius)
        .attr(`fill`,`lightgray`)
        .attr(`cx`,(d)=>{return x(d[`year`]);})
        .attr(`cy`,(d)=>{return y(d[`value`]);})
        .attr(`class`,(d)=>{
            return `${d[`year`]} ${d[`type`]}`;
        })
        .on(`mouseenter`,(d,i)=>{
            generateTooltip(d,i,graph,x,y,'元');
            d3.select(d3.event.target).attr(`r`,Setting.circle.radius*1.5);

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
            d3.select(d3.event.target).attr(`r`,Setting.circle.radius);
            removeTooltip();
        })
        .on(`click`,(d)=>{
            let graphData=[];
            for(item in data){
                if(data[item]['year']==d['year']) graphData.push(data[item]);
            }
            graphData.sort(function(a,b){
                return parseFloat(b[`value`])-parseFloat(a[`value`]);
            });
            generateInnergraph(graphData,"#inner-display2");

        });
    
        let valueline = d3.line()
        .x(function(d) { return x(d[`year`]); })
        .y(function(d) { return y(d[`value`]); });
    
        let lineData=[];
        for(let i=0;i<=5;i++) lineData[i]=data.slice(i*5,(i*5)+5);
    
        // draw line
        for(let i=0;i<=5;i++)
        {
            graph.append(`g`)
            .attr(`class`,`line graph`)
            .data([lineData[i]])
            .append(`path`)
            .attr(`class`,(d)=>{
                return `${d[0][`type`]} line`;
            })
            .attr(`fill`,`none`)
            .attr(`d`,valueline);
        }
    });
});

function generateTooltip(d,index,graph,x,y,unit){

    console.log(index);
    //out of bound index exception
   if((graph.name=="#display"&&index%6==5)||(graph.name=="#display2"&&index%5==4))
    {
        graph.append(`text`)
        .attr(`id`,`tooltip`)
        .attr(`class`,`${d[`type`]}`)
        .attr(`x`,()=>{return x(d[`year`])-10})
        .attr(`y`,()=>{return y(d[`value`])+5})
        .text(`${d[`type`]} ${d[`value`]} ${unit}`)
        .attr("text-anchor","end")
        console.log(graph);
    }
    else{
        graph.append(`text`)
        .attr(`id`,`tooltip`)
        .attr(`class`,`${d[`type`]}`)
        .attr(`x`,()=>{return x(d[`year`])+10})
        .attr(`y`,()=>{return y(d[`value`])+10})
        .text(`${d[`type`]} ${d[`value`]} ${unit}`)
    
    }
}

function removeTooltip(){
    d3.select(`#tooltip`).remove();
}

function generateYAxis(graph,data,height,unit){

    let max= Math.max.apply(Math, data.map(function(o) { return o[`value`]; }));
    let min= Math.min.apply(Math, data.map(function(o) { return o[`value`]; }));

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

    let max= Math.max.apply(Math, data.map(function(o) { return o[`year`]; }));
    let min= Math.min.apply(Math, data.map(function(o) { return o[`year`]; }));

    let x=d3.scaleLinear().domain([min,max]).range([0,width-10]);

    graph.append(`g`)
        .attr(`class`, `x axis`)
        .attr(`transform`, `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(6,""));

    graph.append(`g`)
        .attr(`class`, `x unit`)
        .append(`text`)
        .attr(`y`, 310)
        .attr(`x`, 710)
        .text(`${unit}`);

    return x;
}

function generateGraph(format,container){

    let svg=d3.select(container).append(`svg`)
        .attr(`width`, format.width)
        .attr(`height`, format.height);

    let graph=svg.append(`g`)
        .attr(`transform`, `translate(${format.margin.left},${format.margin.top})`);

    graph.name=container;

    return graph;
}

function generateInnergraph(graphData,container){

    d3.select(container).selectAll("*").remove();
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
    .attr('height',(d)=>{return 10+(d[`value`]/max)*300})
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