var mysql = require("mysql");
var inquirer = require("inquirer");

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
        // connection.end();
        askUser();
      });
  }

  //two inquirers in one fuction. 
  //consider giving an option of EXIT 
  //consider displaying the items as a Raw list? 

function askUser() {
  //The first should ask them the ID of the product they would like to buy.
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
        }
    }]).then(function (answer) {
            var query = "SELECT product_name FROM products WHERE item_id ="+ answer.buyWhat;
            var chosenItem;
            connection.query(query, function(err, res){
                if (err) throw err;
                console.log(res[0].product_name);
                 
            });

            var chosenQuan= parseInt(answer.buyHowMany);
            var queryCheck= "SELECT stock_quantity FROM products WHERE item_id=" + answer.buyWhat;

            connection.query(queryCheck, function(err, res){
                // console.log(res[0].stock_quantity)
                if (err) {
                    throw err
                } 
                else if (chosenQuan <= res[0].stock_quantity) {
                    //call function to update
                    //call start function
                }
                else{
                    console.log("we do not have enough.")
                    //call start func again.
                }
                
            });
           
                connection.end()
            });
    };

