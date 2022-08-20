const express=require('express')
const bodyParser=require('body-parser')
const https=require('https')
//const fetch = require('node-fetch');
const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000);
var ingList=[];
var d=[];
app.get('/', (req, res) => {
    res.render('list',{ingList: ingList,data:d});
})

app.post('/', (req, res) => {
    console.log(req.body);
    if(req.body.button==='add'){
        ingList.push(req.body.ingredient);
        res.redirect('/');
    }
    else{
        if(ingList.length==0){
            res.redirect('/');
        }
        else{
            var endpoint='https://api.spoonacular.com/recipes/findByIngredients';
        var apiKey='1a82a343ac7c4054a537cd559b21c74e'
        var ingredients=ingList[0];
        var number=5;
        for(var i=1;i<ingList.length;i++){
            ingredients+=',+';
            ingredients+=ingList[i];
        }
        let j=0;
        var url=endpoint+'?apiKey='+apiKey+'&ingredients='+ingredients+'&number='+number;
        https.get(url,(response)=>{
            // response.on("data",(data)=>{
            //   JSON.parse(data);

            // })
            let chunks = [];
            response.on('data', function(data) {
            chunks.push(data);
            }).on('end', function() {
            let data   = Buffer.concat(chunks);
            d=JSON.parse(data);
            for(var i=0;i<d.length;i++){
                let chunks1=[];
                let url1='https://api.spoonacular.com/recipes/'+d[i].id+'/information?includeNutrition=false&apiKey=1a82a343ac7c4054a537cd559b21c74e';
                https.get(url1,(response1)=>{
                    response1.on('data', function(data) {
                    chunks1.push(data);
                    }).on('end', function() {
                    let data1   = Buffer.concat(chunks1);
                    // d[i]['src']=JSON.parse(data1).spoonacularSourceUrl;
                    console.log(JSON.parse(data1).spoonacularSourceUrl)
                    })
                });
            }
            res.redirect('/');
            });
        })
        }
        
    }
    
})