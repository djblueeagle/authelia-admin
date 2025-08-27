# Authelia Admin Control Panel

A web-based administration interface for managing Authelia authentication server.

![image](https://raw.githubusercontent.com/asalimonov/authelia-admin/refs/heads/main/public/authelia-admin.gif)

## Features

- View and manage TOTP configurations
- View TOTP history
- Manage banned users and IPs
- Browse LDAP users and groups (LLDAP limitation)
- Change user passwords via LDAP

### Not yet implemented

- Management users via LDAP
- PostgreSQL engine for Authelia
- Browse and management of users in Authelia file provider

## Configuration

### Optional environment variables

- `PORT` - Server port (default: 9093)
- `HOST` - Server host (default: 0.0.0.0)
- `AUTHELIA_CONFIG_PATH` - Path to Authelia configuration file (default: `/config/configuration.yml`)

### Docker

```bash
make build
docker run -p 9093:9093 \
  -v /path/to/authelia/config:/config \
  -v /path/to/authelia/data:/data \
  authelia-admin
```

### Docker Compose

See `docker-compose.yml` for a complete example with Authelia, LLDAP, and Traefik.

### Development

```bash
# Install dependencies and build docker image
make build-dev

# Run Authelia, LLDAP, Traefik in docker compose in the second terminal
make docker-compose-run

# Run Docker with authelia-admin with hot-reload
make run-dev
```

## Requirements

- Node.js 20+
- Access to Authelia's configuration file
- Access to Authelia's SQLite database
- LDAP server (e.g., LLDAP) configured in Authelia

## Security Notes

>[!IMPORTANT]
Due to the age and experimental nature of the project, I don't recommend using it for public deployment or for installations with many users.

This application requires administrative access to Authelia's configuration and database. It should be deployed behind proper authentication and only accessible by authorized administrators.