#!/bin/bash

echo "Starting DB Container"
(/opt/mssql/bin/sqlservr & ) | grep -q "Service Broker manager has started"

# Keep a process running to prevent the container from stopping
echo "Keep a process running to prevent the container from stopping"
tail -f /dev/null
