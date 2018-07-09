
//Create a svg and append to div element
let svg = d3.select(Setting.graph.name).append("svg")
    .attr("width", Setting.graph.width)
    .attr("height", Setting.graph.height)

//inner graph
let width=Setting.graph.width-Setting.graph.margin.left-Setting.graph.margin.right;
let height=Setting.graph.height-Setting.graph.margin.top-Setting.graph.margin.bottom;

let graph=svg.append("g")
    .attr("transform", "translate(" + Setting.graph.margin.left + "," + Setting.graph.margin.top + ")");

//load json
d3.json("/assets/json/initial_staff_wage.json", function (error, data) {


    if (error) throw error;

    //due to v4  version, ordinal range need to be insert each delta
    let xDomain=[]
    for(let i=0;i<=data.length-1;i++)
    {
        if(!data[i]["大職業別"].split("-")[1]){
            xDomain.push(data[i]["大職業別"].split("-")[0]);
        }
    }
    let xAxis=[];
    let xUnit=width/xDomain.length;
        
    for(let i=0;i<=xDomain.length-1;i++){
        xAxis[i]=xUnit*i;
    }
    let x = d3.scaleOrdinal().range(xAxis);
    let y = d3.scaleLinear().range([height, 0]);

    x.domain(xDomain);

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("x",30)
            .attr("y",30)
            .attr("transform","rotate(40)");

    y.domain([21000,35000]);

    graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
    
    graph.append("g")
        .attr("class", "y unit")
        .append("text")
        .attr("y", -10)
        .attr("x", -50)
        .text("薪資(新台幣)");

    //add data
    graph.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("opacity",0.7)
        .attr("class",function(d){
            let department=d["大職業別"].split("-")[0];
            let staffKind=d["大職業別"].split("-")[1];
            if(staffKind!=undefined)
            {
                return `${department} ${staffKind}`;
            }
            else return department;
        })
        .attr("width", 10)
        .attr("height", 10)
        .attr("x",(d)=>{ return x( d["大職業別"].split("-")[0])})
        .attr("y", function (d) { return y(d["經常性薪資"]) })
        .on("mouseover",function(d){
            //console.log(d);
            d3.select(this)
                .style("opacity",1.0);
            graph.append("text")
                .attr("id","node"+d["大職業別"])
                .attr("x",x( d["大職業別"].split("-")[0])+10)
                .attr("y",y(d["經常性薪資"]-10))
                .text(d["經常性薪資"]);
        })
        .on("mouseout",function(d){
            d3.select(this)
                .style("opacity",0.7)
            d3.select("#node"+d["大職業別"])
            .remove();
        })
        .on("click",function(d){
            console.log(d);
            window.scrollTo(0,document.body.scrollHeight);
            document.getElementById("apartment").innerHTML=d["大職業別"];
            document.getElementById("staffKind").innerHTML=`受僱員工平均薪資: ${d["經常性薪資"]} 新台幣`
        });
});