import os, hashlib

user_db = {
    "test": {  # Password: "secure"
        "salt": b"\xab\xbf\xdcl\t\xecm\xcc\xceY0M\xca\x02\xc1,\x1aRk\xa4Q&H\x1c\xd5\xddib\x9c\xfb0\x88",
        "key": b"\x01\x9a+\xe3\xc5\x9c\x1f\xaa;\x94U\xe7\xa50 \x9d\xa7\x06\xfblC\xa8\xdf\x99-\xaf4\xef\xe2\xa2\xf6$",
        "highscore": 0
        }
}

class module():

    # https://nitratine.net/blog/post/how-to-hash-passwords-in-python/
    def hash(password, **kwargs):
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

    def authenticate(username, password):
        if username in user_db:
            # Get correct keys from database
            original_salt = user_db[username]["salt"]
            original_key = user_db[username]["key"]

            # Generate new keys using provided credentials
            original_salt, new_key = module.hash(password, salt=original_salt)

            # Compare new keys to correct keys
            if original_key == new_key:
                return "success"
            else:
                return "invalid_password"
        else:
            return "invalid_user"

    def register(username, password):
        if username in user_db:
            return "username_taken"
        else:
            # Generate secure keys for storage
            salt, key = module.hash(password)

            # Store non-plaintext password
            user_db[username] = {
                "salt": salt,
                "key": key,
                "highscore": 0
            }
            return "success"





class screen:

    def leaderboard():
        print("\n== Leaderboard ==")
        scores = []
        for user in user_db:
            scores.append([user, user_db[user]["highscore"]])

        scores.sort()
        for i in range(0, 5):
            # 1. Jessica: 40
            print(f'{i+=1}. {scores[i][0]}: {scores[i][1]}')
        input("[Go back]")

    # Choose difficulty
    # Pass "username" to keep track of who is authenticated
    def difficulty(username):
        print("\n== Choose difficulty ==")
        choice = input("[Easy] [Normal] [Expert]")

    def login():
        print("\n== Login ==")
        username = input("Username: ")
        password = input("Password: ")
        choice = input("[Login] [Register]\n")

        if choice == "login":
            # Generate keys for provided credentials and compare against database
            auth_response = module.authenticate(username, password)

            # Handle response code
            if auth_response == "success":
                self.difficulty(username)
            elif auth_response == "invalid_user":
                print("User does not exist")
            elif auth_response == "invalid_password":
                print("Incorrect password")

        elif choice == "register":
            # Generate secure keys and attempt to store
            register_response = module.register(username, password)

            # Handle response code
            if register_response == "success":
                screen.difficulty(username)
            elif register_response == "username_taken":
                print("Username taken")

    def main_menu():
        print("\n== Welcome to Maths Hunt ==")
        print("[Play]  [Leaderboard]")
        choice = input()

        if choice == "play":
            screen.login()
        elif choice == "leaderboard":
            screen.leaderboard()

screen.main_menu()