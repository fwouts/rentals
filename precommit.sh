#!/bin/sh

set -e

concurrently \
  "cd client ; yarn precommit" \
  "cd server ; yarn precommit"

echo "Ready to commit!"
