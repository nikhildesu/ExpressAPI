const express = require('express')
const app = express()
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient
var ObjectId=require('mongodb').ObjectId;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'anothertoken,Accept,token ,Content-Type ');
    next();
});

MongoClient.connect('mongodb://localhost:27017/contactListAppDB', function (err, db) {
    if (err) throw err
    let contactCount ="1";
    

    app.post('/registration', function (req, res) {
        console.log('Reg body is ' +req.body);
        
        db.collection('person').insert(req.body).then(function (result) {
            console.log(result);
            res.send(result);
        })
    })

    app.get('/findUser/:userid', function (req, res) {
        var value= req.params.userid;
        console.log('Passed value in find user is ' +value);       
        
        db.collection('person').findOne({userid : value},function (err, result) {               
            //console.log("Result is " +item); 
            if(result)    {
                console.log("Result is " +result.userid);
                res.send(result); 
            }
               else{
                console.log("error Result is " +err);
               // return res.status(200).send('Invalid ID')
                res.status(404).send('Invalid ID')
               // return null;
               
               }
        })
    })

    app.get('/validateUser/:userid', function (req, res) {
        var value= req.params.userid;
        console.log('Passed value is ' +value);       
        
        db.collection('person').findOne({userid : value},function (err, result) {               
            //console.log("Result is " +item); 
            if(result)    {
                console.log("Result is " +result.password);
                res.send(result); 
            }
               else{
                console.log("error Result is " +err);
               // return res.status(200).send('Invalid ID')
                res.status(404).send('Invalid ID')
               // return null;
               
               }
        })
    })

    app.post('/addContacts', function (req, res) {
        console.log('Contact body is ' +req.body);
        db.collection('contacts').insert(req.body).then(function (result) {
            console.log(result);
            res.send(result);
        })
    })

    app.get('/getContacts', function (req, res) {
        console.log('Contact body is ' +req.body);
        db.collection('contacts').find({}).toArray(function (err, data) {
            console.log(data);
            res.send(data);
        })
    })

    app.get('/getMaxContactID', function (req, res) {
        console.log('getMaxContactID body is ' +req.body);
        db.collection('contacts').find().count().then(function (result) { 
            contactCount=result;
            if(contactCount)    {
                console.log("Result is " +contactCount);
                res.json([{contactCount: +contactCount}]);
            }
        })
    })
    
    app.get('/getSpecificContacts/:userid', function (req, res) {        
        var userid= req.params.userid;
        console.log('Passed value is ' +userid);       
        
        db.collection('contacts').find({createdBy : userid}).toArray(function (err, data) {
            console.log(data);
            res.send(data);
        })
    })

    

    

    app.put('/updateContacts/:id', function (req, res) {
         //console.log('Update Contact body service request for ID -  ' +req.body._id);
        //var updateid=req.body._id;
        //var newContactName="5a15235a7f872b0eecac30b4";
        var updateid= req.params.id;
        var currentContactName=req.body.contactName;
         var newContactName=req.body.contactName;
         var newContactNbr=req.body.contactNumber;
         console.log('Update Contact body service request for ID -  ' +updateid+req.body.contactName+req.body.contactNumber );
        //db.collection('contacts').updateOne({ "_id" : "ObjectId("+newContactName +")"}, {$set: {contactName:"sdzvbgrb", contactNumber:"123456"}},{ upsert: true },function (err, result) {
            db.collection('contacts').updateOne({ "_id" : ObjectId(updateid)}, {
                $set:{
                    contactName: req.body.contactName,
                    contactNumber: req.body.contactNumber,
                  }
            },
            function(err, result){
                if(err){
                    console.log('error in updating')
                  res.send(err);
                }
                else{
                    console.log('update success')
                  res.send(result);
                }
                });
            
    });

     app.delete('/deleteSpecificContact/:id', function (req, res) {
        var deleteid= req.params.id;
       // console.log('Delete requested for id ' +req.body);
         //console.log('Delete requested for id ' +value);
         //var deleteid=req.body.contactName;
         db.collection('contacts').deleteOne({ "_id" : ObjectId(deleteid)},
        function(err, result){
            if(err){
                console.log('error in updating')
              res.send(err);
            }
            else{
                console.log('update success')
              res.send(result);
            }
            });
        
   });

   app.delete('/deleteContactsForUser/:userid', function (req, res) {        
    var userid= req.params.userid;
    console.log('Passed value is ' +userid);       
    
    db.collection('contacts').deleteMany({createdBy : userid},
    function(err, result){
        if(err){
            console.log('error in updating')
          res.send(err);
        }
        else{
            console.log('update success')
          res.send(result);
        }
        });
})

   app.delete('/deleteContacts', function (req, res) {
    var deleteid= req.params.id;
   // console.log('Delete requested for id ' +req.body);
     //console.log('Delete requested for id ' +value);
     //var deleteid=req.body.contactName;
     db.collection('contacts').deleteMany({},
    function(err, result){
        if(err){
            console.log('error in updating')
          res.send(err);
        }
        else{
            console.log('update success')
          res.send(result);
        }
        });
    
})

    

      

})

app.put('/', (req, res) => res.send('This is putt'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
