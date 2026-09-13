import logging
import requests

logger = logging.getLogger(__name__)

def send_slack_message(webhook_url, message):
    """
    Integration to send a message to a Slack channel via Webhook.
    """
    try:
        response = requests.post(
            webhook_url,
            json={'text': message},
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()
        logger.info("Successfully sent Slack message.")
    except Exception as e:
        logger.error(f"Failed to send Slack message: {e}")

def sync_google_calendar_event(user, task):
    """
    Placeholder integration to sync a Task due date to a user's Google Calendar.
    Requires OAuth2 token flow which would be handled in the accounts/integrations module.
    """
    logger.info(f"Syncing task {task.title} to {user.email}'s Google Calendar...")
    # OAuth logic and POST to https://www.googleapis.com/calendar/v3/calendars/primary/events
    pass

def trigger_zapier_webhook(zapier_url, payload):
    """
    Sends JSON payload to a Zapier Catch Hook for no-code automation.
    """
    try:
        response = requests.post(zapier_url, json=payload)
        response.raise_for_status()
        logger.info("Successfully triggered Zapier webhook.")
    except Exception as e:
        logger.error(f"Failed to trigger Zapier webhook: {e}")
