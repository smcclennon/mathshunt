# Maths Hunt
This repository contains proof of concept Python code for a childrens math game.

View source code [here](maths_hunt.py).

## Overview of features:
- Generates random math questions
- Generates 4 realistic multiple choice options
- Answers are always whole, non-negative numbers
- 3 levels of difficulty with time limits
- "Secure" registration and login system
- Leaderboard system with persistent score storage

## User interface
Maths Hunt is intended to be a mobile app with a graphical user interface (GUI). This Python implementation was created as a proof of concept for the backend code and modules. Because of this, it does not contain a GUI, instead opting for a basic command line interface (CLI) used mostly for debugging purposes.

The CLI uses square brackets as a placeholder for representing where an interactive/pressable button would be present within the GUI of the mobile app (Example: `[button1] [button2]`). The CLI button placeholders do not contain any input validation, as in a real mobile app you wouldn't be able to press a button which does not exist.

## Screenshots
|Registration with available username|Registration with unavailable username|
|-|-|
|![image](https://user-images.githubusercontent.com/24913281/157337884-4b83e20d-581b-4c4d-a07a-5f2c2ac384e6.png)|![image](https://user-images.githubusercontent.com/24913281/157336813-9121f7fe-6dd6-4170-b10d-ce7c6c5b7c94.png)|

|Login with correct username and password|Login with correct username and incorrect password|
|-|-|
|![image](https://user-images.githubusercontent.com/24913281/157336561-33a7bde6-7ef0-4db1-bbdd-cacf45f472f8.png)|![image](https://user-images.githubusercontent.com/24913281/157337254-2209bb78-fab1-44cd-bd83-8443b37e36a7.png)|

|Login with incorrect username|Non whole number answer discarded and question regenerated + question answered within time limit|
|-|-|
|![image](https://user-images.githubusercontent.com/24913281/157337597-df432538-0823-46f7-be18-cb77fd8d9a7a.png)|![image](https://user-images.githubusercontent.com/24913281/157338762-d55a037a-ff3b-4bb1-abd8-b561cc061d10.png)|

|Multiple-choice max number dynamically increased `1.5 x answer` + ran out of time answering, no points awarded|Answered incorrectly, no points awarded|
|-|-|
|![image](https://user-images.githubusercontent.com/24913281/157339096-fea91a1e-0b37-4bc8-84dc-81dab31b6528.png)|![image](https://user-images.githubusercontent.com/24913281/157339241-8f341bb6-f88e-472e-8ef4-a78f6ef39690.png)|

|Negative answer discarded and regenerated twice|Leaderboard entry updated|
|-|-|
|![image](https://user-images.githubusercontent.com/24913281/157339673-be307e48-c551-46d0-89f3-4d25e96ac9c6.png)|![image](https://user-images.githubusercontent.com/24913281/157339967-fa568153-a422-4db7-992e-ea88f2e37536.png)|

|Leaderboard entry not updated|Leaderboard|
|-|-|
|![image](https://user-images.githubusercontent.com/24913281/157340263-9ac7faa1-ab6c-4913-8b5e-80fae8cbe9bb.png)|![image](https://user-images.githubusercontent.com/24913281/157340719-6f6fc986-3bdc-4788-bfa1-1cf1ffe368e6.png)|

<details>
  <summary>Full userdata for the leaderboard screenshot</summary>

```json
{
  "smcclennon": {
    "highscore": 12,
    "salt": "5gffCVeALTKJlfQXn6IJcJZv9A89N95ibBAFlLJYkVs=",
    "key": "Fpg81UuqzXjPL4mWdeer4szZm6Ub173TTb3RLso6JIY="
  },
  "bob": {
    "highscore": 2,
    "salt": "LiN/cqU60tqELC0ZG6nUlmkwWJLGlfxvkOaITkMR7v4=",
    "key": "h+11V71kbv+RA4tU1+ppUpCa6K+CDqQ5rPtZUXesJfs="
  },
  "simon": {
    "highscore": 9,
    "salt": "9QVAFKU3YGUi+2wAYwZn3kJwhIq3Cnnkdbj19tgtoYE=",
    "key": "DnG803Zqafn7ntoz9C04PUIbYRUOogahJpSceKrO5KI="
  },
  "john": {
    "highscore": 4,
    "salt": "bqzlE6nIsjYdm9PtPDr5tXeLuoawZcD630ufjD2zAqc=",
    "key": "IXjs3+WXdQkaZh8UlGWoUD/Ot5greMexkMaHeyzFzzk="
  },
  "tiger": {
    "highscore": 7,
    "salt": "qSKljzlj4beU8EujkFGGbIQtBEVz8TL5ac3KP28e1vk=",
    "key": "XQQzolcOSKqhe+lRYfZLkkhyFgXGnfDmvXRhCfebzSY="
  },
  "snake": {
    "highscore": 10,
    "salt": "Q/KRui3T/GOsVJYpcvQW3VNlUnNeQkk3Q//QO7XA73A=",
    "key": "7BHGNI89Fw4oxPUDGMUcAVlrmaFySRIdHi6cV+aLARc="
  }
}
```
</details>

## Try it yourself
1. To download Maths Hunt, [right click here](https://raw.githubusercontent.com/smcclennon/mathshunt/master/maths_hunt.py) and click "Save link as" or similar. Ensure the file downloads with the file extension `.py` and not `.html`.
2. Run `maths_hunt.py` with Python 3.6+
