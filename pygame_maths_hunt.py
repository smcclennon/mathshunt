# Maths Hunt
# smcclennon.github.io

import pygame, time, random

# Globally declare assets to be used throughout the game
assets = {
    "background_image_directory": "img/19872298.jpg",
    "aspect_ratio": {
        "x": 1080,
        "y": 675
    },
    # Convert and store colours as Pygame compatible RGB values instead of incompatible HEX
    # https://stackoverflow.com/questions/53253713
    "colour": {
        "blue": pygame.Color('#0D80C6'),
        "orange": pygame.Color('#EC9235'),
        "pink": pygame.Color('#E40D53'),
        "black": pygame.Color('#000000'),
        "white": pygame.Color('#FFFFFF')
    }
}

def set_language(selected_language):
    # Locally declare languages to be selectively picked
    # when language is chosen
    all_languages = {
        "english": {
            "app_name": "Maths Hunt"
        }
    }
    # Globally declare 'lang'
    global lang
    # Set global language to selected_language
    lang = all_languages[selected_language]


set_language("english")

# Base template: https://www.geeksforgeeks.org/introduction-to-pygame/
# Base template: https://pythonguides.com/python-pygame-tutorial/
pygame.init()
window = pygame.display.set_mode((assets["aspect_ratio"]["x"], assets["aspect_ratio"]["y"]))  # Set app dimensions
pygame.display.set_caption(lang["app_name"])  # Set window title

# Load background image
# Add background image: https://www.askpython.com/python-modules/pygame-looping-background
background_image = pygame.image.load(assets["background_image_directory"])
background_image = pygame.transform.scale(background_image,(assets["aspect_ratio"]["x"], assets["aspect_ratio"]["y"]))

# Game loop
exit_game = False 
while not exit_game:
    # Apply background image
    window.blit(background_image, (0, 0))

    # for loop through the event queue
    for event in pygame.event.get():
        # Check for QUIT event
        if event.type == pygame.QUIT:
            exit_game = True
    
    # Update display
    pygame.display.update()

pygame.display.flip()
