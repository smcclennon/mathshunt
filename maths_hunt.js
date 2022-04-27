/*
Copyright (c) 2022 Shiraz McClennon (https://smcclennon.github.io)
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*
  ▄▄▄▄███▄▄▄▄      ▄████████     ███        ▄█    █▄       ▄████████         ▄█    █▄    ███    █▄  ███▄▄▄▄       ███     
▄██▀▀▀███▀▀▀██▄   ███    ███ ▀█████████▄   ███    ███     ███    ███        ███    ███   ███    ███ ███▀▀▀██▄ ▀█████████▄ 
███   ███   ███   ███    ███    ▀███▀▀██   ███    ███     ███    █▀         ███    ███   ███    ███ ███   ███    ▀███▀▀██ 
███   ███   ███   ███    ███     ███   ▀  ▄███▄▄▄▄███▄▄   ███              ▄███▄▄▄▄███▄▄ ███    ███ ███   ███     ███   ▀ 
███   ███   ███ ▀███████████     ███     ▀▀███▀▀▀▀███▀  ▀███████████      ▀▀███▀▀▀▀███▀  ███    ███ ███   ███     ███     
███   ███   ███   ███    ███     ███       ███    ███            ███        ███    ███   ███    ███ ███   ███     ███     
███   ███   ███   ███    ███     ███       ███    ███      ▄█    ███        ███    ███   ███    ███ ███   ███     ███     
 ▀█   ███   █▀    ███    █▀     ▄████▀     ███    █▀     ▄████████▀         ███    █▀    ████████▀   ▀█   █▀     ▄████▀   
*/


/*
 ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     ███████╗
██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝
██║  ███╗██      ██║   ██║██████╔╝███████║██║     ███████╗
██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     ╚════██║
╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗███████║
╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
Declare global variables */

// Display debug messages
var d = false; 

// Record and display performance messages
var p = true;

// Remember previous screen accessed to enable "go back" button functionality
var screen_breadcrumb_value;

// Keep track of if we are ready to take more inputs
// Used to prevent timed properties from breaking and losing their previous state
var ready = true;


var performance_loop = [0,0];
var performance_data = [];
var performance_data_current;

var authenticated_username;
var choice;
var timer = 0;



// Print debug messages
function debug(name, message) {
  if (d) {
    console.log("@@ [" + name + "]  " + message);
  }
}




/*
███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗     
██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║     
█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     
██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     
███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗
╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝
Define functions for missing features in ES2015 */

