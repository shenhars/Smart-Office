$baseAuth = 'http://localhost:5000/api/auth'
$register = @{ email='e2e_test@example.com'; password='Password123!'; name='e2e_test'; role='Admin' } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Uri "$baseAuth/register" -Method Post -Body $register -ContentType 'application/json' -ErrorAction Stop
  Write-Output 'REGISTER_OK'
  Write-Output ($r | ConvertTo-Json)
} catch {
  Write-Output 'REGISTER_FAILED'
  $resp = $_.Exception.Response
  if ($resp) {
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    Write-Output ($reader.ReadToEnd())
  } else {
    Write-Output $_.Exception.Message
  }
}

$login = @{ email='e2e_test@example.com'; password='Password123!'; name='e2e_test' } | ConvertTo-Json
try {
  $r2 = Invoke-RestMethod -Uri "$baseAuth/login" -Method Post -Body $login -ContentType 'application/json' -ErrorAction Stop
  $token = $r2.token
  Write-Output "LOGIN_TOKEN: $token"
} catch {
  Write-Output 'LOGIN_FAILED'
  $resp = $_.Exception.Response
  if ($resp) {
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    Write-Output ($reader.ReadToEnd())
  } else {
    Write-Output $_.Exception.Message
  }
  exit 1
}

$asset = @{ name='E2E Asset'; type='Device' } | ConvertTo-Json
$headers = @{ Authorization = "Bearer $token" }
try {
  $r3 = Invoke-RestMethod -Uri 'http://localhost:5002/api/assets' -Method Post -Body $asset -ContentType 'application/json' -Headers $headers -ErrorAction Stop
  Write-Output 'ADD_ASSET_OK'
  Write-Output ($r3 | ConvertTo-Json)
} catch {
  Write-Output 'ADD_ASSET_FAILED'
  Write-Output $_.Exception.Message
}
