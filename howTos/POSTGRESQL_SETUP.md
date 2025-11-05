# PostgreSQL Setup Guide

This guide helps you set up PostgreSQL database for Ice Water Fire game.

## 📦 Installation

### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### macOS

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15
```

### Windows

Download and install from: https://www.postgresql.org/download/windows/

## 🔐 Initial Configuration

### 1. Access PostgreSQL

```bash
# Switch to postgres user
sudo -i -u postgres

# Access PostgreSQL prompt
psql
```

### 2. Create Database and User

```sql
-- Create database
CREATE DATABASE iwf_game;

-- Create user with password
CREATE USER iwf_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE iwf_game TO iwf_user;

-- Grant schema privileges (PostgreSQL 15+)
\c iwf_game
GRANT ALL ON SCHEMA public TO iwf_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO iwf_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO iwf_user;

-- Exit
\q
exit
```

### 3. Run Database Schema

```bash
# Navigate to backend directory
cd backend

# Run initialization script
psql -U iwf_user -d iwf_game -f src/db/init.sql
```

## 🌐 Remote Access Configuration

### 1. Edit PostgreSQL Configuration

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf
```

Find and change:
```conf
listen_addresses = '*'  # or your specific IP
```

### 2. Edit pg_hba.conf

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

Add at the end:
```conf
# Allow connections from your app server
host    iwf_game    iwf_user    YOUR_APP_SERVER_IP/32    md5
```

### 3. Restart PostgreSQL

```bash
sudo systemctl restart postgresql
```

### 4. Configure Firewall

```bash
# Ubuntu/Debian
sudo ufw allow 5432/tcp

# Or allow from specific IP only
sudo ufw allow from YOUR_APP_SERVER_IP to any port 5432
```

## 📊 Database Connection String

Update your backend `.env` file:

```env
DATABASE_URL=postgresql://iwf_user:your_secure_password_here@localhost:5432/iwf_game
```

For remote connection:
```env
DATABASE_URL=postgresql://iwf_user:your_secure_password_here@your_db_server_ip:5432/iwf_game
```

## 🔍 Verify Setup

### Test Connection

```bash
# From backend directory
cd backend

# Install dependencies if not already
npm install

# Test database connection
node -e "const db = require('./dist/db/connection').default; db.testConnection().then(() => process.exit(0));"
```

### Check Tables

```bash
psql -U iwf_user -d iwf_game
```

```sql
-- List tables
\dt

-- Check leaderboard table
SELECT * FROM leaderboard LIMIT 5;

-- Exit
\q
```

## 🛠️ Useful Commands

### PostgreSQL Service

```bash
# Start
sudo systemctl start postgresql

# Stop
sudo systemctl stop postgresql

# Restart
sudo systemctl restart postgresql

# Status
sudo systemctl status postgresql
```

### Database Management

```bash
# Backup database
pg_dump -U iwf_user iwf_game > backup_$(date +%Y%m%d).sql

# Restore database
psql -U iwf_user iwf_game < backup_20231201.sql

# Drop and recreate database (CAUTION!)
psql -U postgres
DROP DATABASE iwf_game;
CREATE DATABASE iwf_game;
GRANT ALL PRIVILEGES ON DATABASE iwf_game TO iwf_user;
\q

# Run init script again
psql -U iwf_user -d iwf_game -f backend/src/db/init.sql
```

### Monitoring

```bash
# Show active connections
psql -U postgres -c "SELECT * FROM pg_stat_activity WHERE datname='iwf_game';"

# Show database size
psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('iwf_game'));"

# Show table sizes
psql -U iwf_user -d iwf_game -c "
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

## 🔒 Security Best Practices

1. **Strong Password**: Use a strong, unique password for `iwf_user`
2. **Firewall**: Only allow connections from trusted IPs
3. **SSL/TLS**: Enable SSL for production:
   ```conf
   # In postgresql.conf
   ssl = on
   ssl_cert_file = '/path/to/server.crt'
   ssl_key_file = '/path/to/server.key'
   ```
4. **Regular Backups**: Set up automated backups
5. **Update Regularly**: Keep PostgreSQL updated

## 🐛 Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check listening ports
sudo netstat -plnt | grep 5432

# Check logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Permission Denied

```bash
# Grant all privileges again
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE iwf_game TO iwf_user;
\c iwf_game
GRANT ALL ON SCHEMA public TO iwf_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO iwf_user;
\q
```

### Peer Authentication Failed

Edit pg_hba.conf and change:
```conf
# FROM
local   all             all                                     peer

# TO
local   all             all                                     md5
```

Then restart PostgreSQL.

## 📚 Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Kysely Documentation](https://kysely.dev/)

## ⚠️ Production Notes

For production deployment:

1. Use a managed PostgreSQL service (AWS RDS, DigitalOcean Managed Database, etc.)
2. Enable automatic backups
3. Set up monitoring and alerts
4. Use connection pooling (PgBouncer)
5. Enable SSL/TLS
6. Implement regular vacuum and analyze
7. Set up replication for high availability

## 🆘 Support

If you encounter issues:
1. Check PostgreSQL logs: `/var/log/postgresql/`
2. Verify connection string in `.env`
3. Ensure firewall rules are correct
4. Test connection using `psql` directly

