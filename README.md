# techdevicerepair.online

## ⚠️ CRITICAL: Git Workflow Requirements

**ALL changes to this repository MUST follow proper Git workflow:**

### Before Making Any Changes:
```bash
git pull origin main
```

### After Making Changes:
```bash
git add .
git commit -m "Descriptive commit message"
git push origin main
```

**❌ NEVER make changes without pulling latest code first**
**❌ NEVER forget to push changes after committing**
**❌ NEVER work on outdated code**

This ensures:
- No merge conflicts with other developers
- Latest features and bug fixes are always included
- Clean collaboration and code history
- Proper version control practices

---

## Project Overview

This repository contains the Tech Device Repair website with server configuration and deployment files.

### Directory Structure:
- `techdevicerepair/` - Main website files (HTML, CSS, JS, images)
- `Caddyfile` - Web server configuration
- `docker-compose.yml` - Local development setup
- `docker-compose.production.yml` - Production deployment configuration
- Server management scripts (`start.sh`, `stop.sh`, `build.sh`)

### Getting Started:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd techdevicerepair.online
   ```

2. **Start development server:**
   ```bash
   ./start.sh
   ```

3. **Access the site:**
   - Local: http://localhost:9574
   - Production: https://techdevicerepair.online

### Important Files:
- `SERVER_README.md` - Detailed server setup instructions
- `techdevicerepair/README.md` - Website-specific documentation
- `Caddyfile` - Web server configuration with security headers

### Development Workflow:
1. Always `git pull origin main` before making changes
2. Make your changes to the appropriate files
3. Test locally using `./start.sh`
4. Commit and push your changes: `git add . && git commit -m "description" && git push origin main`
