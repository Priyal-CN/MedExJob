# Script to push uncommitted changes to GitHub

Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Staging all modified and new files ===" -ForegroundColor Cyan
git add .

Write-Host "`n=== Checking what will be committed ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Committing changes ===" -ForegroundColor Cyan
git commit -m "Update Privacy Policy, Terms & Conditions, FAQ with comprehensive legal content and contact info"

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan
# Try main branch first
git push origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nTrying master branch..." -ForegroundColor Yellow
    git push origin master 2>&1
}

Write-Host "`n=== Done! ===" -ForegroundColor Green



