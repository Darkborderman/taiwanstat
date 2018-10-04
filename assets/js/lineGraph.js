let Linegraph={
    //generate empty SVG element
    generateGraph(format,container){
        let svg=d3.select(container).append(`svg`)
        .attr(`width`, format.width)
        .attr(`height`, format.height);

        let graph=svg.append(`g`)
            .attr(`transform`, `translate(${format.margin.left},${format.margin.top})`);

        graph.name=container;

        return graph;
    },
    //append Y axis on SVG
    generateYAxis(graph,data,height,unit){
        let max= Math.max.apply(Math, data.map(function(o) { return o[`value`]; }));
        let min= Math.min.apply(Math, data.map(function(o) { return o[`value`]; }));
    
        let y=d3.scaleLinear().domain([min,max]).range([height,0]);
    
        graph.append(`g`)
            .attr(`class`, `y axis`)
            .call(d3.axisLeft(y).ticks(6));
    
        graph.append(`g`)
            .attr(`class`, `y unit`)
            .append(`text`)
            .attr(`y`, -10)
            .attr(`x`, -50)
            .text(`${unit}`);
        
        return y;
    },
    //append X axis on SVG
    generateXAxis(graph,data,width,height,unit){
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
    },
    //append hint text when hover
    generateTooltip(d,index,graph,x,y,unit){
        //out of bound index exception
        if((graph.name=="#display"&&index%6==5)||(graph.name=="#display2"&&index%5==4))
        {
            graph.append(`text`)
            .attr(`id`,`tooltip`)
            .attr(`class`,`${d[`type`]}`)
            .attr(`x`,()=>{return x(d[`year`])-10})
            .attr(`y`,()=>{return y(d[`value`])+5})
            .style('stroke',()=>{return Setting.color[d.type]})
            .style('stroke-width', '1px')
            .attr("fill",()=>{return Setting.color[d.type]})
            .text(`${d[`type`]} ${d[`value`]} ${unit}`)
            .attr("text-anchor","end");
        }
        else{
            graph.append(`text`)
            .attr(`id`,`tooltip`)
            .attr(`class`,`${d[`type`]}`)
            .attr(`x`,()=>{return x(d[`year`])+10})
            .attr(`y`,()=>{return y(d[`value`])+10})
            .style('stroke',()=>{return Setting.color[d.type]})
            .style('stroke-width', '1px')
            .attr("fill",()=>{return Setting.color[d.type]})
            .text(`${d[`type`]} ${d[`value`]} ${unit}`);
        }
    },
    //remove hint point when leave
    removeTooltip(){
        d3.select(`#tooltip`).remove();
    },
    //find the length of categories and return with a 2D array
    formatLineData(data){
        let lineData=[],typeLength=0;
        for(item in data){
            if(data[item][`type`]==data[0][`type`]) typeLength++;
        }
        for(let i=0;i<(data.length/typeLength);i++){
            lineData[i]=data.slice(i*typeLength,(i+1)*typeLength);
            lineData[i].type=data[i*typeLength].type;
        }
        lineData.typeLength=typeLength;
        lineData.typeKind=data.length/typeLength;
        return lineData;
    },
}
