#!/bin/bash
echo "🎯 Hook executed at $(date)" >&2
echo "Arguments: $@" >&2
echo "Environment:" >&2
env | grep CLAUDE >&2