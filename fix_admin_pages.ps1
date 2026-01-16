# Script to remove AdminNavbar and AdminSidebar from all admin pages

$pages = @(
    "users",
    "organizers", 
    "opportunities",
    "donations",
    "community",
    "blogs",
    "categories",
    "comments"
)

foreach ($page in $pages) {
    $file = "src\app\admin\$page\page.jsx"
    Write-Host "Processing $file..."
    
    $content = Get-Content $file -Raw
    
    # Remove AdminNavbar and AdminSidebar imports
    $content = $content -replace ',\s*AdminNavbar', ''
    $content = $content -replace 'import AdminNavbar from [^;]+;[\r\n]+', ''
    
    # Remove the opening tags and wrappers
    $content = $content -replace '(?s)<AdminNavbar[^>]*/>[\r\n\s]*<div className="container-fluid py-4">[\r\n\s]*<div className="row g-3">[\r\n\s]*<AdminSidebar[^/]*/>', ''
    $content = $content -replace '(?s)<main className="col-lg-9 col-xl-10">', ''
    
    # Remove closing tags
    $content = $content -replace '(?s)</main>[\r\n\s]*</div>[\r\n\s]*</div>', ''
    
    Set-Content $file $content -NoNewline
    Write-Host "✓ Updated $file"
}

Write-Host "`n✅ All pages updated!"
