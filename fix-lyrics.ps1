# Fix lyrics page by removing duplicate function
Remove-Item -Path "app\lyrics\page.tsx" -Force
Copy-Item -Path "app\lyrics\page.tsx.new" -Destination "app\lyrics\page.tsx"
