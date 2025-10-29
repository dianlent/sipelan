# Git Guide - SIPELAN

## 📚 Panduan Penggunaan Git untuk SIPELAN

### 🚀 Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/disnaker-pati/sipelan.git
cd sipelan
```

#### 2. Setup Development
```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Setup database
npx prisma generate
npx prisma migrate dev
```

## 🌿 Branching Strategy

### Branch Structure

```
main (production)
  ├── develop (staging)
  │   ├── feature/nama-fitur
  │   ├── bugfix/nama-bug
  │   └── hotfix/nama-hotfix
```

### Branch Naming Convention

**Feature Branches**
```bash
feature/add-file-upload
feature/email-notification
feature/user-authentication
```

**Bug Fix Branches**
```bash
bugfix/fix-pagination
bugfix/resolve-email-error
bugfix/ticket-generation
```

**Hotfix Branches**
```bash
hotfix/security-patch
hotfix/critical-bug
```

**Release Branches**
```bash
release/v1.1.0
release/v2.0.0
```

## 📝 Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance
- `perf`: Performance improvement
- `ci`: CI/CD changes

### Scopes
- `pengaduan`: Complaint features
- `admin`: Admin dashboard
- `api`: API endpoints
- `ui`: UI components
- `db`: Database/Prisma
- `auth`: Authentication
- `email`: Email system
- `docs`: Documentation

### Examples

```bash
# Feature
git commit -m "feat(pengaduan): add file upload functionality"

# Bug fix
git commit -m "fix(api): resolve duplicate ticket number issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(ui): improve button component structure"
```

### Detailed Commit
```bash
git commit -m "feat(email): implement status update notification

- Add email template for status updates
- Configure nodemailer transporter
- Add color-coded status badges
- Include tracking link in email

Closes #123"
```

## 🔄 Workflow

### 1. Start New Feature

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/add-export-data

# Make changes
# ... coding ...

# Stage changes
git add .

# Commit
git commit -m "feat(admin): add export to Excel functionality"

# Push to remote
git push origin feature/add-export-data
```

### 2. Create Pull Request

1. Go to GitHub/GitLab
2. Click "New Pull Request"
3. Select: `feature/add-export-data` → `develop`
4. Fill PR template
5. Request review
6. Wait for approval

### 3. Merge to Develop

```bash
# After PR approved
git checkout develop
git pull origin develop
git merge feature/add-export-data
git push origin develop

# Delete feature branch
git branch -d feature/add-export-data
git push origin --delete feature/add-export-data
```

### 4. Release to Production

```bash
# Create release branch
git checkout develop
git checkout -b release/v1.1.0

# Update version in package.json
# Update CHANGELOG.md

git commit -m "chore(release): prepare v1.1.0"
git push origin release/v1.1.0

# After testing, merge to main
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# Delete release branch
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

## 🔧 Useful Commands

### Status & Info
```bash
# Check status
git status

# View commit history
git log --oneline --graph --all

# View changes
git diff

# View staged changes
git diff --staged

# Show branches
git branch -a
```

### Stashing
```bash
# Save work temporarily
git stash

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Clear all stashes
git stash clear
```

### Undoing Changes
```bash
# Discard changes in working directory
git checkout -- <file>

# Unstage file
git reset HEAD <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (create new commit)
git revert <commit-hash>
```

### Remote Operations
```bash
# Add remote
git remote add origin <url>

# View remotes
git remote -v

# Fetch from remote
git fetch origin

# Pull from remote
git pull origin develop

# Push to remote
git push origin feature/my-feature

# Push tags
git push origin --tags
```

### Cleaning
```bash
# Remove untracked files (dry run)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd
```

## 🏷️ Tagging

### Create Tag
```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 <commit-hash> -m "Release version 1.0.0"
```

### Push Tags
```bash
# Push single tag
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### List & Delete Tags
```bash
# List tags
git tag

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

## 🔍 Searching

```bash
# Search in commit messages
git log --grep="bug fix"

# Search in code
git log -S "function_name"

# Search by author
git log --author="John Doe"

# Search by date
git log --since="2024-01-01" --until="2024-12-31"
```

## 🚨 Emergency Procedures

### Hotfix Process
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-patch

# Make fix
# ... coding ...

# Commit
git commit -m "fix(security): patch XSS vulnerability"

# Merge to main
git checkout main
git merge hotfix/critical-security-patch
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge hotfix/critical-security-patch
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-security-patch
```

### Recover Deleted Branch
```bash
# Find commit hash
git reflog

# Recreate branch
git checkout -b recovered-branch <commit-hash>
```

### Fix Wrong Commit Message
```bash
# Last commit
git commit --amend -m "New commit message"

# Already pushed (avoid if possible)
git push origin feature/my-feature --force
```

## 📊 Git Aliases

Add to `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --all --decorate
    amend = commit --amend --no-edit
    undo = reset --soft HEAD~1
```

Usage:
```bash
git st          # git status
git co develop  # git checkout develop
git visual      # pretty log
```

## 🔐 Security Best Practices

### Never Commit
- ❌ `.env` files
- ❌ API keys
- ❌ Passwords
- ❌ Private keys
- ❌ Database credentials
- ❌ `node_modules/`
- ❌ Build artifacts

### Use .gitignore
```bash
# Check if file is ignored
git check-ignore -v <file>

# Force add ignored file (not recommended)
git add -f <file>
```

### Remove Sensitive Data
```bash
# Remove from history (use with caution)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <file>" \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner (recommended)
bfg --delete-files <file>
```

## 📈 Git Statistics

```bash
# Contributor stats
git shortlog -sn

# File change frequency
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10

# Lines of code by author
git log --author="John Doe" --pretty=tformat: --numstat | \
  awk '{ add += $1; subs += $2; loc += $1 - $2 } END \
  { printf "added lines: %s removed lines: %s total lines: %s\n", add, subs, loc }'
```

## 🆘 Help & Resources

### Get Help
```bash
# General help
git help

# Command help
git help commit
git help merge

# Quick reference
git <command> --help
```

### Resources
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Maintained by**: Tim IT Disnaker Kabupaten Pati  
**Last Updated**: 27 Oktober 2024
