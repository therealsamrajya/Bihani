#!/bin/sh
# Common script for Husky hooks

# Stop execution if any command fails
set -e

# Check if `pnpm` is installed
if ! command -v pnpm &> /dev/null; then
  echo "⚠️ pnpm is not installed! Please install it before committing."
  exit 1
fi

# Function to print a message in a formatted way
log_info() {
  echo "ℹ️  $1"
}

log_info "Husky common script loaded."
