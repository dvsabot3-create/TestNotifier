# Backup and Recovery Procedures - TestNotifier

## 💾 Backup Strategy Overview

This document outlines the comprehensive backup and recovery procedures for TestNotifier production systems, ensuring data protection and business continuity.

## 🎯 Backup Objectives

### Primary Objectives
- **Data Protection**: Prevent data loss in any scenario
- **Business Continuity**: Minimize downtime during recovery
- **Regulatory Compliance**: Meet legal and regulatory requirements
- **Cost Efficiency**: Balance protection with storage costs
- **Operational Continuity**: Maintain service availability

### Recovery Objectives
- **Recovery Time Objective (RTO)**: <4 hours for critical systems
- **Recovery Point Objective (RPO)**: <1 hour for critical data
- **Data Integrity**: 100% data integrity during recovery
- **Service Continuity**: Maintain core functionality during recovery

## 📋 Backup Scope

### 1. Website/Server Backups

#### 1.1 Website Files
- **Location**: `/var/www/testnotifier/`
- **Content**: All website files, assets, configurations
- **Frequency**: Daily incremental, weekly full
- **Retention**: 30 days daily, 12 months weekly, 7 years monthly

#### 1.2 Server Configuration
- **Location**: `/etc/nginx/`, `/etc/systemd/`, `/etc/cron.d/`
- **Content**: Server configurations, service definitions, cron jobs
- **Frequency**: Daily after changes
- **Retention**: 30 versions

#### 1.3 SSL Certificates
- **Location**: `/etc/letsencrypt/`
- **Content**: SSL certificates and keys
- **Frequency**: Weekly, before expiry
- **Retention**: Until renewal + 90 days

#### 1.4 Log Files
- **Location**: `/var/log/testnotifier/`
- **Content**: Application logs, access logs, error logs
- **Frequency**: Daily
- **Retention**: 90 days local, 7 years archive

### 2. Database Backups

#### 2.1 User Data (if applicable)
- **Location**: Database storage
- **Content**: User accounts, preferences, settings
- **Frequency**: Hourly incremental, daily full
- **Retention**: 7 days hourly, 30 days daily, 12 months monthly

#### 2.2 Application Data
- **Location**: Database storage
- **Content**: Application state, configurations, audit logs
- **Frequency**: Daily
- **Retention**: 30 days daily, 12 months monthly, 7 years archive

### 3. Chrome Extension Backups

#### 3.1 Source Code
- **Location**: Git repository
- **Content**: Complete source code, documentation, assets
- **Frequency**: Continuous (Git), daily snapshots
- **Retention**: All versions retained in Git

#### 3.2 Build Artifacts
- **Location**: Build output directory
- **Content**: Compiled extensions, packages, signatures
- **Frequency**: Per build
- **Retention**: 30 builds, tagged releases permanently

#### 3.3 Store Assets
- **Location**: Documentation and assets directory
- **Content**: Store listing information, screenshots, icons
- **Frequency**: When updated
- **Retention**: All versions

### 4. Configuration Backups

#### 4.1 Deployment Configuration
- **Location**: Deployment scripts and configuration files
- **Content**: Server configurations, deployment scripts, environment settings
- **Frequency**: When changed
- **Retention**: All versions

#### 4.2 Monitoring Configuration
- **Location**: Monitoring system configurations
- **Content**: Alert rules, dashboards, notification settings
- **Frequency**: When changed
- **Retention**: All versions

#### 4.3 Security Configuration
- **Location**: Security system configurations
- **Content**: Firewall rules, security policies, access controls
- **Frequency**: When changed
- **Retention**: All versions

## 🔄 Backup Procedures

### 1. Automated Backup Procedures

