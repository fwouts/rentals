#!/bin/sh

set -e

echo "Prettifying code..."
prettier --write **/*.ts **/*.tsx
echo "Precommit for client package..."
cd client
yarn precommit
cd -
echo "Precommit for server package..."
cd server
yarn precommit
cd -
echo "Ready to commit!"
