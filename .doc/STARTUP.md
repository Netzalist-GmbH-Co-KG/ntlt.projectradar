# ProjectRadar - Startup Guide

## Verschiedene Startmodi

### 1. Mit Aspire (Empfohlen für Entwicklung)
Aspire orchestriert automatisch Backend und Frontend:

```powershell
cd "c:\src\ntlt\ntlt.projectradar\src\ntlt.projectradar.backend\ntlt.projectradar.AppHost"
dotnet run
```

- Backend und Frontend werden automatisch gestartet
- Service Discovery funktioniert automatisch
- Dashboard verfügbar unter: https://localhost:17099
- Frontend läuft standardmäßig auf einem dynamischen Port

### 2. Standalone Modus
Backend und Frontend getrennt starten:

#### Backend starten:
```powershell
cd "c:\src\ntlt\ntlt.projectradar\src\ntlt.projectradar.backend\ntlt.projectradar.backend"
dotnet run
```
- Backend läuft auf: http://localhost:5100 und https://localhost:5101
- Swagger UI verfügbar unter: https://localhost:5101/swagger

#### Frontend starten (Standalone):
```powershell
cd "c:\src\ntlt\ntlt.projectradar\src\ntlt.projectradar.frontend"
npm run dev:standalone
```
- Frontend läuft auf: http://localhost:3000
- Verwendet Backend auf http://localhost:5100

#### Frontend starten (Standard):
```powershell
cd "c:\src\ntlt\ntlt.projectradar\src\ntlt.projectradar.frontend"
npm run dev
```
- Frontend läuft auf: http://localhost:3000
- Versucht Aspire Service Discovery, fällt zurück auf http://localhost:5100

## Konfiguration

### Backend Ports ändern
Bearbeiten Sie `appsettings.json` oder `appsettings.Development.json`:

```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5100"
      },
      "Https": {
        "Url": "https://localhost:5101"
      }
    }
  }
}
```

### Frontend Backend-URL ändern
Erstellen Sie `.env.local` im Frontend-Verzeichnis:

```
BACKEND_URL=http://localhost:5100
```

## URL-Priorität im Frontend
1. `BACKEND_URL` Environment Variable (Standalone Modus)
2. Aspire Service Discovery URLs
3. Fallback: `http://localhost:5100`
