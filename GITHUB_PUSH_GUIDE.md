# GitHub Push Guide for MedExJob.com

## Step 1: Check Git Status
```bash
git status
```

## Step 2: Initialize Git (if not already initialized)
```bash
git init
```

## Step 3: Add All Files
```bash
git add .
```

## Step 4: Commit Changes
```bash
git commit -m "Update Privacy Policy, Terms & Conditions, and FAQ pages with comprehensive legal content and domain contact information"
```

## Step 5: Add Remote Repository (if not already added)
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```
OR if you already have a remote:
```bash
git remote -v
```

## Step 6: Push to GitHub
```bash
git push -u origin main
```
OR if your branch is named `master`:
```bash
git push -u origin master
```

## Important Notes:
- Make sure you have a GitHub account
- Create a new repository on GitHub first if you haven't already
- The `.gitignore` file is already configured to exclude:
  - `node_modules/`
  - `dist/`
  - `backend-java/data/` (H2 database files)
  - `logs/`
  - `.env` files
  - And other unnecessary files

## If you encounter authentication issues:
You may need to use a Personal Access Token instead of password:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` scope
3. Use the token as password when prompted





