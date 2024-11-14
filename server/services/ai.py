ai_names = ['ai_easy', 'ai_medium', 'ai_hard']

def is_ai(username: str) -> bool:
    return username in ai_names