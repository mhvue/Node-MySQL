var mysql = require("mysql");
var inquirer = require("inquirer");

var chosenQuan;
var chosenProd;
var newStock;

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password:"124Cloud",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    askUser();
  });

  function displayItems() {
      var query = connection.query("SELECT * FROM products", function(err, res){
        //   console.log(res[5].product_name);
        if (err) throw err;
        for(var i = 0; i < res.length; i++) {
            console.log("\nItem ID: " + res[i].item_id + 
            "\nProduct: " + res[i].product_name +
            "\nPrice: " + res[i].price); 
        }
        toBuy();
      });
  };

function askUser() {
    inquirer.prompt(
    {
        name:"firstQuest",
        type: "list",
        message: "Welcome! Would you like to buy an item or Exit?",
        choices: ["Buy", "Exit"]
    }).then(function(answer){
        if(answer.firstQuest === "Exit") {
            console.log("\nGood-Bye.");
            connection.end();
        }
        else{
            displayItems();
    //The first should ask them the ID of the product they would like to buy.
        }
    })
};

function toBuy() {
    inquirer.prompt([
    {
        name: "buyWhat",
        type: "input",
        message:"Which items would you like to purchase? Please use ID number."
    },
    {//The second message should ask how many units of the product they would like to buy.
        name: "buyHowMany",
        type: "input",
        message: "How many would you like?",
        validate: function (value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        },
    }]).then(function (answer) {
            chosenProd = answer.buyWhat;

            var query = "SELECT product_name FROM products WHERE item_id ="+ chosenProd;
            connection.query(query, function(err, res){
                if (err) throw err;
                console.log("\nYou picked: " + res[0].product_name);
            });
            chosenQuan= parseInt(answer.buyHowMany);
            var queryCheck= "SELECT stock_quantity FROM products WHERE item_id=" + chosenProd;

            connection.query(queryCheck, function(err, res){
                // console.log(res[0].stock_quantity)
                if (err) {
                    throw err
                }
                else if (chosenQuan <= res[0].stock_quantity) {
                    newStock= res[0].stock_quantity - chosenQuan;
                    // console.log(newStock);
                    updateProd();
                }
                else{
                    console.log("\nSorry we do not have enough.")
                    startOver();
                }
            });
        })     
    };

//this means updating the SQL database to reflect the remaining quantity.
function updateProd() {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock,
            },
            {
                item_id: chosenProd,
            }
        ], 
        function(err, res) {
            if (err) throw err;
        }
    )
    totalCost();
};

// Once the update goes through, show the customer the total cost of their purchase.
function totalCost() {
    var query = "SELECT price FROM products WHERE item_id=" + chosenProd;
    connection.query(query, function(err,res) {
        var total = res[0].price*chosenQuan;
        var formatTotal= number_format(total, 2);
        if (err)throw err;
        console.log("\nYour total is " + formatTotal + "." + "\n" + "-------------");
        startOver();
    })
};

//obtained function number_format from https://thisinterestsme.com/javascript-round-decimal-places/
function number_format(val, decimals){
    //Parse the value as a float value
    val = parseFloat(val);
    //Format the value w/ the specified number
    //of decimal places and return it.
    return val.toFixed(decimals);
};

function startOver() {
    inquirer.prompt({
        name: "start",
        type: "list",
        message: "\nWould you like to look at our items again?",
        choices:["Yes", "No"]
    }).then(function(answer){
        if(answer.start === "Yes") {
            console.log(answer.start)
            displayItems();
        }
        else{
            console.log("\nThank you. Good-Bye!")
            connection.end();
        }
    })
};