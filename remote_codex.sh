#!/bin/zsh

SESSION="codex"

# Create new, independent tmux session running codex
if tmux has-session -t $SESSION 2>/dev/null; then
	echo "Session '"$SESSION"' already running. \nRun tmux kill-session -t "$SESSION""
	exit 0;
fi

# Start new (detached) session with codex running in it
echo "Starting new session"
echo "To connect from a Mac terminal use: tmux attach -t "$SESSION""
echo "To kill: Ctrl-C then tmux kill-session -t codex"
echo "Point phone browser to: http://your-mac-tailscale-name:7681"

tmux new -d -s $SESSION "caffeinate -i "$SESSION""

# Attach shareable web terminal to tmux (defaults to port 7681)
ttyd -W --client-option fontSize=30 tmux attach -t "$SESSION"
