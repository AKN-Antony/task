from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

@shared_task
def execute_automation_rules():
    """
    Evaluates TIME-based AutomationRules and triggers actions if conditions are met.
    This should be run periodically by Celery Beat (e.g., every minute).
    """
    logger.info("Executing time-based automation rules...")
    # Implementation logic to evaluate cron_expression and trigger actions goes here.
    pass

@shared_task
def auto_archive_completed_tasks():
    """
    Archives tasks that have been in DONE status for more than 30 days.
    """
    from tasks.models import Task, TaskStatus
    thirty_days_ago = timezone.now() - timedelta(days=30)
    tasks_to_archive = Task.objects.filter(
        status=TaskStatus.DONE, 
        updated_at__lte=thirty_days_ago
    )
    count = tasks_to_archive.update(status=TaskStatus.ARCHIVED)
    logger.info(f"Auto-archived {count} tasks.")

@shared_task
def send_daily_digests():
    """
    Sends a daily summary of open and overdue tasks to users.
    """
    logger.info("Generating and sending daily digests...")
    # Implementation logic for daily digest goes here.
    pass

@shared_task
def generate_weekly_reports():
    """
    Generates and stores a weekly productivity report for teams.
    """
    logger.info("Generating weekly reports...")
    # Implementation logic for weekly reports goes here.
    pass
