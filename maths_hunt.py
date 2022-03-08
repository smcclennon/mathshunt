import os, hashlib, json, base64, random, time

# Print coloured debug messages if True
debug_messages = True
def debug(message, status='debug'):
    if debug_messages:
        colours = {
            "grey": "\033[0;37m",
            "yellow_bold": "\033[1;33m",
            "red": "\033[0;31m",
            "green": "\033[0;32m",
            "end": "\033[0m"
        }
        if status == 'debug':
            status_colour = colours["grey"]
        elif status == 0:
            status_colour = colours["green"]
        elif status == 1:
            status_colour = colours["red"]
        print(f'{colours["yellow_bold"]}DEBUG: {colours["end"]}{status_colour}{message}{colours["end"]}')

# github.com/smcclennon/pyauth
# Backend modules handling cryptography and codecs
class Codec():

    # https://nitratine.net/blog/post/how-to-hash-passwords-in-python/
    def hash(password, **kwargs):
        debug('Hashing password')
        # Generate secure random salt
        new_salt = os.urandom(32)
        # Use salt argument over new_salt if provided
        salt = kwargs.get("salt", new_salt)

        # Generate key
        key = hashlib.pbkdf2_hmac(
            "sha256", # The hash digest algorithm for HMAC
            password.encode("utf-8"), # Convert the password to bytes
            salt, # Provide the salt
            100000 # It is recommended to use at least 100,000 iterations of SHA-256 
        )
        return salt, key

    def b64_encode(original_bytes):
        debug('Encoding bytes to base64')
        # Input: b'T\x8b[m\xa7>'
        base64_bytes = base64.b64encode(original_bytes)  # Encode with base64: b'VItbbac+'
        base64_string = base64_bytes.decode('utf-8')  # Bytes to string: 'VItbbac+'
        return base64_string

    def b64_decode(base64_string):
        debug('Decoding base64 to bytes')
        # Input: 'VItbbac+'
        base64_bytes = base64_string.encode('utf-8')  # b'VItbbac+'
        original_bytes = base64.b64decode(base64_bytes)  # Decode from base64: b'T\x8b[m\xa7>'
        return original_bytes

# github.com/smcclennon/pyauth
# Interface with database file
class Db_interface():
    user_db_filename = 'user_db'
    
    def save_db():
        debug('Saving database to disk')
        with open(f"{Db_interface.user_db_filename}.json", "w") as user_db_file:
            json.dump(Db_interface.users, user_db_file)
            debug('\tWrote database to disk', 0)
    
    def load_db():
        debug('Loading database from disk')
        while True:
            try:
                # Load user database from file
                with open(f"{Db_interface.user_db_filename}.json", "r") as user_db_file:
                    # Store contents of file as string
                    # These contents are backed up if JSON load fails
                    user_db_string = user_db_file.read()
                    # Attempt to load file contents as JSON
                    user_db = json.loads(user_db_string)
                # Print success message
                debug('\tLoaded database!', 0)
                # Database loaded successfully, stop looping
                Db_interface.users = user_db
                break

            # If JSON is erroneous, backup file and delete original
            except json.decoder.JSONDecodeError as e:
                # New variable name for clarity
                user_db_backup = user_db_string
                # Open Create backup file
                with open(f"{Db_interface.user_db_filename}_backup.json", "w") as user_db_backup_file:
                    # Write erroneous file contents to backup file
                    user_db_backup_file.write(user_db_backup)
                debug(f'\tErroneous database detected and backed up [{e}]', 1)
                # Delete original erroneous file, and re-loop to create new file
                os.remove(f'{Db_interface.user_db_filename}.json')

            # If original file missing, recreate with blank data
            except FileNotFoundError:
                debug('\tNo database found', 1)
                # Create new file
                with open(f"{Db_interface.user_db_filename}.json", "w") as user_db_file:
                    # Initialise with empty JSON data structure
                    json.dump(dict(), user_db_file)
                # Print debug message and re-loop (to load database in to variable)
                debug('\tCreated new database', 0)

    def getcreds(username):
        debug(f'Getting credentials for "{username}"')
        creds = []
        for item in ["salt", "key"]:
            encoded_item = Db_interface.users[username][item]
            decoded_item = Codec.b64_decode(encoded_item)
            creds.append(decoded_item)
        debug('\tCredentials retrieved!', 0)
        return creds[0], creds[1]  # return salt, key

    def putcreds(username, salt, key):
        debug(f'Putting credentials for "{username}"')
        creds = []
        for item in [salt, key]:
            encoded_item = Codec.b64_encode(item)
            creds.append(encoded_item)
        Db_interface.users[username].update({"salt": creds[0], "key": creds[1]})
        debug('\tPut credentials!', 0)
        Db_interface.save_db()
    
    def puthighscore(username, score):
        debug(f'Putting leaderboard entry {score} for "{username}"')
        Db_interface.users[username].update({"highscore": score})
        debug('\tPut leaderboard entry!', 0)
        Db_interface.save_db()

