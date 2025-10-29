# Git Setup Guide - SIPELAN

## ⚙️ Konfigurasi Awal Git

### 1. Setup User Identity

Sebelum melakukan commit pertama, setup identitas Git Anda:

```bash
# Global configuration (untuk semua repository)
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"

# Local configuration (hanya untuk repository ini)
git config user.name "Nama Anda"
git config user.email "email@example.com"
```

**Contoh:**
```bash
git config --global user.name "Ahmad Fauzi"
git config --global user.email "ahmad.fauzi@patikab.go.id"
```

### 2. Verify Configuration

```bash
# Lihat semua konfigurasi
git config --list

# Lihat konfigurasi spesifik
git config user.name
git config user.email
```

### 3. First Commit

Setelah setup identity, lakukan commit pertama:

```bash
git add .
git commit -m "feat: initial commit - SIPELAN v1.0.0

- Add landing page with hero section and statistics
- Add complaint form with validation
- Add tracking page with timeline
- Add admin dashboard with charts
- Add backend API with Prisma ORM
- Add email notification system
- Add animations with Framer Motion
- Add complete documentation"
```

## 🔗 Setup Remote Repository

### GitHub

```bash
# Create repository di GitHub terlebih dahulu
# Kemudian add remote:

git remote add origin https://github.com/disnaker-pati/sipelan.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### GitLab

```bash
# Create repository di GitLab terlebih dahulu
# Kemudian add remote:

git remote add origin https://gitlab.com/disnaker-pati/sipelan.git

# Push ke GitLab
git branch -M main
git push -u origin main
```

### Self-Hosted Git Server

```bash
git remote add origin git@server.patikab.go.id:disnaker/sipelan.git
git push -u origin main
```

## 🔑 SSH Key Setup (Recommended)

### 1. Generate SSH Key

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "email@example.com"

# Atau jika sistem tidak support ed25519:
ssh-keygen -t rsa -b 4096 -C "email@example.com"

# Save di lokasi default: ~/.ssh/id_ed25519
```

### 2. Add SSH Key to Agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519
```

### 3. Copy Public Key

```bash
# Linux/Mac
cat ~/.ssh/id_ed25519.pub

# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip
```

### 4. Add to GitHub/GitLab

1. Go to Settings → SSH Keys
2. Click "New SSH Key"
3. Paste public key
4. Save

### 5. Test Connection

```bash
# GitHub
ssh -T git@github.com

# GitLab
ssh -T git@gitlab.com
```

## 🌐 Git Configuration Best Practices

### Editor Configuration

```bash
# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim
git config --global core.editor "nano"         # Nano
```

### Line Ending Configuration

```bash
# Windows
git config --global core.autocrlf true

# Linux/Mac
git config --global core.autocrlf input
```

### Default Branch Name

```bash
# Set default branch name to 'main'
git config --global init.defaultBranch main
```

### Credential Helper

```bash
# Cache credentials for 1 hour
git config --global credential.helper cache

# Cache credentials permanently (Windows)
git config --global credential.helper wincred

# Cache credentials permanently (Mac)
git config --global credential.helper osxkeychain

# Cache credentials permanently (Linux)
git config --global credential.helper store
```

### Color Output

```bash
# Enable colored output
git config --global color.ui auto
```

### Merge Strategy

```bash
# Use rebase instead of merge for pull
git config --global pull.rebase true

# Or keep merge (default)
git config --global pull.rebase false
```

## 📋 Complete .gitconfig Example

Create/edit `~/.gitconfig`:

```ini
[user]
    name = Ahmad Fauzi
    email = ahmad.fauzi@patikab.go.id

[core]
    editor = code --wait
    autocrlf = true
    
[init]
    defaultBranch = main
    
[pull]
    rebase = false
    
[push]
    default = simple
    followTags = true
    
[color]
    ui = auto
    
[credential]
    helper = wincred
    
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
    
[diff]
    tool = vscode
    
[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE
    
[merge]
    tool = vscode
    
[mergetool "vscode"]
    cmd = code --wait $MERGED
```

## 🚀 Quick Start Commands

### After Initial Setup

```bash
# 1. Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@patikab.go.id"

# 2. Verify
git config --list

# 3. Make first commit
git add .
git commit -m "feat: initial commit - SIPELAN v1.0.0"

# 4. Add remote (if using GitHub/GitLab)
git remote add origin <repository-url>

# 5. Push to remote
git branch -M main
git push -u origin main
```

## 🔧 Troubleshooting

### Problem: "Author identity unknown"

**Solution:**
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Problem: "Permission denied (publickey)"

**Solution:**
1. Generate SSH key (see above)
2. Add to GitHub/GitLab
3. Test connection: `ssh -T git@github.com`

### Problem: "fatal: remote origin already exists"

**Solution:**
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin <new-url>
```

### Problem: Line ending warnings (CRLF/LF)

**Solution:**
```bash
# Windows
git config --global core.autocrlf true

# Linux/Mac
git config --global core.autocrlf input

# Refresh repository
git rm --cached -r .
git reset --hard
```

### Problem: "refusing to merge unrelated histories"

**Solution:**
```bash
git pull origin main --allow-unrelated-histories
```

## 📚 Next Steps

After setup:

1. ✅ Read [GIT_GUIDE.md](./GIT_GUIDE.md) for workflow
2. ✅ Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. ✅ Create your first feature branch
4. ✅ Make your first contribution

## 🆘 Need Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Help: https://docs.github.com
- GitLab Help: https://docs.gitlab.com
- Contact: male.deeant@gmail.com

---

**Last Updated**: 27 Oktober 2025
