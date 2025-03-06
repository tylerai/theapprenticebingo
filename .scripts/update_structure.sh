#!/bin/bash

# Create the .scripts directory if it doesn't exist
mkdir -p .scripts

# Create or update the STRUCTURE.md file
echo "# Project Structure

\`\`\`
$(tree -I 'node_modules|.git|.next|.vercel|.env*' --dirsfirst)
\`\`\`" > STRUCTURE.md

# Make the script executable
chmod +x .scripts/update_structure.sh 