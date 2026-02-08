Write-Host "🧹 Cleaning up project directory..." -ForegroundColor Yellow

$filesToRemove = @(
    "walkthrough.md.resolved",
    "GOOGLE_OAUTH_SETUP.md",
    "SETUP_GUIDE.md",
    "backend/database.py",
    "backend/routes.py",
    "backend/fix_db.py",
    "IMPLEMENTATION_PLAN.md"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "Skipped: $file (Not found)" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Project cleanup complete!" -ForegroundColor Cyan