# github.com/smcclennon/pyauth
# Authentication code
class Auth():

    def authenticate(username, password):
        debug(f'Authenticating "{username}"')
        if username in Db_interface.users:
            # Get correct keys from database, converting string back to bytes
            original_salt, original_key = Db_interface.getcreds(username)

            # Generate new keys using provided credentials
            original_salt, new_key = Codec.hash(password, salt=original_salt)

            # Compare new keys to correct keys
            if original_key == new_key:
                debug('\tAuthentication success!', 0)
                return "success"
            else:
                debug('\tAuthentication failure, invalid_password', 1)
                return "invalid_password"
        else:
            debug('\tAuthentication failure, invalid_user', 1)
            return "invalid_user"

    def register(username, password):
        debug(f'Registering {username}')
        
        # Prevent new dictionary keys being stored as integers
        username = str(username)

        if username in Db_interface.users:
            debug('\tRegistration failure, username_taken', 1)
            return "username_taken"
        else:
            # Generate secure keys for storage
            salt, key = Codec.hash(password)

            # Initialise user entry
            # Add "highscore" data field to user
            Db_interface.users.update({username: {"highscore": 0}})
            # Store non-plaintext password
            Db_interface.putcreds(username, salt, key)
            debug('\tRegistration success!', 0)
            return "success"


class module:
    """ Used to group/organise back-end code which does not display anything """
    
    def update_highscore(username, score):
        debug(f'Updating highscore for user "{username}"')
        oldscore = Db_interface.users[username]["highscore"]
        if score > oldscore:
            Db_interface.puthighscore(username, score)
            debug(f'\tUpdated highscore for user "{username}": {oldscore} -> {score}', 0)
            return True
        else:
            debug(f'\tHighscore not updated for user "{username}": Old score {oldscore} >= {score}', 1)
            return False
    
    def generate_operator():
        # Generate the operator used in the maths question
        operator = random.choice(["add", "subtract", "multiply", "divide"])
        debug(f'\tOperator: {operator}')
        return operator

    def calculate_question(num1, num2, operator):
        if operator == "add":
            answer = num1 + num2  # Add num1 and num2 together
        elif operator == "subtract":
            answer = num1 - num2  # Subtract num2 from num1
        elif operator == "multiply":
            answer = num1 * num2  # Multiply num1 and num2 together
        elif operator == "divide":
            answer = num1 / num2 # Divide num1 in to num2
        return answer
    
    def answer_isvalid(answer):
        # Validate answer
        if not float(answer).is_integer():
            debug(f'\tAnswer is not an integer', 1)
            return False
        elif answer < 0:
            debug(f'\tAnswer is less than 0', 1)
            return False
        else:
            debug('\tAnswer is valid', 0)
            return True

    def generate_answers(min_number, max_number, number_of_values, answer):
        # Generate multiple choice values
        debug('')
        debug(f'Generating {number_of_values} multiple-choice answers between {min_number} and {max_number}')
        
        # Increase max multiple-choice value to answer if the answer > max_number 
        """
        We do this because if the answer was 200, the multiple choice quesitons would
        otherwise be something like: [1, 12, 200, 4]
        and the extreme difference would give the answer away
        
        We multiply max_answer by 1.5 to add the posibiliy for multiple-choice
        answers to overshot the actual answer, so the largest multiple-choice
        option is not always the actual answer.
        """
        if answer > max_number:
            debug(f'\tAnswer {answer} is more than current max number {max_number}.', 1)
            max_number = int(answer * 1.5)
            debug(f'\tNew max number: {max_number}', 0)
        multiple_choice = []
        multiple_choice.append(answer)
        for i in range(number_of_values-1):  # -1 to Compensate for answer being added
            random_number = random.randint(min_number, max_number)
            multiple_choice.append(random_number)
            debug(f'\tmultiple-choice answer: {random_number}')

        # Randomise multiple choice answers
        random.shuffle(multiple_choice)
        debug(f'\tShuffled multiple-choice answers: {multiple_choice}', 0)
        return multiple_choice

    def generate_question():
        """
        Generate a mathematical question to meet the criteria:
        
        Operators:
            Add, subtract, multiply, divide
        
        Number range:
            1 to 12
        
        Answer Should:
            Not be below 0
            Be a whole number
        """
        debug('')
        debug('Generating question')
        min_number = 1  # Lowest number to use in maths questions
        max_number = 12  # Highest number to use in maths questions
        # Number of multiple choice answers to provide, including the answer
        number_of_answers = 4

        answer = -1
        operator = module.generate_operator()
        while True:
            num1 = random.randint(min_number, max_number)  # Generate the first number
            num2 = random.randint(min_number, max_number)  # Generate the second number
            debug(f'\tNumbers generated: {num1}, {num2}')
            
            answer = module.calculate_question(num1, num2, operator)

            debug(f'\tQuestion: {num1} {operator} {num2} = {answer}')
            if module.answer_isvalid(answer):
                answer = int(answer)
                break

        multiple_choice_answers = module.generate_answers(
            min_number, max_number, number_of_answers, answer)

        return num1, operator, num2, multiple_choice_answers, answer


