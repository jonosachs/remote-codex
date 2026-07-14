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

magic_dns="$(tailscale status --json 2>/dev/null | jq -r '.Self.DNSName // "" | rtrimstr(".")' 2>/dev/null)"
magic_dns="${magic_dns:-your-mac-tailscale-name}"

echo "---------------------------------------------------------------"
echo "Starting remote codex.."
echo "- Attach a Mac terminal: tmux attach -t SESSION_NAME" 
echo "- Kill specific session: tmux kill-session -t SESSION_NAME"
echo "- Kill all: tmux kill-server"
echo "- Point phone browser to: http://${magic_dns}:8000"
echo "- Server running locally at http://localhost:8000/"
echo "---------------------------------------------------------------"
# Create new, detached tmux session running codex
# x, y sized for Iphone
# caffeinate keeps session alive
tmux new -d -x 46 -y 32 -s "$AGENT_SESSION" "caffeinate -i $AGENT_CMD"

# Create another detached tmux session and serve FastAPI server and mini front-end within it
tmux new -d -s "$SERVER_SESSION" "caffeinate -i $SERVER_CMD" 

# Show running tmux processes
echo "Running sessions:"
tmux ls

