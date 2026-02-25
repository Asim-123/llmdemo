import os
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv

# Load .env file from the backend directory
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Also try loading from current directory
    load_dotenv(override=True)

# Get API key from environment variable (check both .env and system env)
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    # Provide helpful error message
    env_file = Path(__file__).parent / ".env"
    error_msg = f"GROQ_API_KEY not found!\n\n"
    error_msg += f"Please do one of the following:\n"
    error_msg += f"1. Create/update {env_file} with: GROQ_API_KEY=your_key_here\n"
    error_msg += f"2. Set environment variable: $env:GROQ_API_KEY='your_key_here' (PowerShell)\n"
    error_msg += f"3. Set environment variable: export GROQ_API_KEY='your_key_here' (Linux/Mac)"
    raise ValueError(error_msg)

client = Groq(api_key=api_key)

CLASSIFICATION_PROMPT = """You are a customer support ticket classifier. Classify the following support conversation into EXACTLY ONE of these five categories:

- Billing: Questions about invoices, charges, payment methods, pricing, or subscription fees
- Refund: Requests to return a product, get money back, dispute a charge, or process a credit
- Account Access: Issues logging in, resetting passwords, locked accounts, or MFA problems
- Cancellation: Requests to cancel a subscription, downgrade a plan, or close an account
- General Inquiry: Anything that doesn't fit the above — feature questions, product info, how-to questions

Rules:
- If the conversation touches multiple categories, choose the PRIMARY intent of the user
- If unsure between Billing and Refund, prefer Refund only if the user explicitly wants money back
- If unsure between Cancellation and Billing, prefer Cancellation only if account closure is the goal
- Respond with ONLY the category name. No explanation. No punctuation. Just one of the five category names exactly as written above.

User message: {user_message}
Bot response: {bot_response}"""

CHATBOT_SYSTEM_PROMPT = """You are a helpful customer support agent for BillingPro, a SaaS billing and subscription management platform. 
Be concise, professional, and empathetic. Help users with billing questions, account issues, refunds, 
cancellations, and general product questions. Keep responses under 3 sentences unless more detail is needed."""

def classify_trace(user_message: str, bot_response: str) -> str:
    """Classify a support conversation using Groq."""
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{
                "role": "user",
                "content": CLASSIFICATION_PROMPT.format(
                    user_message=user_message,
                    bot_response=bot_response
                )
            }],
            max_tokens=50,
            temperature=0.1
        )
        
        category = completion.choices[0].message.content.strip()
        
        # Validate the category
        valid_categories = ["Billing", "Refund", "Account Access", "Cancellation", "General Inquiry"]
        if category not in valid_categories:
            print(f"Invalid category returned: {category}, defaulting to General Inquiry")
            return "General Inquiry"
        
        return category
    except Exception as e:
        print(f"Error classifying trace: {e}")
        return "General Inquiry"

def get_chatbot_response(user_message: str) -> str:
    """Get a response from the chatbot."""
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": CHATBOT_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return completion.choices[0].message.content.strip()
    except Exception as e:
        raise Exception(f"Failed to get chatbot response: {str(e)}")
