const { Sequelize, Model, DataTypes } = require("sequelize");

//node server.js
//curl --silent --include 'http://localhost:3000/get/1'
/*ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR*/
//curl --silent --include 'http://localhost:3000/get/f'
//curl --silent --include 'http://localhost:3000/get/100'

//curl --silent --include -X POST http://localhost:3000/post?"last=obama&first=mike&phone=+123+67567+216&zip=27420&city=Oulu&address=Talentie+67"
//curl --silent --include -X POST http://localhost:3000/post?"last=obama&first=mike&phone=+123+67567+216&city=Oulu&address=Talentie+67"
/*ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR*/
//curl --silent --include -X POST http://localhost:3000/post?"last=obama&phone=+123+67567+216&zip=27420&city=Oulu&address=Talentie+67"
//curl --silent --include -X POST http://localhost:3000/post?"first=mike&phone=+123+67567+216&zip=27420&city=Oulu&address=Talentie+67"


//curl --silent --include -X PATCH http://localhost:3000/patch/4?"phone=%2B465+112+212"
/*ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR*/
//curl --silent --include -X PATCH http://localhost:3000/patch/34?"phone=%2B465+112+212"

var sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db",
  logging: console.log
});

var HTTP_NOT_ACCEPTABLE = 406;
var HTTP_BAD_REQUEST = 400;
var HTTP_NOT_FOUND = 404;
var HTTP_OK = 200;

var express = require('express');

var app = express();
var port = 3000;    // app.listen(3000);

class Person extends Model {}

Person.init({
    // Model attributes (table columns) are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      field: "id"      // as it appears in database
    },
    last: {
      type: DataTypes.STRING
    },
    first: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    zip: {
      type: DataTypes.INTEGER
    },
    city: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
}, {
    sequelize,   // pass the connection instance
    tableName: "person",         // In database

    // Fields createdAt and updatedAt (DataTypes.DATE) would be
    // added automatically to model
    timestamps: false
    
});

(async () => {
    let select;

    // Create table. Do nothing if exists
    await Person.sync();         // params: {alter: true}, {force: true}

    let row = await Person.create({   // Make a "row" object
        last: "",
        first: "",
        phone: "",
        zip: "",
        city: "",
        address: "",
    });

    await row.save();           // Write to Database
    
    row.last = "Michael",
    row.first = "Green",
    row.phone = "+432 063 579",
    row.zip = "37405",
    row.city = "Oslo";
    row.address = "Biscino 19 A";
    
    await row.save();
})();

(async () => {
    let select;

    // Create table. Do nothing if exists
    await Person.sync();         // params: {alter: true}, {force: true}

    let row = await Person.create({   // Make a "row" object
        last: "",
        first: "",
        phone: "",
        zip: "",
        city: "",
        address: "",
    });

    await row.save();           // Write to Database

    row.last = "Jack",
    row.first = "Simons",
    row.phone = "+123 111 555",
    row.zip = "92491",
    row.city = "Stockholm";
    row.address = "Bagarntie 12";
    
    await row.save();

})();

(async () => {
    let select;

    // Create table. Do nothing if exists
    await Person.sync();         // params: {alter: true}, {force: true}

    let row = await Person.create({   // Make a "row" object
        last: "",
        first: "",
        phone: "",
        zip: "",
        city: "",
        address: "",
    });
    
    await row.save();
    
    row.last = "Bobby",
    row.first = "Mitchelle",
    row.phone = "+252 486 1634",
    row.zip = "41258",
    row.city = "Tallinn";
    row.address = "Macrotie 93";
    
    await row.save();
})();

//curl --silent --include 'http://localhost:3000/get/1'
app.get('/get/:id', (req, res) => {
    (async () => {
        let select;
        
        res.setHeader('Content-Type', 'application/json');
        
        const id = Number.parseInt(req.params.id)
        
        if(Number.isNaN(id)){
            return res.status(HTTP_BAD_REQUEST).send({"message": "invalid ID"})
        }
        
        // Create table. Do nothing if exists
        await Person.sync();         // params: {alter: true}, {force: true}

        // SELECT WHERE

        select = await Person.findAll({
            attributes: ["id", "last", "first", "phone", "zip", "city", "address"],
            where: {
                id: req.params.id
            }
        });

        console.log("SELECT WHERE:", JSON.stringify(select[0], null, 4));
        

        
        if(JSON.stringify(select[0], null, 4) === undefined){
            return res.status(HTTP_NOT_ACCEPTABLE).send({"message": "ID NOT FOUND!"})
        }

        res.status(HTTP_OK).send(JSON.stringify(select, null, 4));
    })();
})

//curl --silent --include -X POST http://localhost:3000/post?"last=obama&first=mike&phone=+123+67567+216&zip=27420&city=Oulu&address=Talentie+67"
//curl --silent --include -X POST http://localhost:3000/post?"last=obama&phone=+123+67567+216&zip=27420&city=Oulu&address=Talentie+67"
//curl --silent --include -X POST http://localhost:3000/post?"first=mike&phone=+123+67567+216&zip=27420&city=Oulu&address=Talentie+67"
//curl --silent --include -X POST http://localhost:3000/post?"last=obama&first=mike&phone=+123+67567+216&city=Oulu&address=Talentie+67"

app.post("/post/", (req, res, next) => {
    (async () => {
        let select;

        if (!req.query.last){
            return res.status(HTTP_NOT_ACCEPTABLE).send({"message": "No last name specified!"})
        }
        if (!req.query.first){
            return res.status(HTTP_NOT_ACCEPTABLE).send({"message": "No first name specified!"})
        }
        // Create table. Do nothing if exists
        await Person.sync();         // params: {alter: true}, {force: true}

        let row = await Person.create({   // Make a "row" object
            last: "",
            first: "",
            phone: "",
            zip: "",
            city: "",
            address: "",
        });

        row.last = req.query.last,
        row.first = req.query.first,
        row.phone = req.query.phone,
        row.zip = req.query.zip,
        row.city = req.query.city,
        row.address = req.query.address;
        
        await row.save();
    
        res.status(HTTP_OK).send(`${JSON.stringify(req.query)}\n`);
        
    })();
})

//curl -X PATCH http://localhost:3000/patch/3?"phone=%2B465+112+212"
//curl -X PATCH http://localhost:3000/patch/34?"phone=%2B465+112+212"
app.patch("/patch/:id/", (req, res, next) => {
    (async () => {
        
        select = await Person.findAll({
            attributes: ["id"],
            where: {
                id: req.params.id
            }
        });
        
        if(JSON.stringify(select[0], null, 4) === undefined){
            return res.status(HTTP_NOT_ACCEPTABLE).send({message: 'ID NOT FOUND!'})
        }
        
        await Person.update({ last: req.query.last,
            first: req.query.first,
            phone: req.query.phone,
            zip: req.query.zip,
            city: req.query.city,
            address: req.query.address }, {
            where: {
                id: req.params.id
            }
        });
        
        res.status(HTTP_OK).send(`${JSON.stringify(req.query)}\n`);
    })();
})

app.use((req, res) => {	// Default: any other request
    res.setHeader('Content-Type', 'application/json');
    res.status(HTTP_NOT_ACCEPTABLE).json({});
});

app.listen(port, () => {
    console.log(`Example server listening at http://localhost:${port}`)
})
