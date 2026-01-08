#!/usr/bin/env bash
set -euo pipefail

BACK_DIR=/workspaces/workspace-tienda/back
FRONT_DIR=/workspaces/workspace-tienda/front

cd "$BACK_DIR"
npm run start:dev > /tmp/nest-dev.log 2>&1 &
NEST_PID=$!

echo "Started NestJS for devcontainer (PID $NEST_PID); logs: /tmp/nest-dev.log"

cd "$FRONT_DIR"
npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/vite-dev.log 2>&1 &
VITE_PID=$!

echo "Started Vite dev server (PID $VITE_PID); logs: /tmp/vite-dev.log"
