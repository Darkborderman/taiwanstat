let Setting={
    graph:{
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
    innerGraph:{
        width:400,
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
    },
    color:{
        //category 考慮因素
            能學以致用:"darkcyan",
            能學習到知識:"darkgreen",
            工作穩定:"darkgoldenrod",
            有發展前景:"darkmagenta",
            待遇高:"darksalmon",
            通勤方便:"darkred",
            符合自己興趣:"darkred",
            工作負擔較輕:"darkturquoise",
            有挑戰性:"darkseagreen",
            有升遷機會:"darkviolet",
            其他:"darkslateblue",
        //category 學歷
            碩士及以上:"green",
            大學:"rebeccapurple",
            專科:"goldenrod",
            高中職:"brown",
            國中及以下:"salmon",
            平均薪資:"deeppink",
        
    }
}