// Is a value numerical? [returns: true, false]
// https://stackoverflow.com/a/14636638
function isNum(value) {
  return typeof value === 'number';
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



// Get average for values in array
function average(array) {
  var number_of_items = array_len(array);
  var sum = 0;
  
  for (var index in array) {
    sum += array[index];
  }
  
  return sum / number_of_items;
}

/*
██████╗  █████╗  ██████╗██╗  ██╗███████╗███╗   ██╗██████╗ 
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝████╗  ██║██╔══██╗
██████╔╝███████║██║     █████╔╝ █████╗  ██╔██╗ ██║██║  ██║
██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║╚██╗██║██║  ██║
██████╔╝██║  ██║╚██████╗██║  ██╗███████╗██║ ╚████║██████╔╝
╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ 
Generalised shared backend modules to provide extra functionality */

// Measure performance of the program by timing how long loops take
function performance(loop_print, max_loop_data, expected_ms, title) {
  if (p) {
    
    // Reset performance data
    if (loop_print == 'reset') {
      performance_loop = [0,0];
      performance_data_current = undefined;
      debug("performance", "Reset data.");
    }
    if (performance_data_current == undefined) {
      // Initialise current data with absolute time
      performance_data_current = getTime();
      
      // Initialise data timings history
      performance_data = [];
    } else {
      
      // Calculate previous loop
      var duration = getTime() - performance_data_current;
      appendItem(performance_data, duration);
      
      // Record new performance data: (timeNOW - timeLastRecorded)
      performance_data_current = getTime();
      
      performance_loop[0]++;
      performance_loop[1]++;
      
      // Trim performance data
      var performance_data_len = array_len(performance_data);
      if (performance_data_len > max_loop_data) {
        removeItem(performance_data, 0);
      }
      
      // If reached desired loop length for output
      if (performance_loop[0] == loop_print) {
        performance_loop[0] = 0;
        
        //var performance_data_len = array_len(performance_data);
        //var duration = getTime() - performance_data[performance_data_len-1];
        var average_time = average(performance_data);
        average_time = Math.round(average_time);
        
        console.log(">>> [Performance: " + title + "]  [Loop: " + performance_loop[1] + "] [Data: " + performance_data_len + "] Avg: " + average_time + "ms /" + expected_ms);
      }
    }
  }
}

// Protect async tasks from unexpected results
// readyin() [returns current status: true, false]
// readyin(false) [sets currently ready status to false forever]
// readyin(1000) [sets current ready status to true in 1000ms]
function readyin(parameter) {
  
  // If "seconds" parameter was not passed in
  // Return ready status
  if (parameter == undefined){
    if (ready) {
      debug("readyin", "[polled] ready!");
      return true;
    } else {
      debug("readyin", "[polled] not ready.");
      return false;
    }

  // If parameter == false
  // Set ready status to false
  } else if (parameter == false) {
      debug("readyin", "Set ready to FALSE.");
      ready = false;
  
  // Set ready status to true
  } else if (parameter == true) {
      debug("readyin", "Set ready to TRUE!");
      ready = true;

  // Sleep and then set ready status to true
  } else {
    // Sleep for "seconds" seconds
    debug("readyin", "* Sleeping for " + parameter + "ms before setting true...");
    setTimeout(function() {
    debug("readyin", "* Set ready to TRUE!");
    ready = true;
    }, parameter);
  }
}



// Store and retrieve previous screen accessed
function screen_breadcrumb(value) {
  if (value == "!get") {
    
    // Return previous screen
    var breadcrumb = screen_breadcrumb_value;
    debug("screen_breadcrumb", "Retrieving breadcrumb: " + breadcrumb);
    return breadcrumb;

  } else {
    // Set breadcrumb
    debug("screen_breadcrumb", "Setting breadcrumb: " + value);
    screen_breadcrumb_value = value;
  }
}



/*
██████╗ ██████╗ 
██╔══██╗██╔══██╗
██║  ██║██████╔╝
██║  ██║██╔══██╗
██████╔╝██████╔╝
╚═════╝ ╚═════╝ 
Interfacing with the database */

/*
Non-async database search
Check if user exists in database: Db_search('username')  [Returns: true, false]
Get value of column for a specific user: Db_search('username', 'column')  [Returns: column_value, false]
*/
function Db_search(username, column) {
  // Get column of all users in database
  debug("Db_search", "Retrieving column 'username' from database...");
  var users = getColumn("userdb", "username");
  
  // Get index of target username
  // https://stackoverflow.com/a/5864424
  debug("Db_search", "Getting index for username '" + username + "'...");
  var username_index = users.indexOf(username);
  
  // If target username has valid index in array "users"
  if (username_index != -1) {
    debug("Db_search", "Found user '" + username + "' at index " + username_index + "!");
  
    // If parameter "column" was passed in to the function
    if (column != undefined) {
      
      // Retrieve the column from the database
      debug("Db_search", "Retrieving column '" + column + "' from database...");
      var column_data = getColumn("userdb", column);
      
      // Return the value at the same index as the username
      var column_target = column_data[username_index];
      debug("Db_search", "Returning column index " + username_index + ": " + column_target);
      return column_target;

    } else {
      // If no column parameter was passed, return user exists instead
      debug("Db_search", "No column specified. Returning user exist status: true");
      return true;
    }
    
  } else {
    // If target username has invalid index, return error response code
    debug("Db_search", "Username '" + username + "' does not exist. Returning user exist status: false");
    return false;
  }
}



// Store credentials
function Db_putcreds(username, password) {
  createRecord("userdb", {"username":username, "password":password});
  debug("Db_putcreds", "Created record for username '" + username +"'!");
}

function Db_changescore(username, new_score) {
  //var status = "async_start";
  debug("Db_changescore", "Updating leaderboard score for user '" + username + "' to " + new_score + "...") ;
  // Get the database ID for user
  var db_response = Db_search(username, 'id');

  // Get the users password, so when we overwrite their record
  // their password is not reset
  var password = Db_search(username, 'password');

  // If the database failed to find the user
  if (db_response == false) {
    debug("Db_changescore", "Could not update score. User does not exist: " + username);

  // If the database found the user
  } else {
    debug("Db_changescore", "Got User ID: " + db_response + ", updating record...");

    // Start async function to update user entry
    updateRecord("userdb", {id:db_response, username:username, password:password, highscore:new_score}, function(record, success) {

      // Call this code once the update has completed
      if (success) {
        debug("Db_changescore", "Record id:" +record.id + " has been updated!");
        //status = "done";
      } else {
        debug("Db_changescore", "Record NOT updated.");
      }
    });
  }
}



/*
 █████╗ ██╗   ██╗████████╗██╗  ██╗
██╔══██╗██║   ██║╚══██╔══╝██║  ██║
███████║██║   ██║   ██║   ███████║
██╔══██║██║   ██║   ██║   ██╔══██║
██║  ██║╚██████╔╝   ██║   ██║  ██║
╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
Authentication modules */

// Register user
function Auth_register(username, password) {
  debug("Auth_register", "Registering user: '" + username + "'...");
  
  // true/false status of username presence in database
  var user_exists = Db_search(username);

  // If username exists
  if (user_exists) {
    debug("Auth_register", "Could not register user '" + username + "': User already exists");
    return "user_exists";
  
  // If username does not exist
  } else if (!user_exists) {
    
    // Store credentials
    Db_putcreds(username, password);
    
    debug("Auth_register", "Successfully registered user '" + username + "'. User authenticated!");
    authenticated_username = username;
    return "success";
  }
}



// Authenticate / login user
function Auth_authenticate(username, password) {
  debug("Auth_authenticate", "Authenticating '" + username + "'...");
  
  // true/false status of username presence in database
  var db_response = Db_search(username, 'password');

  // If username does not exist
  if (db_response == false) {
    debug("Auth_authenticate", "Could not authenticate user '" + username + "': User does not exist");
    return "invalid_username";
  
  // If username exists
  } else {
    debug("Auth_authenticate", "Valid username!");
    
    // If provided password matches database copy
    if (password == db_response) {
      debug("Auth_authenticate", "Valid password, user authenticated!");
      authenticated_username = username;
      return "success";
    
    // If provided password does not match database copy
    } else {
      debug("Auth_authenticate", "Invalid password.");
      return "invalid_password";
    }
  }
}




/*
██████╗ ███████╗██████╗ ██╗ ██████╗ █████╗ ████████╗███████╗██████╗ 
██╔══██╗██╔════╝██╔══██╗██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
██║  ██║█████╗  ██║  ██║██║██║     ███████║   ██║   █████╗  ██║  ██║
██║  ██║██╔══╝  ██║  ██║██║██║     ██╔══██║   ██║   ██╔══╝  ██║  ██║
██████╔╝███████╗██████╔╝██║╚██████╗██║  ██║   ██║   ███████╗██████╔╝
╚═════╝ ╚══════╝╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝ 
Dedicated backend modules for specific non-shared task */

// Screen: Login
// Get credentials entered in to the "Username" and "Password" fields
function Screen_login_getcreds() {
  
  // Get the values
  var username = getText("input_username");
  var password = getText("input_password");
  
  // Return them both in an array
  return [username, password];
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



// Screen: Game
// Game question generation
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



// Screen: Game
// Return how many points a correct answer on a specific difficulty should be awarded
function game_points(difficulty) {
  var score_increment;
  
  if (difficulty == 0) {
    score_increment = 1;
    
  } else if (difficulty == 1) {
    score_increment = 2;
    
  } else if (difficulty == 2) {
    score_increment = 3;
  }
  
  return score_increment;
}

// Screen: Game
// Return how long the timer should be on the specific difficulty
function game_timer_length(difficulty) {
  if (difficulty == 0) {
    return 0;
  } else if (difficulty == 1) {
    return 10;
  } else if (difficulty == 2) {
    return 20;
  }
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
// Return button ID based on choice ID
function game_button_id(choice_id) {
  if (choice_id == 0) {
    return "button_game_option0";
  
  } else if (choice_id == 1) {
    return "button_game_option1";
  
  } else if (choice_id == 2) {
    return "button_game_option2";

  } else if (choice_id == 3) {
    return "button_game_option3";
  }
}


// Screen: Game
// Compare every value in multiple_choice_answers to answer
// If value matches, use the index of the value to get the button ID
// Return button IDs in array
function game_correct_buttonids(multiple_choice_answers, answer) {
  //var answers_len = array_length(multiple_choice_answers);
  
  // Keep track of for loop index
  //var index = 0;
  
  // Store correct ids
  var correct_ids = [];

  for (var index in multiple_choice_answers) {
    var option = multiple_choice_answers[index]; 
    debug("game_correct_buttonids", "Checking option: " + option);
    // If option is correct
    if (option == answer) {
      
      // Convert the index of that option to a button id
      var button_id = game_button_id(index);
      debug("game_correct_buttonids", "Found correct button: " + button_id);
      
      // Append button id to correct_ids
      appendItem(correct_ids, button_id);
    }
    
    // Increment index with for loop
    //index ++;
  }
  
  //var choice_button_id = game_button_id(choice);
  //var correct_button_id = game_button_id();
  return correct_ids;
}


// Screen: leaderboard
// Update database if new score is a highscore
function leaderboard_updatescore(username, new_score) {
  debug("leaderboard_updatescore", "Checking feasibility of score change for user:" + username + " new_score:" + new_score + "...");
  
  debug("leaderboard_updatescore", "Retrieving current highscore for user:" + username + "...");
  var old_score = Db_search(username, "highscore");
  
  if (old_score >= new_score) {
    debug("leaderboard_updatescore", "Score not updated: old score " + old_score + " >= new score " + new_score + ".");
  } else {
    debug("leaderboard_updatescore", "New score " + new_score + " is more than current highscore " + old_score + ". Updating...");
    Db_changescore(username, new_score);
  }
}



// Screen: Leaderboard
// Get leaderboard information and sort by score
function leaderboard_getscores(){
  
  // Get list of all users
  debug("leaderboard_getscores", "Getting all usernames...");
  var users = getColumn("userdb", "username");
  
  // Get list of all scores
  debug("leaderboard_getscores", "Getting all scores...");
  var scores = getColumn("userdb", "highscore");
  
  // Merge username and score in a single array
  var merged = [];
  
  // For index in array 'users'
  for (var index in users) {
    
    // Get user and score at that index
    var user = users[index];
    var score = scores[index];
    
    // If user does not have a highscore
    if (score == undefined) {
      debug("leaderboard_getscores", "Skipping: " +index + " [" + user + "], No score.");
    
    // If user has a highscore
    } else {
      // Merge score and user in to array
      // Score at first index so that we can easily sort it
      debug("leaderboard_getscores", "Merging: " + index + " [" + user + ", " + score + "]...");
      appendItem(merged, [score, user]);
    }
  }
  debug("leaderboard_getscores", "Unsorted: " + merged);
  
  // https://www.w3schools.com/jsref/jsref_sort.asp
  // https://stackoverflow.com/a/3216041
  merged.sort(function(a, b) {
    return a[0] - b[0];
  });
  
  debug("leaderboard_getscores", "Sorted: " + merged);
  
  debug("leaderboard_getscores", "Returning sorted scores!");
  return merged;
}



/*
███████╗██████╗  ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗██████╗ 
██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║██╔══██╗
█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║██║  ██║
██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║██║  ██║
██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║██████╔╝
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝ 
Front-end modules for changing and displaying UI elements */

// Toggle a property for a specified time
function setTimedProperty(id, property, value, sleep) {
  var original_value;
  
  if (id == undefined) {
    debug("setTimedProperty", "id is undefined! Cannot execute property change: [" + property + " -> " + value + "]");
  } else {
    // Get original property value
    original_value = getProperty(id, property);
    
    // Set property to new, specified value (passed in to the function)
    debug("setTimedProperty", "Changing property [" + sleep + "ms] '" + id + "." + property + "': [" + original_value + ' -> ' + value +"]");
    setProperty(id, property, value);
  
    // Sleep for specified time before executing the code within this block
    setTimeout(function() {
      
      // Set property back to its original value
      debug("setTimedProperty", "Reverting property'" + id + "." + property + "': [" + value + ' -> ' + original_value +"]");
      setProperty(id, property, original_value);
      
    }, sleep);  // passed sleep duration in to setTimeout here
  }
}



// Screen: Login
// Set error box colour
function Screen_login_inputerror(id, message, sleep) {
  if (readyin()) {
    readyin(false);
    debug("Screen_login_inputerror", "Modifying id: " + id);
    setTimedProperty(id, "value", "", sleep); // Clear text in box
    setTimedProperty(id, "placeholder", message, sleep);
    setTimedProperty(id, "border-color", "#ffc73b", sleep);
    setTimedProperty(id, "background-color", "#faedcb", sleep);
    readyin(sleep);
  }
}



// Screen: Leaderboard
// Get leaderboard status and display screen
function Screen_leaderboard_update(){
  
  var elements = [
    ["text_leaderboard_score1", "text_leaderboard_name1"],
    ["text_leaderboard_score2", "text_leaderboard_name2"],
    ["text_leaderboard_score3", "text_leaderboard_name3"],
    ["text_leaderboard_score4", "text_leaderboard_name4"],
    ["text_leaderboard_score5", "text_leaderboard_name5"]
    ];
  var scores = leaderboard_getscores();
  
  // Count 0-4
  for (var index in elements) {
    
    // Return last item in array, and delete it
    var item = scores.pop();
    
    if (item != undefined) { 
      var score = item[0];
      var name = item[1];
      
      var score_element_id = elements[index][0];
      var name_element_id = elements[index][1];
      
      debug("Screen_leaderboard_update", "Setting property: '" + score_element_id + "' to '" + score + "'...");
      setProperty(score_element_id, "text", score);
      
      debug("Screen_leaderboard_update", "Setting property: '" + name_element_id + "' to '" + name + "'...");
      setProperty(name_element_id, "text", name);
    } else {
    debug("Screen_leaderboard_update", "Pop failed: element undefined.");
    }
  }
  debug("Screen_leaderboard_update", "Leaderboard screen has been updated!");
}



// Screen: Leaderboard
// Continuously update the leaderboard
function Screen_leaderboard_update_loop() {
  
  // Update once immediately
  debug("Screen_leaderboard_update_loop", "Updating for first time...");
  Screen_leaderboard_update();
  
  // Update every 2 seconds
  var sleep = 2000;
  
  timedLoop(sleep, function() {
    performance(1, 10, sleep, 'leaderboard_update');
    console.log();
    debug("Screen_leaderboard_update_loop", "Starting update loop...");
    if (readyin()) {
      Screen_leaderboard_update();
      
      debug("Screen_leaderboard_update_loop", "Loop sleeping for " + sleep + "ms...");
    } else {
      debug("Screen_leaderboard_update_loop", "Looping ended, exiting: readyin was set to false.");
      readyin(true);
      stopTimedLoop();
    }
  });
  
}


// Screen: Game
// Set button colours with choice results
function Screen_game_choicefeedback(choice_id, correct_ids, sleep) {
  for (var index in correct_ids) {
    var id = correct_ids[index];
    console.log();
    debug("Screen_game_choicefeedback", "Setting correct ID: " + id);
    setTimedProperty(id, "border-color", "#88ff88", sleep);
    setTimedProperty(id, "background-color", "#bbffbb", sleep);
  }
  
  // Get choice index position in correct ids
  var choice_index = correct_ids.indexOf(choice_id);
  
  // If choice does not exist in correct answers
  if (choice_index == -1) {
    console.log();
    debug("Screen_game_choicefeedback", "Choice ID not in correct IDs. Setting choice ID: " + choice_id);
  setTimedProperty(choice_id, "border-color", "#ff8888", sleep);
  setTimedProperty(choice_id, "background-color", "#ffbbbb", sleep);
  }
}



// Screen: Game
// Set correct answer feedback
function Screen_game_answer_feedback(multiple_choice_answers, answer, user_choice, score, sleep) {
  readyin(false);
  // Get array of correct button IDs based on multiple_choice_answers compared to answer
  var correct_ids = game_correct_buttonids(multiple_choice_answers, answer);
  
  // Get button ID for 'choice' variable
  var choice_id = game_button_id(user_choice);
  
  
  //
  setProperty("title_game_question", "text", "Score: " + score);
  
  // Animate buttons
  Screen_game_choicefeedback(choice_id, correct_ids, sleep);
  readyin(sleep);
}



// Screen: Game
// Display quesiton and options
function Screen_game_display(gen) {
  
  // Load question and answers
  var num1 = gen[0];
  var operator = gen[1];
  var num2 = gen[2];
  var multiple_choice_answers = gen[3];
  
  // Generate question text for the title box
  var question = '';
  
  question += num1;
  
  // Convert english operator to symbolic representation
  question += " ";
  question += game_symbolic_operator(operator);
  question += " ";
  
  question += num2;
  
  debug("Screen_game_display", "Formatted question: " + question);
  
  // Set elements to the correct values
  debug("Screen_game_display", "Setting properties...");
  setProperty("title_game_question", "text", question);
  setProperty("button_game_option0", "text", multiple_choice_answers[0]);
  setProperty("button_game_option1", "text", multiple_choice_answers[1]);
  setProperty("button_game_option2", "text", multiple_choice_answers[2]);
  setProperty("button_game_option3", "text", multiple_choice_answers[3]);
  debug("Screen_game_display", "All properties set to generated values!");
}



// Screen: Score
// Initialise and set score screen
function Screen_score_init(username, score) {
  
  // Update database with new score if it is higher
  leaderboard_updatescore(username, score);
  
  // Open the score screen
  setProperty("text_gameover_score", "text", score);
  setScreen("screen_gameover");
  
  debug("Screen_score_init", "Displayed gameover screen. Updating leaderboard db...");
  
  //Db_changescore(username, score);
}


// Screen: Game
// Update the timer progress bar with the appropriate timer status
function game_update_timer(start_time, current_time) {
  
  // define scope
  var timer_text;
  
  // Initial widths of elements
  var timer_text_width = 194;
  
  // Calculate percentage of time remaining
  var percentage = current_time / start_time;
  debug("game_update_timer", "Timer fill: " + percentage + '%');
  
  // Calculate appropriate new width based on that percentage
  var updated_timer_text_width = timer_text_width * percentage;
  
  // When more than 60% time left
  // Update progress bar fill colour to blue
  if (percentage > 0.6) {
    
    // Create timer text
    timer_text = Math.round(timer) + ' seconds left...';
    
    // Set progress bar to default blue
    setProperty("game_progressbar_text", "background-color", "#0D80C6");
  
  // When less than 60% time left
  } else {
    // Reduce timer text length due to reduced space
    timer_text = Math.round(timer);
    
    // When less than 35% time left
    if (percentage < 0.35) {
      // Update progress bar fill colour to orange
      setProperty("game_progressbar_text", "background-color", "#EC9235");
    }
  }
  
  // Update progress bar text
  setProperty("game_progressbar_text", "text", timer_text);
  
  // Update progress bar fill/width
  setProperty("game_progressbar_text", "width", updated_timer_text_width);
}


// Screen: Game
// Main game loop
function Screen_game_main(username, difficulty) {
  
  // Reset user choice from previous games
  choice = undefined;
  
  // Define local variables
  var gen, multiple_choice_answers, answer;
  var loops = 1;
  var score = 0;
  var score_increment;
  var status;
  var user_choice;
  var timer_length = game_timer_length(difficulty);
  
  function update_status(new_status) {
    debug("Screen_game_main", "  [status]  Updating status: [" + status + " -> " + new_status + "]");
    status = new_status;
  }
  
  update_status("ready_to_generate");
  
  // Get score increment value for user chosen difficulty
  score_increment = game_points(difficulty);

  // Switch to game screen
  setScreen("screen_game");

  // Async loop with if checks to break
  var game_loop_duration_ms = 100;
  var game_loop_timer_decrement = game_loop_duration_ms / 1000;
  debug('Screen_game_main', 'Game loop duration: ' + game_loop_duration_ms + 'ms.');
  debug('Screen_game_main', 'Game loop decrement: -' + game_loop_timer_decrement);
  
  timedLoop(game_loop_duration_ms, function() {
    performance(10, 10, game_loop_duration_ms, 'game_main');
    
    if (status == "ready_to_generate" && loops <= 10) {
      performance('reset');
      
      // Don't run code in this if{} till it is time to generate a new question
      update_status("generating_question");
      
      // Generate question and answers
      console.log('\n\n');
      debug("Screen_game_main", "Executing round " + loops + "...");
      
      // Reset timer
      debug('Screen_game_main', 'Resetting timer');
      timer = timer_length;
      
      // Generate game questions and answers
      // num1, num2, operator, multiple choice, actual answer
      gen = game_generate_question(1, 12);
      
      // Extract data we need from response
      multiple_choice_answers = gen[3];
      answer = gen[4];
      
      // Display question and answers
      Screen_game_display(gen);
      debug("Screen_game_main", "Waiting for user choice...");
      
    // If 10 rounds have been completed
    } else if (loops > 10) {
      debug("Screen_game_main", "More than 10 rounds have passed. Ending main game loop. Changing to gameover screen.");

      // Finish game!
      // Set screen to score
      Screen_score_init(username, score);
      
      // Stop game loop
      update_status("done");
      choice = undefined;
      debug("Screen_game_main", "Reset user choice to: " + choice);
      
      timer = 0;
      debug("Screen_game_main", "Reset timer to: " + timer);
      
      debug("Screen_game_main", "Ending timed loop. Goodbye!");
      stopTimedLoop();
    }
    
    // If variable 'choice' has been assigned
    if (choice != undefined){
      debug("Screen_game_main", "Detected user choice value: " + choice);
      
      // If scores have not been calculated yet
      if (status != "displaying_answer") {
        
        // Keep track of first choice so subsequent clicks dont break the program
        user_choice = choice;
        
        // Another round has passed
        loops ++;
        
        // If the choice index in the answers array == the answer
        var user_answer = multiple_choice_answers[user_choice];
        
        if (user_answer == answer) {
          score += score_increment;
          debug("Screen_game_main", "User chose correct answer " + answer + "!");
          debug("Screen_game_main", "New score: " + score + " (+" + score_increment + ")");
      
        } else {
          debug("Screen_game_main", "User chose incorrect answer " + user_answer + " (Correct: " + answer + ").");
        }
        
        Screen_game_answer_feedback(multiple_choice_answers, answer, user_choice, score, 1000);
        
        update_status("displaying_answer");
      
      
      // If displaying answers has already started
      } else if (status == "displaying_answer") {
    
        if (readyin()) {
          // Delete variable 'choice'. Can only be set undefined here. That means
          // when it is re-defined, it can be assumed it is due to a user button event
          debug("Screen_game_main", "Display finished. Restarting game loop!");
          choice = undefined;
          update_status("ready_to_generate");
        }
      }
      // If user choice has not been set
    } else {
      // Handle timer
      // If timer has a length (is enabled)
      if (timer_length > 0) {
        
        // If timer has more than 0.5 seconds left
        /* Using 0.5 so that we begin processing and rendering the correct answer
           which is time consuming. Using 0.5 instead of 0.9 because the time
           displayd to the user is rounded, so using 0.5 ensuresd that the user
           is being displayed "0", and gives us the longest time possible to
           process and render the answers.
           This speed increase illusion does mean that as soon as the user sees
           "0", any user inputs will be ignored, as we will be processing the
           answers by then */
        if (timer > 0.5) {
          timer -= game_loop_timer_decrement;
          debug('Screen_game_main', 'Decrementing timer to: ' + timer);
          game_update_timer(timer_length, timer);
        } else {
          debug('Screen_game_main', 'Timer below or equal to zero. User did not answer in time.');
          
          // Set choice to wrong answer, to then display correct answer and start a new round
          update_status("user_did_not_choose");
          choice = 'user_did_not_choose';
        }
      }
    }
  });
}



/*
███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
Event handlers */

// Screen: Home
// Button: "Play icon"
onEvent("button_home_play", "click", function( ) {
	console.log("button_play clicked!");
	
	// Set screen "login"
	setScreen("screen_login");
});


// Screen: Home
// Button: "Leaderboard icon"
onEvent("button_home_leaderboard", "click", function( ) {
	console.log("button_home_leaderboard clicked!");
	screen_breadcrumb("screen_home");  // Track where user was before entering leaderboard
	
	setScreen("screen_leaderboard");
	Screen_leaderboard_update_loop();
});



// Screen: Leaderboard
// Button: "Go back"
onEvent("button_leaderboard_back", "click", function( ) {
  console.log("button_leaderboard_back clicked!");
  
  readyin(false);

  // Set screen to screen accessed before the leaderboard
  setScreen(screen_breadcrumb("!get"));
});



// Screen: Login
// Button: "Register"
onEvent("button_register", "click", function( ) {
  console.log("button_register clicked!");
  if (readyin()) {
      
    var credentials = Screen_login_getcreds();
    var username = credentials[0];
    var password = credentials[1];
    
    
    var authorisation = Auth_register(username, password);
    if (authorisation == "success") {
      setScreen("screen_levelselect");
    } else if (authorisation == "user_exists") {
        Screen_login_inputerror("input_username", "Username taken", 800);
    }
  }
});



// Screen: Login
// Button: "Login"
onEvent("button_login", "click", function( ) {
  console.log("button_login clicked!");

  if (readyin()) {
    var credentials = Screen_login_getcreds();
    var username = credentials[0];
    var password = credentials[1];
    
    var auth = Auth_authenticate(username, password);
  
    // If authentication was successful
    if (auth == "success") {
      setScreen("screen_levelselect");
    
    // If authentication failed due to an invalid username
    } else if (auth == "invalid_username") {
      Screen_login_inputerror("input_username", "User does not exist", 800);
    
    // If authentication failed due to an invalid password
    } else if (auth == "invalid_password") {
      Screen_login_inputerror("input_password", "Incorrect password", 800);
    }
  }
});



// Screen: Level select
// Button: "Level 0"
onEvent("button_level0", "click", function ( ) {
  console.log("button_level0 clicked!");
  Screen_game_main(authenticated_username, 0);
});



// Screen: Level select
// Button: "Level 1"
onEvent("button_level1", "click", function ( ) {
  console.log("button_level1 clicked!");
  Screen_game_main(authenticated_username, 1);
});



// Screen: Level select
// Button: "Level 2"
onEvent("button_level2", "click", function ( ) {
  console.log("button_level2 clicked!");
  Screen_game_main(authenticated_username, 2);
});



// Screen: Game
// Button: "Option 1"
onEvent("button_game_option0", "click", function( ) {
  console.log("button_game_option0 clicked!");
  choice = 0;
});



// Screen: Game
// Button: "Option 2"
onEvent("button_game_option1", "click", function( ) {
  console.log("button_game_option1 clicked!");
  choice = 1;
});



// Screen: Game
// Button: "Option 3"
onEvent("button_game_option2", "click", function( ) {
  console.log("button_game_option2 clicked!");
  choice = 2;
});



// Screen: Game
// Buthttps://studio.code.org/v3/assets/tnyvPR89_9SjyNsJAzUVjOgN2FZoqLe5gJeTu28waDw/UXv2_leaderboard_entry.pngton: "Option 4"
onEvent("button_game_option3", "click", function( ) {
  console.log("button_game_option3 clicked!");
  choice = 3;
});



// Screen: Game over
// Button: "Leaderboard"
onEvent("button_gameover_leaderboard", "click", function ( ) {
	console.log("button_gameover_leaderboard clicked!");
	screen_breadcrumb("screen_gameover");  // Track where user was before entering leaderboard
	setScreen("screen_leaderboard");
	Screen_leaderboard_update_loop();
});



// Screen: Game over
// Button: "Play"
onEvent("button_gameover_play", "click", function( ) {
  console.log("button_gameover_play clicked!");
  
  // User is already authenticated, go straight to level select
  setScreen("screen_levelselect");
});
