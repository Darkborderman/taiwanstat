let Setting={
    graph:{
        width:window.screen.availWidth<1080?window.screen.availWidth:window.screen.availWidth*0.5,
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
        strong:{
            hover:{
                radius:12,
                opacity:1
            },
            default:{
                radius:7,
                opacity:0.7
            },
        },
        normal:{
            hover:{
                radius:12,
                opacity:0.7
            },
            default:{
                radius:7,
                opacity:0.4
            },
        }
    },
    line:{
        strong:{
            hover:{
                strokeWidth:2,
                opacity:1,
            },
            default:{
                strokeWidth:2,
                opacity:0.7,
            },
        },
        normal:{
            hover:{
                strokeWidth:2,
                opacity:0.7,
            },
            default:{
                strokeWidth:2,
                opacity:0.4,
            },
        },
    },
    color:{
        //category 考慮因素
            工作穩定:`#006400`,
            待遇高:`#FF0000`,
            工作負擔較輕:`#0000FF`,
            有發展前景:`#10ddc2`,
            通勤方便:`#7dace4`,
            符合自己興趣:`#fc5c9c`,
            能學以致用:`#8c82fc`,
            能學習到知識:`#455d7a`,
            有挑戰性:`#de95ba`,
            有升遷機會:`#ff7c38`,
            其他:`#5e63b6`,
        //category 學歷
            碩士及以上:`#006400`,
            大學:`#FF0000`,
            專科:`#8c82fc`,
            高中職:`#de95ba`,
            國中及以下:`#ff7c38`,
            平均薪資:`#0000FF`,
    }
}