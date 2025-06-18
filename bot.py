import logging
import datetime
import gspread
import asyncio
import sys
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler,
    filters, ContextTypes, ConversationHandler, CallbackQueryHandler
)
from oauth2client.service_account import ServiceAccountCredentials
from tabulate import tabulate

# --- CONSTANTS ---
BOT_TOKEN = "8114302792:AAHid9Y0Rv-h41JgX8nfTbibuUwyXRArJ_4"
SHEET_NAME = "contacte"
WORKSHEET_NAME = "Contacte"
JSON_KEYFILE = "botsponsori-93b6d1184b45.json"

# Google API scopes
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
]

# Conversation states
DENUMIRE, TELEFON, EMAIL, DESCRIERE = range(4)

# Emojis for UI
EMOJIS = {
    "welcome": "👋",
    "add": "➕",
    "company": "🏢",
    "phone": "📱",
    "email": "📧",
    "description": "📝",
    "success": "✅",
    "cancel": "❌",
    "date": "⏰",
    "author": "👤",
    "error": "❌",
    "skip": "⏭️",
    "done": "✔️"
}

# --- LOGGING SETUP ---
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# --- GOOGLE SHEETS SETUP ---
def setup_google_sheets():
    try:
        creds = ServiceAccountCredentials.from_json_keyfile_name(JSON_KEYFILE, SCOPES)
        client = gspread.authorize(creds)
        spreadsheet = client.open(SHEET_NAME)
        worksheet = spreadsheet.worksheet(WORKSHEET_NAME)
        logger.info("✅ Google Sheets connection established")
        return worksheet
    except Exception as e:
        logger.error(f"Google Sheets connection error: {str(e)}")
        raise

# --- BOT HANDLERS ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton(
        f"{EMOJIS['add']} Adaugă companie", 
        callback_data="add_company"
    )]]
    await update.message.reply_text(
        f"{EMOJIS['welcome']} *Bun venit!* Folosește butonul de mai jos:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def start_conversation(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    context.user_data.clear()
    await query.edit_message_text(
        f"{EMOJIS['company']} Introdu denumirea companiei:",
        parse_mode="Markdown"
    )
    return DENUMIRE

async def denumire(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["denumire"] = update.message.text
    reply_markup = ReplyKeyboardMarkup(
        [[f"{EMOJIS['skip']} Sari peste"]], 
        one_time_keyboard=True,
        resize_keyboard=True
    )
    await update.message.reply_text(
        f"{EMOJIS['phone']} Introdu numărul de telefon:",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )
    return TELEFON

async def telefon(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message.text.lower() != f"{EMOJIS['skip']} sari peste":
        context.user_data["telefon"] = update.message.text
    else:
        context.user_data["telefon"] = "Nespecificat"
    
    reply_markup = ReplyKeyboardMarkup(
        [[f"{EMOJIS['skip']} Sari peste"]],
        one_time_keyboard=True,
        resize_keyboard=True
    )
    await update.message.reply_text(
        f"{EMOJIS['email']} Introdu adresa de email:",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )
    return EMAIL

async def email(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message.text.lower() != f"{EMOJIS['skip']} sari peste":
        context.user_data["email"] = update.message.text
    else:
        context.user_data["email"] = "Nespecificat"
    
    reply_markup = ReplyKeyboardMarkup(
        [[f"{EMOJIS['skip']} Sari peste"]],
        one_time_keyboard=True,
        resize_keyboard=True
    )
    await update.message.reply_text(
        f"{EMOJIS['description']} Introdu descrierea companiei:",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )
    return DESCRIERE

async def descriere(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message.text.lower() != f"{EMOJIS['skip']} sari peste":
        context.user_data["descriere"] = update.message.text
    else:
        context.user_data["descriere"] = "Nespecificat"
    
    context.user_data["autor"] = f"@{update.effective_user.username or update.effective_user.first_name}"
    context.user_data["data"] = datetime.datetime.now().strftime("%d.%m.%Y %H:%M")
    
    try:
        sheet.append_row([
            context.user_data["denumire"],
            context.user_data["telefon"],
            context.user_data["email"],
            context.user_data["descriere"],
            context.user_data["autor"],
            context.user_data["data"]
        ])
    except Exception as e:
        logger.error(f"Data save error: {e}")
        await update.message.reply_text(
            f"{EMOJIS['error']} Eroare la salvarea datelor!",
            parse_mode="Markdown"
        )
        return ConversationHandler.END
    
    keyboard = [[InlineKeyboardButton(
        f"{EMOJIS['add']} Începe o nouă înregistrare", 
        callback_data="add_company"
    )]]
    await update.message.reply_text(
        f"{EMOJIS['success']} *Înregistrare completă!* Datele au fost salvate.",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f"{EMOJIS['cancel']} Operație anulată.",
        reply_markup=ReplyKeyboardRemove(),
        parse_mode="Markdown"
    )
    context.user_data.clear()
    return ConversationHandler.END

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.error(f"Error: {context.error}")
    if update.effective_message:
        await update.effective_message.reply_text(
            f"{EMOJIS['error']} A apărut o eroare. Te rugăm să încerci din nou.",
            parse_mode="Markdown"
        )

# --- MAIN FUNCTION ---
def main():
    try:
        global sheet
        sheet = setup_google_sheets()
    except Exception as e:
        logger.error(f"Initialization error: {e}")
        return

    # Create and configure application
    application = ApplicationBuilder().token(BOT_TOKEN).build()

    # Conversation handler
    conv_handler = ConversationHandler(
        entry_points=[
            CallbackQueryHandler(start_conversation, pattern="^add_company$"),
            CommandHandler('start', start)
        ],
        states={
            DENUMIRE: [MessageHandler(filters.TEXT & ~filters.COMMAND, denumire)],
            TELEFON: [MessageHandler(filters.TEXT & ~filters.COMMAND, telefon)],
            EMAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, email)],
            DESCRIERE: [MessageHandler(filters.TEXT & ~filters.COMMAND, descriere)]
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        allow_reentry=True
    )

    application.add_handler(conv_handler)
    application.add_error_handler(error_handler)
    
    logger.info("🤖 Bot starting...")
    
    # Run the bot with proper event loop handling
    try:
        application.run_polling()
    except KeyboardInterrupt:
        logger.info("🛑 Bot stopped by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
    finally:
        logger.info("🧹 Cleaning up resources...")

if __name__ == '__main__':
    # Set up proper event loop policy for Windows if needed
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    main()