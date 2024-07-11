FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY all_data_logs.csv /app/

COPY player_id_map.json /app/

COPY api.py /app/

EXPOSE 8000




