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
    displayItems();
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
        askUser();
      });
  }

  //two inquirers in one fuction. 
  //consider giving an option of EXIT 

function askUser() {
  //The first should ask them the ID of the product they would like to buy.
    inquirer.prompt([
    {
        name: "buyWhat",
        type: "input",
        message:"Which items would you like to purchase? Please use ID number. OR type EXIT to leave."
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

            if(chosenProd == "EXIT") {
                console.log(chosenProd);
                connection.end();
            }
            else{
            var query = "SELECT product_name FROM products WHERE item_id ="+ chosenProd;
            connection.query(query, function(err, res){
                if (err) throw err;
                console.log(res[0].product_name);
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
                     console.log(newStock);
                    updateProd();
                }
                else{
                    console.log("Sorry we do not have enough. Please pick something else")
                    startOver();
                }
            
            });
        }      
         });
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
}

// Once the update goes through, show the customer the total cost of their purchase.
function totalCost() {
    var query = "SELECT price FROM products WHERE item_id=" + chosenProd;
    connection.query(query, function(err,res) {
        var total = res[0].price*chosenQuan;
        if (err)throw err;
        console.log("Your total is " + total + ".");
        startOver();
    })
}

function startOver() {
    inquirer.prompt({
        name: "start",
        type: "list",
        message: "Would you like to look at our items again?",
        choices:["Yes", "No"]
    }).then(function(answer){
        if(answer.start === "Yes") {
            console.log(answer.start)
            displayItems();
        }
        else{
            console.log("Thank you. Good-Bye!")
            connection.end();
        }
    })
}