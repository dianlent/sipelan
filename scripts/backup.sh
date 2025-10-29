#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/var/backups/sipelan"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="sipelan_production"
DB_USER="sipelan_user"
RETENTION_DAYS=7

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

echo "Starting database backup..."
echo "Timestamp: $DATE"

# Backup database
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Database backup created: db_backup_$DATE.sql.gz"
    
    # Get backup size
    SIZE=$(du -h $BACKUP_DIR/db_backup_$DATE.sql.gz | cut -f1)
    echo "📦 Backup size: $SIZE"
else
    echo "❌ Database backup failed!"
    exit 1
fi

# Remove old backups (keep only last N days)
echo "Cleaning old backups (keeping last $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 $BACKUP_DIR/db_backup_*.sql.gz 2>/dev/null | wc -l)
echo "📊 Total backups: $BACKUP_COUNT"

echo "✅ Backup process completed successfully!"
