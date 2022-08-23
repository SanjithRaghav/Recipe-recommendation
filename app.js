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
    res.render('list',{ingList: ingList,data:d,display:'print'});
})

app.post('/', (req, res) => {
    if(req.body.button==='add'){
        ingList.push(req.body.ingredient);
        res.redirect('/');
    }
    else if(req.body.button=='get recipe'){
        if(ingList.length==0){
            while(d.length > 0) {
                d.pop();
            }
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
            var url=endpoint+'?apiKey='+apiKey+'&ingredients='+ingredients+'&number='+number;
            https.get(url,(response)=>{
                let chunks = [];
                response.on('data', function(data) {
                chunks.push(data);
                }).on('end', function() {
                let data   = Buffer.concat(chunks);
                d=JSON.parse(data);
                res.redirect('/');
                });
            })
        }
        
        
    }
    else if(req.body.button=='remove'){
        res.render('list',{ingList: ingList,data:d,display:'edit'});
    }
    else if(req.body.button=='remove-item'){
        console.log(req.body);
        for(var i=0;i<req.body.value.length;i++){
            const index=ingList.indexOf(req.body.value[i]);
            if (index > -1) { // only splice array when item is found
                ingList.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        res.redirect('/');
        
    }
    else{
        let url1='https://api.spoonacular.com/recipes/'+req.body.button+'/information?includeNutrition=false&apiKey=1a82a343ac7c4054a537cd559b21c74e';
        https.get(url1,(response1)=>{
            let chunks1=[];
            response1.on('data', function(data) {
            chunks1.push(data);
            }).on('end', function() {
            let data1   = Buffer.concat(chunks1);
            var dat=JSON.parse(data1);
            res.redirect(dat.spoonacularSourceUrl);
            })
        });
    }
    
})