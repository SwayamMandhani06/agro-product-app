# Stage 1 setup — run from apps/mobile directory after installing Flutter SDK.
# https://docs.flutter.dev/get-started/install/windows

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Get-Command flutter -ErrorAction SilentlyContinue)) {
  Write-Error "Flutter not found in PATH. Install Flutter and retry."
}

if (-not (Test-Path "android")) {
  flutter create . --project-name agro_product_app --org com.agroproduct
}

Copy-Item -Path ".env.example" -Destination ".env" -ErrorAction SilentlyContinue

if (-not (Test-Path "lib/firebase_options.dart")) {
  Copy-Item -Path "lib/firebase_options.example.dart" -Destination "lib/firebase_options.dart"
}

flutter pub get
flutter analyze
Write-Host "Setup complete. Run: flutterfire configure && flutter run"
