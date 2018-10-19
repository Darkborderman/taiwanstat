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
            .attr(`transform`, `translate(-5,0)`)
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
    
        let x=d3.scaleLinear().domain([min-0.2,max+0.2]).range([0,width-10]);
    
        graph.append(`g`)
            .attr(`class`, `x axis`)
            .attr(`transform`, `translate(0,${height+2})`)
            .call(d3.axisBottom(x).ticks(6,``));
    
        graph.append(`g`)
            .attr(`class`, `x unit`)
            .append(`text`)
            .attr(`y`, 310)
            .attr(`x`, 710)
            .text(`${unit}`);
    
        return x;
    },
    //append dot on graph, reutrn dot generated
    generateDot(data,graph,x,y){
        graph.append(`g`)
        .attr(`class`,`dot graph`)
        .selectAll(`circle`)
        .data(data)
        .enter()
        .append(`circle`)
        .attr(`class`,(d)=>{return `${d[`year`]} ${d[`type`]}`;})
        .attr(`fill`,(d)=>{return Setting.color[d[`type`]];})
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
        .attr(`cx`,(d)=>{return x(d[`year`]);})
        .attr(`cy`,(d)=>{return y(d[`value`]);});

        return graph.selectAll(`circle`);
    },
    //append line on graph, return line generated
    generateLine(lineData,graph,x,y){
        let valueline = d3.line()
        .x(function(d) { return x(d[`year`]); })
        .y(function(d) { return y(d[`value`]); });

        for(let i=0;i<lineData.typeKind;i++)
        {
            graph.append(`g`)
            .attr(`class`,`line graph`)
            .data([lineData[i]])
            .append(`path`)
            .attr(`class`,(d)=>{return `${d[`type`]} line`;})
            .attr(`stroke`,(d)=>{return Setting.color[d[`type`]]})
            .attr(`stroke-width`,(d)=>{
                if(d[`type`]==`待遇高`||d[`type`]==`工作穩定`||d[`type`]==`工作負擔較輕`)
                return Setting.line.strong.default.strokeWidth;
                else return Setting.line.normal.default.strokeWidth;
            })
            .attr(`opacity`,(d)=>{
                if(d[`type`]==`待遇高`||d[`type`]==`工作穩定`||d[`type`]==`工作負擔較輕`)
                return Setting.line.strong.default.opacity;
                else return Setting.line.normal.default.opacity;
            })
            .attr(`fill`,`none`)
            .attr(`d`,valueline);
        }

        return graph.selectAll(`.line path`);
    },
    //append hint text when hover
    generateTooltip(d,index,graph,x,y,unit){
        //out of bound index exception
        if((graph.name==`#display`&&index%6==5))
        {
            graph.append(`text`)
            .attr(`id`,`tooltip`)
            .attr(`class`,`${d[`type`]}`)
            .attr(`x`,()=>{return x(d[`year`])-10})
            .attr(`y`,()=>{return y(d[`value`])+5})
            .style(`stroke`,()=>{return Setting.color[d.type]})
            .style(`stroke-width`, `1px`)
            .attr(`fill`,()=>{return Setting.color[d.type]})
            .text(`${d[`type`]} ${d[`value`]} ${unit}`)
            .attr(`text-anchor`,`end`);
        }
        else{
            graph.append(`text`)
            .attr(`id`,`tooltip`)
            .attr(`class`,`${d[`type`]}`)
            .attr(`x`,()=>{return x(d[`year`])+10})
            .attr(`y`,()=>{return y(d[`value`])+10})
            .style(`stroke`,()=>{return Setting.color[d.type]})
            .style(`stroke-width`, `1px`)
            .attr(`fill`,()=>{return Setting.color[d.type]})
            .text(`${d[`type`]} ${d[`value`]} ${unit}`)
            .attr(`text-anchor`,`start`);
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
    //generate info icon on grpah,return info
    generateInfo(graph,lineData,container){
        for(i=0;i<lineData.typeKind;i++){
            let div=document.createElement(`div`);
            div.innerHTML=lineData[i].type;
            div.style.color=Setting.color[lineData[i].type];
            document.getElementById(container).appendChild(div);
        }

        let info=graph.append(`g`).append(`image`)
        .attr(`xlink:href`, `assets/svg/info.svg`)
        .attr(`width`, 30)
        .attr(`height`, 30)
        .attr(`x`,705)
        .attr(`y`,-30);
        return info;
    },
    formatYearData(data,year){
        let result = data.map(item =>{
            if(item[`year`]==year) return item;
        });
    
        result=result.filter(item=> {
            return item != undefined;
        });
        return result;
    },
    generateCheckboxEvent(yearData){
        for(let i=0;i<=10;i++)
        {
            d3.select(`#box-${yearData[i][`type`]}`)
            .on(`click`,()=>{
                if(document.getElementById(`box-${yearData[i][`type`]}`).checked){
                    d3.selectAll(`.${yearData[i][`type`]}`)
                    .attr('display','block')
                    .attr('opacity',1);
                }
                else{
                    d3.selectAll(`.${yearData[i][`type`]}`)
                    .attr('display','none')
                    .attr('opacity',0);
                }
                console.log(123);
            });
        
        }
        console.log(yearData);
    }
}