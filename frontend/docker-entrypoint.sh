#!/bin/sh
set -e

# Replace the backend URL placeholder in the nginx configuration
if [ -n "$VITE_API_BASE_URL" ]; then
  # Strip trailing slash if present
  CLEAN_URL=$(echo "$VITE_API_BASE_URL" | sed 's|/$||')
  
  # Ensure Nginx proxy points to the base of the backend server
  # If the URL ends with /api, strip it since Nginx handles the /api pathing
  CLEAN_URL=$(echo "$CLEAN_URL" | sed 's|/api$||')
  
  echo "🔧 Configuring Nginx proxy pass target to: $CLEAN_URL"
  sed -i "s|http://<backend-ec2-ip-or-domain>|$CLEAN_URL|g" /etc/nginx/conf.d/default.conf
else
  echo "⚠️  VITE_API_BASE_URL is not set. Nginx proxy routing to backend may not work correctly."
fi

exec "$@"
