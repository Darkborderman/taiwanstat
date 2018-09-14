let Setting={
    graph1:{
        name:`#display`,
        width:800,
        height:400,
        margin:{
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        },
        innerWidth:function(){
            return this.width-this.margin.left-this.margin.right;
        },
        innerHeight:function(){
            return this.height-this.margin.top-this.margin.left;
        },
    },
    graph2:{
        name:'#display2',
        width:800,
        height:400,
        margin:{
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        },
        innerWidth:function(){
            return this.width-this.margin.left-this.margin.right;
        },
        innerHeight:function(){
            return this.height-this.margin.top-this.margin.left;
        },
    },
    circle:{
        radius:5
    }
}