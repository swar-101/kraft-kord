import random

progressions = {
    "C": [["C", "F", "G", "C"], ["C", "Am", "F", "G"]],
    "G": [["G", "C", "D", "G"], ["G", "Em", "C", "D"]],
}

def generate_progression(key, length=4):
    prog = random.choice(progressions[key])
    return prog[:length]

print(generate_progression("C"))
print(generate_progression("G"))