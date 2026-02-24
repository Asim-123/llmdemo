from datetime import datetime, timedelta
from models import Trace, CategoryEnum
import random

def get_seed_traces():
    """Returns a list of pre-classified seed traces."""
    
    # Base timestamp (7 days ago)
    now = datetime.utcnow()
    
    seed_data = [
        # Billing (4 traces)
        {
            "user_message": "Why was I charged twice this month?",
            "bot_response": "I apologize for the confusion. Let me check your billing history right away to investigate the duplicate charge.",
            "category": CategoryEnum.BILLING,
            "response_time_ms": 1250,
            "timestamp": now - timedelta(days=6, hours=3)
        },
        {
            "user_message": "Can you explain the $49 charge on my invoice?",
            "bot_response": "That's your monthly Pro plan subscription fee. It includes unlimited users and advanced analytics features.",
            "category": CategoryEnum.BILLING,
            "response_time_ms": 890,
            "timestamp": now - timedelta(days=5, hours=8)
        },
        {
            "user_message": "I need to update my credit card information",
            "bot_response": "You can update your payment method in Account Settings > Billing. I can also send you a direct link if that helps.",
            "category": CategoryEnum.BILLING,
            "response_time_ms": 1120,
            "timestamp": now - timedelta(days=4, hours=12)
        },
        {
            "user_message": "What payment methods do you accept?",
            "bot_response": "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and ACH bank transfers for annual plans.",
            "category": CategoryEnum.BILLING,
            "response_time_ms": 670,
            "timestamp": now - timedelta(days=2, hours=5)
        },
        
        # Refund (4 traces)
        {
            "user_message": "I want a refund for last month's charge",
            "bot_response": "I understand you'd like a refund. Can you tell me more about what happened? We have a 30-day money-back guarantee.",
            "category": CategoryEnum.REFUND,
            "response_time_ms": 1450,
            "timestamp": now - timedelta(days=6, hours=15)
        },
        {
            "user_message": "How do I dispute this charge?",
            "bot_response": "I can help you with that dispute. Let me pull up your account and we'll get this sorted out right away.",
            "category": CategoryEnum.REFUND,
            "response_time_ms": 980,
            "timestamp": now - timedelta(days=5, hours=2)
        },
        {
            "user_message": "Can I get my money back? The service didn't work as expected",
            "bot_response": "I'm sorry to hear that. Yes, we can process a refund for you within our 30-day guarantee period.",
            "category": CategoryEnum.REFUND,
            "response_time_ms": 1340,
            "timestamp": now - timedelta(days=3, hours=9)
        },
        {
            "user_message": "I was charged but never used the service",
            "bot_response": "I apologize for that experience. Let me issue a full refund for you immediately.",
            "category": CategoryEnum.REFUND,
            "response_time_ms": 1180,
            "timestamp": now - timedelta(days=1, hours=14)
        },
        
        # Account Access (4 traces)
        {
            "user_message": "I can't log into my account",
            "bot_response": "I can help you regain access. Have you tried using the 'Forgot Password' link on the login page?",
            "category": CategoryEnum.ACCOUNT_ACCESS,
            "response_time_ms": 820,
            "timestamp": now - timedelta(days=6, hours=22)
        },
        {
            "user_message": "My password reset link isn't working",
            "bot_response": "Those links expire after 1 hour for security. I'll send you a fresh password reset link right now.",
            "category": CategoryEnum.ACCOUNT_ACCESS,
            "response_time_ms": 1050,
            "timestamp": now - timedelta(days=5, hours=18)
        },
        {
            "user_message": "Account is locked after too many login attempts",
            "bot_response": "For security, accounts lock after 5 failed attempts. I can unlock it for you immediately after verifying your identity.",
            "category": CategoryEnum.ACCOUNT_ACCESS,
            "response_time_ms": 1420,
            "timestamp": now - timedelta(days=4, hours=6)
        },
        {
            "user_message": "Two-factor authentication code not working",
            "bot_response": "Make sure your device's time is synced correctly. If the issue persists, I can temporarily disable 2FA so you can log in.",
            "category": CategoryEnum.ACCOUNT_ACCESS,
            "response_time_ms": 1580,
            "timestamp": now - timedelta(days=2, hours=20)
        },
        
        # Cancellation (4 traces)
        {
            "user_message": "I want to cancel my subscription",
            "bot_response": "I'm sorry to see you go. You can cancel anytime in Account Settings, and you'll have access until the end of your billing period.",
            "category": CategoryEnum.CANCELLATION,
            "response_time_ms": 1150,
            "timestamp": now - timedelta(days=6, hours=10)
        },
        {
            "user_message": "How do I downgrade my plan?",
            "bot_response": "You can downgrade to a lower plan in Account Settings > Subscription. The change will take effect at your next billing cycle.",
            "category": CategoryEnum.CANCELLATION,
            "response_time_ms": 920,
            "timestamp": now - timedelta(days=5, hours=13)
        },
        {
            "user_message": "Please close my account permanently",
            "bot_response": "I can help you close your account. Just to confirm, this will delete all your data permanently. Would you like to proceed?",
            "category": CategoryEnum.CANCELLATION,
            "response_time_ms": 1280,
            "timestamp": now - timedelta(days=3, hours=16)
        },
        {
            "user_message": "Cancel my plan immediately",
            "bot_response": "I've processed your cancellation request. Your access will continue until the end of your current billing period on March 15th.",
            "category": CategoryEnum.CANCELLATION,
            "response_time_ms": 1090,
            "timestamp": now - timedelta(days=1, hours=8)
        },
        
        # General Inquiry (5 traces)
        {
            "user_message": "What features are included in the Pro plan?",
            "bot_response": "The Pro plan includes unlimited users, advanced analytics, custom branding, priority support, and API access.",
            "category": CategoryEnum.GENERAL_INQUIRY,
            "response_time_ms": 740,
            "timestamp": now - timedelta(days=6, hours=19)
        },
        {
            "user_message": "How do I export my data?",
            "bot_response": "You can export data from the Reports section. Click 'Export' and choose CSV or JSON format.",
            "category": CategoryEnum.GENERAL_INQUIRY,
            "response_time_ms": 650,
            "timestamp": now - timedelta(days=5, hours=11)
        },
        {
            "user_message": "Do you have an API for integrations?",
            "bot_response": "Yes! Our REST API is available on Pro and Enterprise plans. Full documentation is at docs.billingpro.com/api.",
            "category": CategoryEnum.GENERAL_INQUIRY,
            "response_time_ms": 880,
            "timestamp": now - timedelta(days=4, hours=21)
        },
        {
            "user_message": "Can I add more team members?",
            "bot_response": "Absolutely! Go to Team Settings and click 'Invite Member'. Pro plans have unlimited team members.",
            "category": CategoryEnum.GENERAL_INQUIRY,
            "response_time_ms": 790,
            "timestamp": now - timedelta(days=3, hours=4)
        },
        {
            "user_message": "Is there a mobile app available?",
            "bot_response": "Yes, we have mobile apps for iOS and Android. You can download them from the App Store or Google Play.",
            "category": CategoryEnum.GENERAL_INQUIRY,
            "response_time_ms": 710,
            "timestamp": now - timedelta(days=1, hours=17)
        },
    ]
    
    traces = []
    for data in seed_data:
        trace = Trace(
            user_message=data["user_message"],
            bot_response=data["bot_response"],
            category=data["category"],
            response_time_ms=data["response_time_ms"],
            timestamp=data["timestamp"]
        )
        traces.append(trace)
    
    return traces

def seed_database(db):
    """Seed the database with initial traces if empty."""
    existing_count = db.query(Trace).count()
    
    if existing_count == 0:
        print("Seeding database with initial traces...")
        traces = get_seed_traces()
        db.add_all(traces)
        db.commit()
        print(f"Added {len(traces)} seed traces to database")
    else:
        print(f"Database already contains {existing_count} traces, skipping seed")