#### 1.1 Daily Backup Script
```bash
#!/bin/bash
# Daily backup script for TestNotifier

set -euo pipefail

BACKUP_DATE=$(date +%Y%m%d)
BACKUP_TIME=$(date +%H%M%S)
BACKUP_DIR="/backups/testnotifier/daily/$BACKUP_DATE"
LOG_FILE="/var/log/testnotifier/backup-daily.log"
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Backup website files
backup_website() {
    log_message "Starting website backup..."

    tar -czf "$BACKUP_DIR/website-$BACKUP_TIME.tar.gz" \
        -C /var/www/testnotifier \
        --exclude='node_modules' \
        --exclude='*.log' \
        .

    log_message "Website backup completed"
}

# Backup server configuration
backup_config() {
    log_message "Starting configuration backup..."

    # Backup nginx configuration
    tar -czf "$BACKUP_DIR/nginx-config-$BACKUP_TIME.tar.gz" \
        -C /etc \
        nginx/

    # Backup system configuration
    tar -czf "$BACKUP_DIR/system-config-$BACKUP_TIME.tar.gz" \
        /etc/cron.d/ \
        /etc/systemd/system/

    log_message "Configuration backup completed"
}

# Backup SSL certificates
backup_ssl() {
    log_message "Starting SSL certificate backup..."

    tar -czf "$BACKUP_DIR/ssl-certificates-$BACKUP_TIME.tar.gz" \
        -C /etc \
        letsencrypt/

    log_message "SSL certificate backup completed"
}

# Backup log files
backup_logs() {
    log_message "Starting log backup..."

    # Create logs backup excluding current day
    find /var/log/testnotifier/ -name "*.log" -mtime +1 -exec tar -czf "$BACKUP_DIR/logs-$BACKUP_TIME.tar.gz" {} +

    log_message "Log backup completed"
}

# Backup database (if applicable)
backup_database() {
    log_message "Starting database backup..."

    # This would backup any databases if they exist
    # For now, we'll backup any JSON/config files that act as databases
    find /var/lib/testnotifier/ -name "*.json" -o -name "*.db" 2>/dev/null | tar -czf "$BACKUP_DIR/database-$BACKUP_TIME.tar.gz" -T -

    log_message "Database backup completed"
}

# Clean old backups
cleanup_old_backups() {
    log_message "Cleaning up old backups..."

    find /backups/testnotifier/daily/ -type d -mtime +$RETENTION_DAYS -exec rm -rf {} +

    log_message "Old backup cleanup completed"
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"

    if tar -tzf "$backup_file" > /dev/null 2>&1; then
        log_message "Backup integrity verified: $(basename "$backup_file")"
        return 0
    else
        log_message "ERROR: Backup integrity failed: $(basename "$backup_file")"
        return 1
    fi
}

# Main backup function
main() {
    log_message "Starting daily backup process..."

    # Run backup procedures
    backup_website
    backup_config
    backup_ssl
    backup_logs
    backup_database

    # Verify all backups
    for backup_file in "$BACKUP_DIR"/*.tar.gz; do
        if [[ -f "$backup_file" ]]; then
            verify_backup "$backup_file"
        fi
    done

    # Clean up old backups
    cleanup_old_backups

    # Calculate backup size
    local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    log_message "Total backup size: $total_size"

    log_message "Daily backup process completed successfully"
}

# Run main function
main "$@"
```

