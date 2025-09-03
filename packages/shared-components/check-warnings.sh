#!/bin/bash

echo "Running MobileHeader tests to check for act() warnings..."
npm test MobileHeader.test.tsx 2>&1 | grep -C2 "Warning:" || echo "No warnings found!"