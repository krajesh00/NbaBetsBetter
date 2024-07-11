from prefect import flow
import requests
from prefect.client.schemas.schedules import IntervalSchedule
from datetime import datetime, timedelta, time


@flow(name="player_log_update")
def player_log_update():
    requests.get("http://localhost:8000/dataupdate")

if __name__ == "__main__":
    today = datetime.today()
    today = today.replace(hour=3, minute=0, second=0, microsecond=0)
    player_log_update.serve(name="flowing", schedule=IntervalSchedule(interval=timedelta(minutes=3), anchor_date = today, timezone="America/Chicago"))




