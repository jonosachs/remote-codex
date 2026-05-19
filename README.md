
# Remote codex session

Run a remote codex session from your IPhone. \
Uses `caffeinate -i` to keep connection alive (prevents Mac from sleeping while connected to power) 

## Screenshot 

<img src="screenshot.png" width="254" height="539" />

## Requirements

- Tailscale account with phone and computer connected to the same tailnet `https://tailscale.com/`

## Instructions

1. Activate virtual environment:
    - `python -m venv .venv`
    - `source .venv/bin/activate`

2. Install dependencies:
    - `pip install -r requirements`

3. In the project root run: 
    - `zsh remote_codex.sh`

This will setup 2 detached tmux sessions: 
- `codex`: session running codex 
- `server`: session running uvicorn, serving a small API and front-end UI on port 8000

4. Point your IPhone to web url: `http://your-mac-tailscale-name:8000`

That's it!

## Tips

- To grab the Tailscale address (MagicDNS) open the Tailscale app on your phone and click on your connected machine. 
- Connect computer terminal to running tmux sessions with `tmux attach -t SESSION_NAME`
- To kill sessions use: `Ctrl-C` on attached session or `tmux kill-session -t SESSION_NAME`
- On IPhone click `Add to Home Screen` on the web url for easy access in a dedicated browser session
