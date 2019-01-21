var vm = new Vue({
    el: "#stockList",
    data: {
        msg: 'hello world',
        stockData: [],
        target: ['code', 'name', 'open', 'percent', 'macd', 'kdjk', 'kdjd', 'kdjj', 'rsi1','url'],
        interceptor: {
            analysis: true,
            fetchTodayData: false,
            k: 25,
            d: 25,
            j: 25,
            rsi: 30,
            macdMin: -0.4,
            macdMax: 0.1,
            priceMin: 4.00,
            priceMax: 80.00,
            requireMACD: false,
            requireKDJ: false,
            requireRSI: false,
            requirePrice: false,
            STinclude: true,
        }
    },
    methods: {
        filter: function () {
            this.stockData.forEach(e => {
                let {
                    code,
                    name,
                    timestamp,
                    open,
                    percent,
                    macd,
                    kdjk,
                    kdjd,
                    kdjj,
                    rsi1
                } = e.data
                
                if (this.matchMACD(macd) & this.matchPrice(open) & this.includeST(name) & this.matchKDJ(kdjk, kdjd, kdjj)&this.matchRSI(rsi1)){
                    e.show = true
                }else{
                    e.show = false
                }
            })
        },
        MACDfilter:function () {
            this.interceptor.requireMACD = !this.interceptor.requireMACD
        }
        ,
        KDJfilter:function () {
       
            this.interceptor.requireKDJ = !this.interceptor.requireKDJ
        }
        ,
        RSIfilter:function () {
        
            this.interceptor.requireRSI = !this.interceptor.requireRSI
        }
        ,
        Pricefilter:function () {
   
            this.interceptor.requirePrice = !this.interceptor.requirePrice
        }
        ,
        matchPrice: function (price) {
            if ( this.interceptor.requirePrice) {
                if ((price >  this.interceptor.priceMin) & (price <  this.interceptor.priceMax)) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        },
        matchMACD: function (macd) {
            if (typeof (macd) == 'number') {
                if ( this.interceptor.requireMACD) {
                    if ((macd >  this.interceptor.macdMin) & (macd <  this.interceptor.macdMax)) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
    
        },
        includeST: function (name) {
            if ( this.interceptor.STinclude == false) {
                if (name.indexOf("ST") == -1) {
    
                    return true
                } else {
    
                    return false
                }
            } else {
                return true
            }
        },
        matchKDJ: function (kdjk, kdjd, kdjj) {
            if ( this.interceptor.requireKDJ) {
                if (kdjk <  this.interceptor.k & kdjd <  this.interceptor.d & kdjj <  this.interceptor.j) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        },
        matchRSI:function (rsi1) {
            if( this.interceptor.requireRSI){
                if (rsi1<= this.interceptor.rsi) {
                    return true
                } else {
                    return false
                }
            }else{
                return true
            }
        }
        ,
        hide: function name() {
            this.show = !this.show
        },
        fetch: function () {
            let date = new Date()
            let fsName = `${date.getMonth()+1}-${date.getDate()}.json`
            axios.get(fsName).then((resp) => {
                var patten = /{"data.+":""}/g
                data = resp.data
                li = data.match(patten)
            }).then(() => {
                li.forEach(element => {
                    data = JSON.parse(element).data
                    if (data.item[0]) {
                        let FSD = this.formatedStockData(data)
                        Object.keys(FSD).forEach(e => {
                            if (this.target.indexOf(e) == -1) {
                                delete FSD[e]
                            }
                        });
                        //FSD.show = true
                        FSD.url = 'https://xueqiu.com/S/' + FSD.code
                        this.stockData.push({show:true,data:FSD})
                        //this.stockinfo.push(element)
                    }
                });
            })
        },
        upload:function () {
            this.stockData=[]
            var resultFile = document.getElementById("uploadedJson").files[0];
            var reader = new FileReader();
                         
                        reader.readAsText(resultFile, "UTF-8"); 
                        pushData = this.pushData
                        filter = this.filter
                        reader.onload = function(evt){ 
                            let fileString = evt.target.result;
                            let patten = /{"data.+":""}/g
                            li = fileString.match(patten)
                          pushData(li)
                          filter()
                          
        }}
        ,
        pushData:function(li) {
            li.forEach(element => {
                data = JSON.parse(element).data
                if (data.item[0]) {
                    let FSD = this.formatedStockData(data)
                    Object.keys(FSD).forEach(e => {
                        if (this.target.indexOf(e) == -1) {
                            delete FSD[e]
                        }
                    });
                    //FSD.show = true
                    FSD.url = 'https://xueqiu.com/S/' + FSD.code
                    this.stockData.push({show:true,data:FSD})
                    //this.stockinfo.push(element)
                }
            });  
        },
        formatedStockData: function (stockData) {
            var FSD = {}
            FSD.code = stockData.symbol
            FSD.name = stockData.sName
            stockData.column.forEach((e, i) => {
                FSD[e] = stockData.item[0][i]
            })
            return FSD
        }
    }
})
