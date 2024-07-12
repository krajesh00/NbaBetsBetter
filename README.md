# BetBetter

To run this project, ensure you have docker installed.

Then, clone the repository and run the project with the following commands:

```
git clone https://github.com/krajesh00/NbaBetsBetter
cd NbaBetsBetter
docker-compose up
```

To keep your data up to date:
Open a new terminal
Make sure Python version 3.11 is downloaded
```
cd NbaBetsBetter
source .venv/bin/activate
sh startup.sh
```
Then open a new terminal

```
cd dataflow
python log_fill.py
```
