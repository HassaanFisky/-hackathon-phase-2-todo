import re
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def parse_intent(text: str) -> Dict[str, Any]:
    """
    Parses unstructured text into a structured intent object.
    Uses regex and rule-based logic. No external APIs.
    """
    normalized_text = text.lower().strip()
    
    # default values
    priority = "medium"
    category = "general"
    due_date: Optional[datetime] = None
    
    # 1. Extract Priority
    if re.search(r'\b(urgent|asap|now|important|cricital)\b', normalized_text):
        priority = "high"
    elif re.search(r'\b(later|someday|maybe|low)\b', normalized_text):
        priority = "low"
        
    # 2. Extract Category (Heuristic)
    if re.search(r'\b(buy|order|get|purchase|shop)\b', normalized_text):
        category = "shopping"
    elif re.search(r'\b(call|email|message|text|contact|meet)\b', normalized_text):
        category = "communication"
    elif re.search(r'\b(fix|debug|code|deploy|test|review)\b', normalized_text):
        category = "work"
    elif re.search(r'\b(clean|wash|cook|repair|home)\b', normalized_text):
        category = "home"

    # 3. Extract Due Date (Simple Relative Parsing)
    today = datetime.now()
    
    if "tomorrow" in normalized_text:
        due_date = today + timedelta(days=1)
    elif "next week" in normalized_text:
        due_date = today + timedelta(days=7)
    elif "today" in normalized_text:
        due_date = today
    
    # "in X days" pattern
    days_match = re.search(r'\bin (\d+) days?\b', normalized_text)
    if days_match:
        days = int(days_match.group(1))
        due_date = today + timedelta(days=days)
        
    return {
        "original_text": text,
        "title": text, # In future, extract title vs description
        "priority": priority,
        "category": category,
        "due_date": due_date.isoformat() if due_date else None,
        "is_parsed": True
    }
