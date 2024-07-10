from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import pandas as pd
from scipy import stats
from scipy.stats import norm
import numpy as np

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

    # Calculate the number of games where the player exceeded the point threshold
    
    successes = (recent_games[stat] > threshold).sum()

    # Calculate success rate
    success_rate = successes / lookback

    # Calculate mean points
    mean_points = recent_games[stat].mean()

    # Calculate standard deviation
    std_dev_points = recent_games[stat].std()

    # Calculate 95% confidence interval for the points mean
    confidence_interval = stats.norm.interval(0.95, loc=mean_points, scale=std_dev_points / np.sqrt(threshold))

    # Calculate expected multipliers
    expected_multiplier_over = success_rate * over
    expected_multiplier_under = (1 - success_rate) * under

    
    return {
        "expected_multiplier_over": expected_multiplier_over,
        "expected_multiplier_under": expected_multiplier_under,
        "confidence_interval_lower": confidence_interval[0],
        "confidence_interval_upper": confidence_interval[1],
        "mean_points": mean_points,
    }