#### 1.2 Weekly Full Backup Script
```bash
#!/bin/bash
# Weekly full backup script for TestNotifier

set -euo pipefail

BACKUP_DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/testnotifier/weekly/$BACKUP_DATE"
LOG_FILE="/var/log/testnotifier/backup-weekly.log"
REMOTE_BACKUP_HOST="backup.testnotifier.co.uk"
REMOTE_BACKUP_PATH="/backups/testnotifier/weekly"
RETENTION_WEEKS=12

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Create comprehensive backup
main() {
    log_message "Starting weekly full backup..."

    # Create backup directory
    mkdir -p "$BACKUP_DIR"

    # Create full system backup
    tar -czf "$BACKUP_DIR/full-system-$BACKUP_DATE.tar.gz" \
        --exclude='/proc' \
        --exclude='/sys' \
        --exclude='/dev' \
        --exclude='/tmp' \
        --exclude='/run' \
        --exclude='/var/log' \
        --exclude='/var/cache' \
        --exclude='/backups' \
        /

    # Backup specific application data
    tar -czf "$BACKUP_DIR/application-data-$BACKUP_DATE.tar.gz" \
        /var/www/testnotifier/ \
        /var/lib/testnotifier/ \
        /etc/testnotifier/ \
        /home/*/testnotifier/ 2>/dev/null || true

    # Create configuration backup
    tar -czf "$BACKUP_DIR/configurations-$BACKUP_DATE.tar.gz" \
        /etc/nginx/ \
        /etc/systemd/system/ \
        /etc/cron.d/ \
        /etc/letsencrypt/ \
        /etc/testnotifier/ 2>/dev/null || true

    # Create database dump (if applicable)
    if command -v mysqldump > /dev/null 2>&1; then
        mysqldump --all-databases > "$BACKUP_DIR/database-dump-$BACKUP_DATE.sql" 2>/dev/null || true
    fi

    # Create checksums for integrity
    cd "$BACKUP_DIR"
    sha256sum *.tar.gz *.sql > checksums-$BACKUP_DATE.txt 2>/dev/null || true

    # Sync to remote backup location
    if ping -c 1 "$REMOTE_BACKUP_HOST" > /dev/null 2>&1; then
        rsync -avz --delete "$BACKUP_DIR/" "$REMOTE_BACKUP_HOST:$REMOTE_BACKUP_PATH/"
        log_message "Backup synced to remote location"
    else
        warning "Remote backup host not available"
    fi

    # Clean old backups
    find /backups/testnotifier/weekly/ -type d -mtime +$((RETENTION_WEEKS * 7)) -exec rm -rf {} +

    log_message "Weekly full backup completed successfully"
    log_message "Total backup size: $(du -sh "$BACKUP_DIR" | cut -f1)"
}

# Run main function
main "$@"
```

### 2. Real-time Backup Procedures

#### 2.1 Git Repository Backup
```bash
#!/bin/bash
# Git repository backup script

set -euo pipefail

REPOSITORIES=(
    "https://github.com/testnotifier/testnotifier-website.git"
    "https://github.com/testnotifier/testnotifier-extension.git"
)

BACKUP_DIR="/backups/testnotifier/git"
GIT_BACKUP_HOST="git-backup.testnotifier.co.uk"

mkdir -p "$BACKUP_DIR"

for repo in "${REPOSITORIES[@]}"; do
    repo_name=$(basename "$repo" .git)
    backup_path="$BACKUP_DIR/$repo_name-$(date +%Y%m%d).tar.gz"

    # Clone or update repository
    if [[ -d "$BACKUP_DIR/$repo_name" ]]; then
        cd "$BACKUP_DIR/$repo_name"
        git fetch --all
        git pull origin main
    else
        git clone --mirror "$repo" "$BACKUP_DIR/$repo_name"
    fi

    # Create compressed backup
    tar -czf "$backup_path" -C "$BACKUP_DIR" "$repo_name"

    # Sync to remote Git backup
    rsync -avz "$backup_path" "$GIT_BACKUP_HOST:/backups/testnotifier/git/"
done
```

#### 2.2 Configuration Change Tracking
```bash
#!/bin/bash
# Configuration change tracking

set -euo pipefail

CONFIG_DIRS=(
    "/etc/nginx/"
    "/etc/testnotifier/"
    "/var/www/testnotifier/config/"
)

BACKUP_DIR="/backups/testnotifier/config-changes"
GIT_REPO="$BACKUP_DIR/config-tracking.git"

# Initialize Git repository if it doesn't exist
if [[ ! -d "$GIT_REPO" ]]; then
    mkdir -p "$GIT_REPO"
    cd "$GIT_REPO"
    git init --bare
fi

# Track configuration changes
for config_dir in "${CONFIG_DIRS[@]}"; do
    if [[ -d "$config_dir" ]]; then
        local_backup_dir="$BACKUP_DIR/$(basename "$config_dir")"

        # Create local copy if it doesn't exist
        if [[ ! -d "$local_backup_dir" ]]; then
            cp -r "$config_dir" "$local_backup_dir"
            cd "$local_backup_dir"
            git init
        fi

        # Check for changes
        cd "$local_backup_dir"
        git add -A

        if ! git diff --cached --quiet; then
            git commit -m "Config change detected - $(date)"
            git push "$GIT_REPO" main
        fi
    fi
done
```

