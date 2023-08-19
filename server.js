const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistMineDB')

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const d = new Date();
let day = weekday[d.getDay()];
let thisDate = d.getDate();
let thisMonth = month[d.getMonth()];

const itemSchema = new mongoose.Schema({
    name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist",
})

const item2 = new Item({
    name: "Press the + button to add a new item",
})

const item3 = new Item({
    name: "<- Press this to delete an item",
})

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
    Item.find({}).then((foundItems)=>{
        if(foundItems.length == 0){
            Item.insertMany(defaultItems).then(()=>{
                console.log("Items inserted successfully")
            }).catch(()=>{console.log("Something's wrong")});
            res.redirect("/");
        }
        else{
            res.render("index.ejs", {items: foundItems, today: day, date: thisDate, month: thisMonth,});
        }
    }).catch(()=>{console.log("Something's wrong")});
})

app.post("/", (req, res) => {

    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName,
    })
    item.save();
    res.redirect("/");
})

app.post("/delete", (req, res)=>{
    const checkedItem = req.body.checkbox;
    Item.deleteOne({_id: checkedItem}).then(()=>{console.log("Yay")}).catch(()=>{console.log("Shit")});
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})