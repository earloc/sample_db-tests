set -e
echo "[SETUP] initializing database"

npx prisma migrate dev --skip-generate