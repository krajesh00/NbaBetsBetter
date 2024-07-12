#!/bin/bash

prefect config set PREFECT_API_URL="http://127.0.0.1:4200/api"
prefect server database reset -y 
export PREFECT_API_SERVICES_FLOW_RUN_NOTIFICATIONS_ENABLED=false
prefect config view --show-sources 

read -p "Do you want to continue running the server? (y/n): " choice
if [[ $choice == "y" ]]; then
    # Rest of your code goes here
    echo "Server is running..."
    prefect server start

else
    echo "Server stopped."
fi