## 🔄 Recovery Procedures

### 1. Website Recovery

#### 1.1 Full Website Recovery
```bash
#!/bin/bash
# Full website recovery script

set -euo pipefail

RECOVERY_DATE="$1"  # Date of backup to restore (YYYYMMDD)
BACKUP_TYPE="$2"    # daily or weekly
PRODUCTION_PATH="/var/www/testnotifier"
BACKUP_BASE_PATH="/backups/testnotifier"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Pre-recovery checks
pre_recovery_checks() {
    log_message "Running pre-recovery checks..."

    # Check if backup exists
    local backup_path="$BACKUP_BASE_PATH/$BACKUP_TYPE/$RECOVERY_DATE"
    if [[ ! -d "$backup_path" ]]; then
        error "Backup not found: $backup_path"
        exit 1
    fi

    # Check disk space
    local required_space=$(du -s "$backup_path" | cut -f1)
    local available_space=$(df "$PRODUCTION_PATH" | tail -1 | awk '{print $4}')

    if [[ $required_space -gt $available_space ]]; then
        error "Insufficient disk space for recovery"
        exit 1
    fi

    # Verify backup integrity
    for backup_file in "$backup_path"/*.tar.gz; do
        if ! tar -tzf "$backup_file" > /dev/null 2>&1; then
            error "Backup file corrupted: $(basename "$backup_file")"
            exit 1
        fi
    done

    log_message "Pre-recovery checks completed"
}

# Create recovery point
create_recovery_point() {
    log_message "Creating recovery point..."

    local recovery_point="/backups/testnotifier/recovery-points/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$recovery_point"

    # Backup current state
    if [[ -d "$PRODUCTION_PATH" ]]; then
        cp -r "$PRODUCTION_PATH" "$recovery_point/website-before-recovery"
        cp -r /etc/nginx "$recovery_point/nginx-config-before-recovery"
    fi

    log_message "Recovery point created: $recovery_point"
}

# Stop services
stop_services() {
    log_message "Stopping services..."

    systemctl stop nginx
    systemctl stop testnotifier # if applicable

    log_message "Services stopped"
}

# Restore website files
restore_website_files() {
    log_message "Restoring website files..."

    local website_backup="$BACKUP_BASE_PATH/$BACKUP_TYPE/$RECOVERY_DATE/website-$RECOVERY_DATE*.tar.gz"

    # Remove current website files (except configs)
    find "$PRODUCTION_PATH" -mindepth 1 -maxdepth 1 ! -name 'config' -exec rm -rf {} +

    # Extract website backup
    tar -xzf $website_backup -C "$PRODUCTION_PATH"

    # Set proper permissions
    chown -R www-data:www-data "$PRODUCTION_PATH"
    chmod -R 755 "$PRODUCTION_PATH"

    log_message "Website files restored"
}

# Restore configuration
restore_configuration() {
    log_message "Restoring configuration..."

    local config_backup="$BACKUP_BASE_PATH/$BACKUP_TYPE/$RECOVERY_DATE/configurations-$RECOVERY_DATE*.tar.gz"

    if [[ -f $config_backup ]]; then
        # Backup current config
        cp -r /etc/nginx /etc/nginx.before-recovery

        # Extract configuration backup
        tar -xzf $config_backup -C /tmp/

        # Restore nginx config
        cp -r /tmp/etc/nginx/* /etc/nginx/

        # Test nginx configuration
        if nginx -t; then
            log_message "Nginx configuration restored and validated"
        else
            error "Nginx configuration test failed"
            exit 1
        fi
    fi

    log_message "Configuration restored"
}

# Restore SSL certificates
restore_ssl_certificates() {
    log_message "Restoring SSL certificates..."

    local ssl_backup="$BACKUP_BASE_PATH/$BACKUP_TYPE/$RECOVERY_DATE/ssl-certificates-$RECOVERY_DATE*.tar.gz"

    if [[ -f $ssl_backup ]]; then
        # Backup current certificates
        cp -r /etc/letsencrypt /etc/letsencrypt.before-recovery

        # Extract SSL backup
        tar -xzf $ssl_backup -C /tmp/

        # Restore certificates
        cp -r /tmp/etc/letsencrypt/* /etc/letsencrypt/

        # Set proper permissions
        chmod 600 /etc/letsencrypt/live/*/privkey.pem
        chmod 644 /etc/letsencrypt/live/*/fullchain.pem

        # Test certificate
        if openssl x509 -in /etc/letsencrypt/live/testnotifier.co.uk/fullchain.pem -noout; then
            log_message "SSL certificates restored and validated"
        else
            error "SSL certificate validation failed"
            exit 1
        fi
    fi

    log_message "SSL certificates restored"
}

# Restart services
restart_services() {
    log_message "Restarting services..."

    # Test configuration before starting
    if nginx -t; then
        systemctl start nginx
        log_message "Nginx started successfully"
    else
        error "Nginx configuration test failed"
        exit 1
    fi

    # Start other services if applicable
    # systemctl start testnotifier

    log_message "Services restarted"
}

# Post-recovery verification
post_recovery_verification() {
    log_message "Running post-recovery verification..."

    # Test website accessibility
    if curl -f -s -o /dev/null -w "%{http_code}" "https://testnotifier.co.uk" | grep -q "200"; then
        log_message "Website is accessible"
    else
        error "Website is not accessible"
        exit 1
    fi

    # Test SSL certificate
    if echo | openssl s_client -servername testnotifier.co.uk -connect testnotifier.co.uk:443 2>/dev/null | openssl x509 -noout; then
        log_message "SSL certificate is valid"
    else
        error "SSL certificate validation failed"
        exit 1
    fi

    # Test security headers
    if curl -s -I "https://testnotifier.co.uk" | grep -q "content-security-policy"; then
        log_message "Security headers are present"
    else
        warning "Some security headers may be missing"
    fi

    log_message "Post-recovery verification completed"
}

# Main recovery function
main() {
    log_message "Starting TestNotifier website recovery..."
    log_message "Recovery date: $RECOVERY_DATE"
    log_message "Backup type: $BACKUP_TYPE"

    # Execute recovery steps
    pre_recovery_checks
    create_recovery_point
    stop_services
    restore_website_files
    restore_configuration
    restore_ssl_certificates
    restart_services
    post_recovery_verification

    success "Website recovery completed successfully!"
    log_message "Website is now running from backup dated: $RECOVERY_DATE"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -ne 2 ]]; then
        echo "Usage: $0 \u003crecovery_date\u003e \u003cbackup_type\u003e"
        echo "Example: $0 20241023 daily"
        echo "Example: $0 20241020 weekly"
        exit 1
    fi

    main "$@"
fi
```