# Frontend code
class screen:

    # Print the leaderboard
    def leaderboard():
        print("\n== Leaderboard ==")
        scores = []
        for user in Db_interface.users:
            # 14, Alex
            scores.append((Db_interface.users[user]["highscore"], user))

        # Sort by largest score
        scores = sorted(scores, reverse=True)

        # Length is either number of scores saved, or maximum 5, whichever is smaller
        leaderboard_length = min(len(scores), 5)
        for i in range(leaderboard_length):
            # 1. Jessica: 40
            print_line = ''
            print_line += f'{i+1}. '  # "1. "
            print_line += f'{scores[i][1]}: '  # Extract name from scores list "Jessica: "
            print_line += f'{scores[i][0]}'  # Extract score from scores list "40"
            print(print_line) # Print
        input("[Go back]")

    # Play game
    def game(username, timer, points):
        """
        Username: authenticated players username
        Timer: Seconds to allow the player to choose
        Points: Number of points to award for each correct answer
        """
        debug(f'New game: {timer}s timer, {points} points')
        current_score = 0
        for i in range(10):  # 10 rounds
            question = module.generate_question()
            num1, operator, num2, multiple_choice_answers, answer = question  # Unpack tuple
            
            start_time = time.time()
            
            print_question = ''
            print_question += 'Question: '
            print_question += f'{num1} '

            # Convert mathematical operator placeholder to symbol representation
            if operator == 'add':
                print_question += '+ '
            elif operator == 'subtract':
                print_question += '- '
            elif operator == 'multiply':
                print_question += '× '
            elif operator == 'divide':
                print_question += '÷ '
            
            print_question += f'{num2} '
            
            print_choices = ''
            for choice in multiple_choice_answers:
                print_choices += f'[{choice}] '
            
            print(f'\n{print_question}')
            selected_choice = input(print_choices)
            answer_duration = time.time() - start_time
            
            if answer_duration > timer:
                print('Ran out of time!')
            elif selected_choice == str(answer):
                print(f'Correct answer! +{points} points')
                current_score += points
            else:
                print(f'Incorrect answer. Answer was {answer}')
            print(f'Score: {current_score}')
        
        new_highscore = module.update_highscore(username, current_score)
        if new_highscore:
            print('New highscore!')
        
    # Choose difficulty
    # Pass "username" to keep track of who is authenticated
    def difficulty(username):
        print("\n== Choose level ==")
        print("[0] [1] [2]")
        choice = input()
        if choice == "0":
            timer = None  # timer disabled
            points = 1  # Award 1 point for each correct answer
        elif choice == "1":
            timer = 20  # 20 second timer
            points = 2  # Award 2 points for each correct answer
        elif choice == "2":
            timer = 10  # 10 second timer
            points = 3  # Award 3 points for each correct answer
        screen.game(username, timer, points)  # Start the game
            
        

    def login():
        print("\n== Login ==")
        username = input("Username: ")
        password = input("Password: ")
        choice = input("[Login] [Register]\n")

        if choice == "login":
            # Generate keys for provided credentials and compare against database
            auth_response = Auth.authenticate(username, password)

            # Handle response code
            if auth_response == "success":
                screen.difficulty(username)
            elif auth_response == "invalid_user":
                print("User does not exist")
            elif auth_response == "invalid_password":
                print("Incorrect password")

        elif choice == "register":
            # Generate secure keys and attempt to store
            register_response = Auth.register(username, password)

            # Handle response code
            if register_response == "success":
                print('Registration success!')
                screen.difficulty(username)
            elif register_response == "username_taken":
                print("Username taken")

    def main_menu():
        while True:
            print("\n== Welcome to Maths Hunt ==")
            print("[Play]  [Leaderboard]")
            choice = input()

            if choice == "play":
                screen.login()
            elif choice == "leaderboard":
                screen.leaderboard()

Db_interface.load_db()
screen.main_menu()