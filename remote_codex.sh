#!/bin/zsh
set -e

# Ensure running in script directory
SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

# Set up variables
AGENT_SESSION="codex"
SERVER_SESSION="server"
AGENT_CMD="codex"
SERVER_CMD="$SCRIPT_DIR/.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000"

# Check if sessions running already
if tmux has-session -t $AGENT_SESSION 2>/dev/null; then
	echo "Session '"$AGENT_SESSION"' already running. \nRun tmux kill-session -t "$AGENT_SESSION""
	exit 1;
fi

if tmux has-session -t $SERVER_SESSION 2>/dev/null; then
	echo "Session '"$SERVER_SESSION"' already running. \nRun tmux kill-session -t "$SERVER_SESSION""
	exit 1;
fi

echo "Starting new session"
echo "To connect from a Mac terminal use: tmux attach -t SESSION_NAME" 
echo "To kill: Ctrl-C then tmux kill-session -t SESSION_NAME"
echo "Point phone browser to: http://your-mac-tailscale-name:8000"

# Create new, detached tmux session running codex
# Caffeinate to keep alive
tmux new -d -s "$AGENT_SESSION" "caffeinate -i $AGENT_CMD"

# Create another detached tmux session and serve FastAPI server and mini front-end within it
tmux new -d -s "$SERVER_SESSION" "caffeinate -i $SERVER_CMD" 

# Show running tmux processes
tmux ls

echo "Server running at http://localhost:8000/"