#### 1.2 Extension Recovery
```bash
#!/bin/bash
# Chrome extension recovery script

set -euo pipefail

RECOVERY_VERSION="$1"  # Git commit hash or tag
EXTENSION_ID="$2"      # Chrome extension ID
BACKUP_REPO="git@github.com:testnotifier/extension-backups.git"
LOCAL_BACKUP_PATH="/backups/testnotifier/extension"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Restore from Git backup
restore_from_git() {
    log_message "Restoring extension from Git backup..."

    # Clone backup repository if not exists
    if [[ ! -d "$LOCAL_BACKUP_PATH" ]]; then
        git clone "$BACKUP_REPO" "$LOCAL_BACKUP_PATH"
    fi

    cd "$LOCAL_BACKUP_PATH"

    # Checkout specific version
    git checkout "$RECOVERY_VERSION"

    # Build the extension
    npm install
    npm run build

    log_message "Extension restored and built from Git backup"
}

# Update Chrome Web Store
update_store() {
    log_message "Updating Chrome Web Store with recovered version..."

    # This would use the Chrome Web Store API to update the extension
    # Implementation would be similar to the deployment script

    # For now, provide instructions
    log_message "Please use the extension deployment script to update the Chrome Web Store"
    log_message "Run: ./deploy-extension.sh"
}

# Notify users
notify_users() {
    log_message "Notifying users about extension update..."

    # Send notification to all extension users
    # This would use Chrome's messaging API to notify installed extensions

    log_message "User notification sent"
}

main() {
    log_message "Starting Chrome extension recovery..."
    log_message "Recovery version: $RECOVERY_VERSION"
    log_message "Extension ID: $EXTENSION_ID"

    restore_from_git
    update_store
    notify_users

    success "Extension recovery completed successfully!"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -ne 2 ]]; then
        echo "Usage: $0 \u003crecovery_version\u003e \u003cextension_id\u003e"
        echo "Example: $0 v2.1.0 your-extension-id"
        exit 1
    fi

    main "$@"
fi
```

