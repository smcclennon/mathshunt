# Documentation
Documentation for functions in Maths Hunt to help my peers create a maths game.

## Database search
Applab only provides an async database search with a callback to use the information found. This is great for modification, but problematic when you need a value from the database before continuing with code execution.

My database search function provides a way to search the database, using the `username` field as a primary key (instead of the intended primary key of `id`, provided by AppLab. Because of this, you must check that you would not create a primary key before adding to the database, or this function may behave unexpectedly.

<details>
  <summary>View code</summary>

```js
function Db_search(username, column) {
  // Copyright (c) 2022 Shiraz McClennon
  // Get column of all users in database
  console.log("Db_search:  Retrieving column 'username' from database...");
  var users = getColumn("userdb", "username");
  
  // Get index of target username
  // https://stackoverflow.com/a/5864424
  console.log("Db_search:  Getting index for username '" + username + "'...");
  var username_index = users.indexOf(username);
  
  // If target username has valid index in array "users"
  if (username_index != -1) {
    console.log("Db_search:  Found user '" + username + "' at index " + username_index + "!");
  
    // If parameter "column" was passed in to the function
    if (column != undefined) {
      
      // Retrieve the column from the database
      console.log("Db_search:  Retrieving column '" + column + "' from database...");
      var column_data = getColumn("userdb", column);
      
      // Return the value at the same index as the username
      var column_target = column_data[username_index];
      console.log("Db_search:  Returning column index " + username_index + ": " + column_target);
      return column_target;

    } else {
      // If no column parameter was passed, return user exists instead
      console.log("Db_search:  No column specified. Returning user exist status: true");
      return true;
    }
    
  } else {
    // If target username has invalid index, return error response code
    console.log("Db_search:  Username '" + username + "' does not exist. Returning user exist status: false");
    return false;
  }
}
```
</details>

### Usage
Check if username 'smcclennon' exists in the database:
```js
Db_search('smcclennon');
```
- Possible returns:
  -  `true`: The username exists.
  - `false`: The username does not exist.
---
Get value of a column 'highscore' for user 'smcclennon':
```js
Db_search('smcclennon', 'highscore');
```
- Possible returns:
  - `27`: The column value, '27' is just an example.
  - `false`: The username does not exist.

## Generating maths questions

<details>
  <summary>View code</summary>

```js
// Print debug messages
function debug(name, message) {
  console.log("@@ [" + name + "]  " + message);
}

// Is value a whole number? [returns: true, false]
// https://stackoverflow.com/a/14636638
function isInt(value) {
  return value % 1 === 0;
}

// Get array length
// https://stackoverflow.com/questions/3010840
function array_len(array) {
  return array.length;
}

// Pick random value from array
function randomValue(array) {
  
  // Get length of array
  var length = array_len(array);
  
  // Pick random index from array
  var index = randomNumber(0, length-1);
  
  // Return value at that index
  return array[index];
}

// Screen: Game
// Convert english operator "add" to symbolic representation "+"

function game_symbolic_operator(operator) {
  var symbolic_operator;
  
  if (operator == "add") {
    symbolic_operator = "+";
    
  } else if (operator == "subtract") {
    symbolic_operator = "-";
    
  } else if (operator == "multiply") {
    symbolic_operator = "×";
    
  } else if (operator == "divide") {
    symbolic_operator = "÷";
  }
  
  return symbolic_operator;
}

// Screen: Game
// Convert english mathematical operator to logic symbol, and return the answer
function game_calculate_question(num1, num2, operator) {
  var answer;
  if (operator == "add") {
    answer = num1 + num2;
  } else if (operator == "subtract") {
    answer = num1 - num2;
  } else if (operator == "multiply") {
    answer = num1 * num2;
  } else if (operator == "divide") {
    answer = num1 / num2;
  }
  return answer;
}



// Screen: Game
// Check if answer is valid within the solution requirements
function game_answer_isvalid(answer) {
  
  // If answer is not a whole number
  if (isInt(answer) == false) {
    debug("game_answer_isvalid", "Answer is not an integer.");
    return false;
  
  // If answer is a negative number
  } else if (answer < 0) {
    debug("game_answer_isvalid", "Answer is less than 0.");
    return false;
  
  // Answer is valid
  } else {
    debug("game_answer_isvalid", "Answer is valid!");
    return true;
  }
}

// Screen: Game
// Generate realistic multiple choice answers for a given answer
function game_generate_answers(min_num, max_num, number_of_answers, answer) {
  
  var multiple_choice = [];
  
  debug("game_generate_answers", "Generating " + number_of_answers + " multiple-choice questions between " + min_num + " and " + max_num + "...");
  
  // Increase max multiple-choice value to answer if the answer > max_number
  /*
  We do this because if the answer was 200, the multiple choice quesitons would
  otherwise be something like: [1, 12, 200, 4]
  and the extreme difference would give the answer away
  
  We multiply max_answer by 1.5 to add the posibiliy for multiple-choice
  answers to overshot the actual answer, so the largest multiple-choice
  option is not always the actual answer. */
  
  if (answer > max_num) {
    debug("game_generate_answers", "Answer " + answer + " is more than current max number " + max_num + ".");
    max_num = answer * 1.5;
    debug("game_generate_answers", "New max number: " + max_num + "!");
  }
  
  // Generate multiple choice values
  // number_of_answers-1 to compensate for "answer" being appended
  for (var i = 0; i < number_of_answers-1; i++) {
    var random_number = randomNumber(min_num, max_num);
    appendItem(multiple_choice, random_number);
    debug("gane_generate_answers", "multiple-choice answer: " + random_number);
    
  }
  
  // Insert real answer randomly amongst multiple-choice answers
  var answer_index = randomNumber(0, number_of_answers-1);
  debug("game_generated_answers", "Inserting answer at random index: " + answer_index);
  insertItem(multiple_choice, answer_index, answer);
  
  debug("game_generated_answers", "Multiple-choice answers: " + multiple_choice);
  return multiple_choice;
}



// Game question generation
// Input Parameters:
// min_num: minimum number to use as part of the question generated (eg min_num=1 -> 100+100 is valid, 0+100 is invalid)
// max_num: maximum number to use as part of the question generated (eg max_num=12 -> 1+12 is valid, 1+13 is invalid)

// Usage: game_generate_question(min_num, max_num)
// returns array: [num1, operator, num2, multiple_choice_answers, answer]

// Output variables:
// num1: first number in equation: (eg "10" in 10+4)
// num2: second number in equation: (eg "4" in 10+4)
// operator: mathematical operator in english: (eg "add", "subtract", "multiply", "divide")
// multiple_choice_answers: array of possible answers, where at least 1 is the correct answer (eg [25,2,53,12])
// answer: the actual answer to the generated question (eg 14)
function game_generate_question(min_num, max_num) {
  
  var num1, num2, operator, answer, multiple_choice_answers;
  var number_of_answers = 4;
  var question_valid = false;
  
  
  // Don't change operator if question is invalid
  operator = randomValue(["add", "subtract", "multiply", "divide"]);
  debug("game_generate_question", "Operator: " + operator);
  
  // Continue looping until a valid question has been generated
  while (question_valid == false) {
    
    // Generate new numbers until question is valid with current operator
    num1 = randomNumber(min_num, max_num);
    num2 = randomNumber(min_num, max_num);
    debug("game_generate_question", "Numbers generated: " + num1 + ", " + num2);
    
    answer = game_calculate_question(num1, num2, operator);
    debug("game_generate_question", "Question: " + num1 + " " + operator + " " + num2 + " = " + answer);
  
    // If question is valid
    if (game_answer_isvalid(answer)) {
      
      // End while loop
      question_valid = true;
    }
  }
  multiple_choice_answers = game_generate_answers(min_num, max_num, number_of_answers, answer);
  return [num1, operator, num2, multiple_choice_answers, answer];
}
```
</details>
  
### Usage
```js
var gen = game_generate_question(1, 12);

// Unpack 'gen' to get all of the values you need
var num1 = gen[0];
var operator = gen[1];
var num2 = gen[2];
var multiple_choice_answers = gen[3];
var answer = gen[4];

// Generate question text to be displayed to the user
var question = '';
question += num1;
// Convert english operator to symbolic representation
question += " ";
question += game_symbolic_operator(operator);
question += " ";
question += num2;

// Set your element IDs to display the question and multiple choice options
// Change this ID to the element which you want to display your question text on (example: "1 + 7")
setProperty("title_game_question", "text", question);

// Change these IDs to your multiple choice buttons
setProperty("button_game_option0", "text", multiple_choice_answers[0]);
setProperty("button_game_option1", "text", multiple_choice_answers[1]);
setProperty("button_game_option2", "text", multiple_choice_answers[2]);
setProperty("button_game_option3", "text", multiple_choice_answers[3]);

// Create events for your multiple choice buttons which record which button is pressed to a variable.
// 'choice' will hold a value of a position in multiple_choice_answers. This can be used to determine
// what option the user chose.

// If implementing in this way, ensure that the variable "choice" has been defined at the top of your program
// so that it is global and accessible from anywhere in your codebase.
// Example:  var choice;
/*
onEvent("button_game_option0", "click", function( ) {
  choice = 0;
});
onEvent("button_game_option1", "click", function( ) {
  choice = 1;
});
// repeat for your other two buttons, using what ever button IDs you specified in design view
*/


// Check if the user chose the correct answer
/*
// Extract the value from multiple_choice_answers at the index of 'choice'
var user_answer = multiple_choice_answers[choice];
// Compare the users answer against the actual answer
var user_correct = user_answer == answer; 
if (user_correct) {
  // add points to the players score
} else {
  // "you got it wrong, better luck next time"
}
*/
```

## Final implementation
```js
var choice;
var timer = 0;

  
  
// Screen: Game
// Main game loop
function game_loop(level) {
  setScreen("screen_game");
  
  // Reset user choice from previous games
  choice = undefined;
  
  // Define local variables
  var gen, multiple_choice_answers, answer;  // Question generation variables
  var score = 0;  // Store the users score for their current game
  var score_increment;  // Amount to add to the score (based on difficulty)
  var status;  // What the main game loop should do
  var user_choice;  // Store the number the user clicked on as their answer
  var timer_static = timer;
  var rounds_passed = 0;

  if (level == 0) {
    score_increment = 1;

  } else if (level == 1) {
    score_increment = 2;
    
  } else if (level == 2) {
    score_increment = 3;
  }

  status = 'ready_to_generate';
  timedLoop(1000, function() {
    if (status == 'ready_to_generate' && rounds_passed >= 11) {
      // 10 rounds have passed
      setProperty("gameover_text_score", "text", score);
      setScreen("screen_gameover");
      status = "end";
      stopTimedLoop();
    }
    if(status == 'ready_to_generate') {
      timer = timer_static;
      choice = undefined;
      rounds_passed = rounds_passed + 1;
      var gen = game_generate_question(1, 12);

      // Unpack 'gen' to get all of the values you need
      var num1 = gen[0];
      var operator = gen[1];
      var num2 = gen[2];
      multiple_choice_answers = gen[3];
      answer = gen[4];
      
      // Generate question text to be displayed to the user
      var question = '';
      question += num1;
      // Convert english operator to symbolic representation
      question += " ";
      question += game_symbolic_operator(operator);
      question += " ";
      question += num2;
      
      // Set your element IDs to display the question and multiple choice options
      // Change this ID to the element which you want to display your question text on (example: "1 + 7")
      setProperty("title_game_question", "text", question);
      
      // Change these IDs to your multiple choice buttons
      setProperty("button_game_option0", "text", multiple_choice_answers[0]);
      setProperty("button_game_option1", "text", multiple_choice_answers[1]);
      setProperty("button_game_option2", "text", multiple_choice_answers[2]);
      setProperty("button_game_option3", "text", multiple_choice_answers[3]);
      // space at the bottom of the set properties
      status = 'waiting_for_answer';
    }
    if (status == 'waiting_for_answer') {
      // If user has chosen an answer
      if (choice != undefined) {
        user_choice = multiple_choice_answers[choice];
        // Resetting so we are ready for the next loop
        choice = undefined;
        status = 'ready_to_generate';
        var user_correct = user_choice==answer;
        if (user_correct) {
          // user got it right
          score = score + score_increment;


        }
      } else {
        // User has not chosen
        // If timer is not disabled
        if (timer_static != 0) {
          timer = timer - 1;
          // If timer has run out
          if (timer <= 0) {
            status = 'ready_to_generate';
          }
        }
        
      }
    }
  });
}



// Level 0
onEvent("button_level_0", "click", function ( ) {
  timer = 0;
  game_loop(0);
});

// Level 1
onEvent("button_level_1", "click", function ( ) {
  timer = 20;
  game_loop(1);
});

// Level 2
onEvent("button_level_2", "click", function ( ) {
  timer = 10;
  game_loop(2);
});



// button choice 0
onEvent("button_game_option0", "click", function( ) {
  choice = 0;
});

// button choice 1
onEvent("button_game_option1", "click", function( ) {
  choice = 1;
});

// button choice 2
onEvent("button_game_option2", "click", function( ) {
  choice = 2;
});

// button choice 3
onEvent("button_game_option3", "click", function( ) {
  choice = 3;
});
```
