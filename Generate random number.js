var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/smartfarming';

mongo.connect(url, (err)=>{
    console.log('Terhubung ke database!')
})


app.get('/data', (req, res)=>{
    mongo.connect(url, (err, db)=>{
        var collection = db.collection('energyMonitoring');
        collection.find().sort({_id:-1}).limit(-1).toArray((x, hasil)=>{
            res.send(hasil);
            
        })
    })
})


function randomV(){
    var voltage=Math.floor((Math.random()*11)+230);
    return voltage;
}
function randomI(){
    var arus=Math.floor((Math.random()*2)+9);
    return arus;
}

    
    mongo.connect(url, (err, db)=>{
        var collection = db.collection('energyMonitoring');

        setInterval(function(){
            function getId(){
            collection.find().sort({_id:-1}).limit(-1).next().then(
                function(doc){
                    var idku=doc._id;
                    return idku++;
                },function(err){
                    console.log('Error',err);                }
            );}
            var power=randomI()*randomV();
            var energy=power*(1/3600);
            collection.insertOne(({ 
                "_id" : getId(),
                "v" : randomV(),
                "i" : randomI(),
                "p" : power,
                "e" : energy 
            }));
            console.log("sukses masukin data");
        },1000)
        
        // var emon = {
        //     _id:req.body.id,
        //     v: req.body.voltage,
        //     i: req.body.arus,
        //     p: req.body.power,
        //     e: req.body.energy
        // }
        // collection.insert(emon, (x, hasil)=>{
        //     res.send(hasil);
            
        // })
    })
app.listen(3210, ()=>{
    console.log('Server aktif di cek di http://localhost:3210/data');
})


  