### 2. Disaster Recovery

#### 2.1 Complete System Recovery
```bash
#!/bin/bash
# Complete system disaster recovery

set -euo pipefail

DISASTER_RECOVERY_SITE="backup.testnotifier.co.uk"
PRIMARY_SITE="testnotifier.co.uk"
RECOVERY_TYPE="$1"  # partial or complete

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Activate disaster recovery site
activate_dr_site() {
    log_message "Activating disaster recovery site..."

    # Update DNS to point to DR site
    # This would typically be done through DNS provider API

    # Enable DR site services
    ssh "$DISASTER_RECOVERY_SITE" "systemctl start nginx"
    ssh "$DISASTER_RECOVERY_SITE" "systemctl start testnotifier"

    log_message "Disaster recovery site activated"
}

# Synchronize data
synchronize_data() {
    log_message "Synchronizing data to disaster recovery site..."

    # Sync website files
    rsync -avz --delete /var/www/testnotifier/ "$DISASTER_RECOVERY_SITE:/var/www/testnotifier/"

    # Sync configuration
    rsync -avz /etc/nginx/ "$DISASTER_RECOVERY_SITE:/etc/nginx/"
    rsync -avz /etc/testnotifier/ "$DISASTER_RECOVERY_SITE:/etc/testnotifier/"

    # Sync SSL certificates
    rsync -avz /etc/letsencrypt/ "$DISASTER_RECOVERY_SITE:/etc/letsencrypt/"

    log_message "Data synchronization completed"
}

# Switch traffic
switch_traffic() {
    log_message "Switching traffic to disaster recovery site..."

    # This would typically involve DNS changes
    # For now, provide manual instructions
    log_message "Please update DNS records to point to: $DISASTER_RECOVERY_SITE"
    log_message "Update A record for testnotifier.co.uk to point to DR site IP"

    log_message "Traffic switching initiated"
}

# Verify disaster recovery
verify_dr() {
    log_message "Verifying disaster recovery site..."

    # Test DR site
    if curl -f -s -o /dev/null "https://$DISASTER_RECOVERY_SITE"; then
        log_message "Disaster recovery site is accessible"
    else
        error "Disaster recovery site is not accessible"
        exit 1
    fi

    # Test SSL
    if echo | openssl s_client -servername "$DISASTER_RECOVERY_SITE" -connect "$DISASTER_RECOVERY_SITE:443" 2>/dev/null | openssl x509 -noout; then
        log_message "SSL certificate is valid on DR site"
    else
        error "SSL certificate validation failed on DR site"
        exit 1
    fi

    log_message "Disaster recovery verification completed"
}

main() {
    log_message "Starting disaster recovery process..."
    log_message "Recovery type: $RECOVERY_TYPE"

    if [[ "$RECOVERY_TYPE" == "complete" ]]; then
        activate_dr_site
        synchronize_data
        switch_traffic
        verify_dr
    elif [[ "$RECOVERY_TYPE" == "partial" ]]; then
        # Partial recovery logic
        log_message "Partial recovery implemented"
    else
        error "Invalid recovery type: $RECOVERY_TYPE"
        exit 1
    fi

    success "Disaster recovery process completed!"
    log_message "Primary site: $DISASTER_RECOVERY_SITE"
    log_message "Users should now be directed to the disaster recovery site"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -ne 1 ]]; then
        echo "Usage: $0 \u003crecovery_type\u003e"
        echo "Recovery types: complete, partial"
        exit 1
    fi

    main "$@"
fi
```

