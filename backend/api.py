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
    
    n_games = len(recent_games)
    
    #---Bernoulli Distribution---#

    # Calculate the number of games where the player exceeded the point threshold
    
    n_over = (recent_games[stat] > threshold).sum()

    # Calculate success rate
    b_confidence_over = n_over / n_games
    b_confidence_under = 1 - b_confidence_over
    
    # Calculate expected multipliers
    b_expected_multiplier_over = b_confidence_over * over
    b_expected_multiplier_under = b_confidence_under * under

    #---Normal Distribution---#
    
    # Calculate mean points
    mean_points = recent_games[stat].mean()

    # Calculate standard deviation
    std_dev_points = recent_games[stat].std()
    
    n_confidence_under = stats.norm.cdf(threshold, loc=mean_points, scale=std_dev_points )
    n_confidence_over = 1 - n_confidence_under
    
    n_expected_multiplier_under = n_confidence_under * under
    n_expected_multiplier_over = n_confidence_over * over
    
    
    print(n_confidence_over)
    
    return {
        "b_expected_multiplier_over": b_expected_multiplier_over,
        "b_expected_multiplier_under": b_expected_multiplier_under,
        "b_confidence_over": b_confidence_over,
        "b_confidence_under": b_confidence_under,
        "n_expected_multiplier_over": n_expected_multiplier_over,
        "n_expected_multiplier_under": n_expected_multiplier_under,
        "n_confidence_over": n_confidence_over,
        "n_confidence_under": n_confidence_under,
        "mean_points": mean_points,
        "std_dev_points": std_dev_points,
        "n_games": n_games,
    }




