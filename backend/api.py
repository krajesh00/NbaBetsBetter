from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import pandas as pd
from scipy import stats
from scipy.stats import norm
import numpy as np
from nba_api.stats.endpoints import playergamelogs
import os
from datetime import date
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/players")
async def get_players():
    with open("player_id_map.json") as f:
        return json.load(f)

@app.get("/players/{player_id}/{stat}/{lookback}")
async def get_player_stat(player_id: int, stat: str, lookback: int):
    all_logs = pd.read_csv("all_data_logs.csv")
    player_logs = all_logs[all_logs["PLAYER_ID"] == player_id]
    player_logs = player_logs[[stat, 'GAME_DATE']].to_dict(orient='records')
    player_logs = player_logs[:lookback]
    return player_logs

@app.get("/stats")
async def get_available_stats():
    all_logs = pd.read_csv("all_data_logs.csv")
    columns = list(all_logs.columns)
    columns = columns[10:]
    return {"stats" : columns}

@app.get("/statpredict/{player_id}/{stat}/{lookback}/{threshold}/{over}/{under}")
async def predict_stat(player_id: int, stat: str, lookback: int, threshold: float, over: float, under: float):
    all_logs = pd.read_csv("all_data_logs.csv")
    all_logs = all_logs[all_logs["PLAYER_ID"] == player_id]
    all_logs[stat] = pd.to_numeric(all_logs[stat], errors='coerce')

    # Select the most recent games
    recent_games = all_logs.head(lookback)
    
    n_games = len(recent_games)

    # Calculate the number of games where the player exceeded the point threshold
    
    n_over = (recent_games[stat] > threshold).sum()

    # Calculate success rate
    over_rate = n_over / n_games

    # Calculate mean points
    mean_points = recent_games[stat].mean()

    # Calculate standard deviation
    std_dev_points = recent_games[stat].std()

    # Calculate 95% confidence interval for the points mean
    confidence_interval = stats.norm.interval(0.95, loc=mean_points, scale=std_dev_points / np.sqrt(threshold))

    # Calculate expected multipliers
    expected_multiplier_over = over_rate * over
    expected_multiplier_under = (1 - over_rate) * under
    
    probability_above_breakpoint = 1 - stats.norm.cdf(threshold, loc=mean_points, scale=std_dev_points )
    
    print(probability_above_breakpoint)
    
    return {
        "expected_multiplier_over": expected_multiplier_over,
        "expected_multiplier_under": expected_multiplier_under,
        "confidence_over": over_rate,
        "confidence_under": 1 - over_rate,
        "mean_points": mean_points,
    }

@app.get("/dataupdate")
def dataupdate():
    with open("latest_date.txt") as f:
        latest_date = f.read()
    
    todays_date = date.today()
    current_year = todays_date.year
    current_month = todays_date.month

    if current_month < 6:
        season = str(current_year - 1) + "-" + str(current_year)[2:]
    else:
        season = str(current_year) + "-" + str(current_year + 1)[2:]
    
    latest_date = pd.Timestamp(latest_date)
    next_day = latest_date + pd.Timedelta(days=1)
    
    formatted_date = next_day.strftime('%m/%d/%Y')

    new_logs = playergamelogs.PlayerGameLogs(
        season_nullable=season,
        date_from_nullable = formatted_date                                                     
    ).player_game_logs.get_data_frame()

    if new_logs.shape[0] != 0:
        all_logs = pd.read_csv("all_data_logs.csv")
        new_logs['MATCHUP'] = new_logs.apply(replace_separator, axis=1)

        new_logs['GAME_DATE'] = pd.to_datetime(new_logs['GAME_DATE'])

        new_logs = new_logs.sort_values(by='GAME_DATE', ascending=False)

        latest_date = new_logs['GAME_DATE'].iloc[0]

        os.remove("latest_date.txt")

        with open("latest_date.txt", 'w') as f:
            f.write(str(latest_date))

        all_logs = pd.concat([new_logs, all_logs])

        all_logs.to_csv("all_data_logs.csv", index=False)
    


def replace_separator(row):
    matchup, team = row['MATCHUP'], row['TEAM_ABBREVIATION']
    teams = matchup.split(' vs. ') if ' vs. ' in matchup else matchup.split(' @ ')
    other_team = teams[0] if teams[1] == team else teams[1]
    return other_team