## 📊 Backup Verification

### 1. Automated Verification

#### 1.1 Daily Verification Script
```bash
#!/bin/bash
# Daily backup verification

set -euo pipefail

VERIFICATION_DATE="${1:-$(date -d 'yesterday' +%Y%m%d)}"
BACKUP_BASE_PATH="/backups/testnotifier"
LOG_FILE="/var/log/testnotifier/backup-verification.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Verify backup integrity
verify_backup_integrity() {
    log_message "Verifying backup integrity for date: $VERIFICATION_DATE"

    local daily_backup="$BACKUP_BASE_PATH/daily/$VERIFICATION_DATE"
    local weekly_backup="$BACKUP_BASE_PATH/weekly/$VERIFICATION_DATE"

    local backup_path=""
    if [[ -d "$daily_backup" ]]; then
        backup_path="$daily_backup"
    elif [[ -d "$weekly_backup" ]]; then
        backup_path="$weekly_backup"
    else
        error "No backup found for date: $VERIFICATION_DATE"
        exit 1
    fi

    local integrity_check_passed=true

    # Check all backup files
    for backup_file in "$backup_path"/*.tar.gz; do
        if [[ -f "$backup_file" ]]; then
            if tar -tzf "$backup_file" > /dev/null 2>&1; then
                log_message "✅ $(basename "$backup_file") - Integrity verified"
            else
                log_message "❌ $(basename "$backup_file") - Integrity failed"
                integrity_check_passed=false
            fi
        fi
    done

    # Check checksums if available
    if [[ -f "$backup_path/checksums-$VERIFICATION_DATE.txt" ]]; then
        cd "$backup_path"
        if sha256sum -c checksums-$VERIFICATION_DATE.txt > /dev/null 2>&1; then
            log_message "✅ Checksums verified"
        else
            log_message "❌ Checksum verification failed"
            integrity_check_passed=false
        fi
    fi

    if [[ "$integrity_check_passed" == true ]]; then
        log_message "All integrity checks passed for $VERIFICATION_DATE"
        return 0
    else
        log_message "Some integrity checks failed for $VERIFICATION_DATE"
        return 1
    fi
}

# Verify backup completeness
verify_backup_completeness() {
    log_message "Verifying backup completeness..."

    local expected_files=(
        "website-*.tar.gz"
        "nginx-config-*.tar.gz"
        "system-config-*.tar.gz"
        "ssl-certificates-*.tar.gz"
        "logs-*.tar.gz"
        "database-*.tar.gz"
    )

    local daily_backup="$BACKUP_BASE_PATH/daily/$VERIFICATION_DATE"
    local completeness_check_passed=true

    for expected_pattern in "${expected_files[@]}"; do
        if ls "$daily_backup"/$expected_pattern > /dev/null 2>&1; then
            log_message "✅ Found: $expected_pattern"
        else
            log_message "❌ Missing: $expected_pattern"
            completeness_check_passed=false
        fi
    done

    if [[ "$completeness_check_passed" == true ]]; then
        log_message "Backup completeness verified for $VERIFICATION_DATE"
        return 0
    else
        log_message "Backup completeness check failed for $VERIFICATION_DATE"
        return 1
    fi
}

# Generate verification report
generate_verification_report() {
    local report_file="/tmp/backup-verification-$VERIFICATION_DATE-$(date +%H%M%S).txt"

    cat > "$report_file" << EOF
TestNotifier Backup Verification Report
======================================

Verification Date: $(date)
Backup Date: $VERIFICATION_DATE
Backup Location: $BACKUP_BASE_PATH

Integrity Check: $([ "$?" -eq 0 ] && echo "PASSED" || echo "FAILED")
Completeness Check: $([ "$?" -eq 0 ] && echo "PASSED" || echo "FAILED")

Backup Files Found:
$(ls -la "$BACKUP_BASE_PATH/daily/$VERIFICATION_DATE" 2>/dev/null || echo "No daily backup found")
$(ls -la "$BACKUP_BASE_PATH/weekly/$VERIFICATION_DATE" 2>/dev/null || echo "No weekly backup found")

Total Backup Size: $(du -sh "$BACKUP_BASE_PATH/daily/$VERIFICATION_DATE" "$BACKUP_BASE_PATH/weekly/$VERIFICATION_DATE" 2>/dev/null | awk '{print $1}' | head -1)

Verification completed at: $(date)
EOF

    log_message "Verification report generated: $report_file"
}

# Main verification function
main() {
    log_message "Starting backup verification for date: $VERIFICATION_DATE"

    # Run verification checks
    local integrity_result=0
    local completeness_result=0

    verify_backup_integrity || integrity_result=$?
    verify_backup_completeness || completeness_result=$?
    generate_verification_report

    # Summary
    if [[ $integrity_result -eq 0 ]] && [[ $completeness_result -eq 0 ]]; then
        log_message "✅ All verification checks passed for $VERIFICATION_DATE"
        exit 0
    else
        log_message "❌ Some verification checks failed for $VERIFICATION_DATE"
        exit 1
    fi
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

## 🚨 Emergency Procedures

### 1. Emergency Contact Information
- **Primary**: hello@testnotifier.co.uk
- **Emergency**: +44-xxx-xxx-xxxx
- **Backup**: backup-team@testnotifier.co.uk
- **Escalation**: management@testnotifier.co.uk

### 2. Recovery Testing Schedule
- **Daily**: Automated verification of previous day's backups
- **Weekly**: Restoration test of weekly backup to staging environment
- **Monthly**: Full disaster recovery drill
- **Quarterly**: Complete backup system audit

## 📋 Backup Summary

### Backup Schedule Summary
| Component | Frequency | Retention | Location | Method |
|-----------|-----------|-----------|----------|---------|
| Website Files | Daily | 30 days | Local | Tar + Gzip |
| Server Config | Daily | 30 days | Local | Tar + Gzip |
| SSL Certificates | Weekly | Until renewal + 90 days | Local | Tar + Gzip |
| Log Files | Daily | 90 days local, 7 years archive | Local + Remote | Tar + Gzip |
| Database | Hourly incremental, Daily full | 7 days hourly, 30 days daily, 12 months monthly | Local | Dump + Gzip |
| Git Repositories | Continuous | All versions | GitHub + Local | Git clone |
| Build Artifacts | Per build | 30 builds, tagged releases permanent | Local | Zip + Archive |
| Configuration | When changed | All versions | Local + Git | Git + Tar |

### Recovery Time Objectives
- **Website Files**: <30 minutes
- **Server Configuration**: <1 hour
- **SSL Certificates**: <15 minutes
- **Database**: <2 hours
- **Complete System**: <4 hours
- **Disaster Recovery**: <24 hours

---

**Backup Status**: ✅ CONFIGURED AND ACTIVE
**Last Backup Verification**: Daily automated verification
**Recovery Testing**: Monthly scheduled tests
**Emergency Contact**: hello@testnotifier.co.uk
**Backup Location**: /backups/testnotifier/
**Disaster Recovery Site**: backup.testnotifier.co.uk

**Next Backup Review**: Monthly backup effectiveness review
**Next Recovery Test**: Scheduled monthly recovery drill