# Authelia Admin

A web-based administration interface for managing Authelia authentication server.

## Features

- View and manage TOTP configurations
- View TOTP history (replay attack prevention logs)
- Manage banned users and IPs
- Browse and manage LDAP users and groups
- Change user passwords via LDAP

## Configuration

### Environment Variables

- `PORT` - Server port (default: 9093)
- `HOST` - Server host (default: 0.0.0.0)
- `AUTHELIA_CONFIG_PATH` - Path to Authelia configuration file (default: `/config/configuration.yml`)

### Docker

```bash
docker build -t authelia-admin .
docker run -p 9093:9093 \
  -v /path/to/authelia/config:/config \
  -v /path/to/authelia/data:/data \
  authelia-admin
```

### Docker Compose

See `docker-compose.yml` for a complete example with Authelia, LLDAP, and Traefik.

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Requirements

- Node.js 20+
- Access to Authelia's configuration file
- Access to Authelia's SQLite database
- LDAP server (e.g., LLDAP) configured in Authelia

## Security Notes

This application requires administrative access to Authelia's configuration and database. It should be deployed behind proper authentication and only accessible by authorized administrators.