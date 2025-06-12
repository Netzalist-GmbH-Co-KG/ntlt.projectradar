# User Story #15 Implementation Plan

## Ziel
Das Ziel dieser User Story ist es, ein System zur Verwaltung des Status von Projekten über einen definierten Lebenszyklus zu implementieren. Dies ermöglicht es Benutzern, den Fortschritt von Projekten zu verfolgen und Projekte nach ihrer Relevanz zu filtern oder zu archivieren.

## Implementation Steps

### 1. Backend: Datenmodell erweitern
- [x] **Entität `ProjectDetails` anpassen:**
    - Feld `CurrentStatus` (Enum: `New`, `InterestingCold`, `InterestingContacted`, `InterestingInProgress`, `NotInteresting`, `Won`, `Lost`, `MissedOpportunity`) in `ntlt.projectradar.backend/Models/ProjectDetails.cs` hinzufügen.
- [x] **Neue Entität `ProjectStatusHistory` erstellen:**
    - In `ntlt.projectradar.backend/Models/` eine neue Datei `ProjectStatusHistory.cs` erstellen mit den Feldern: `Id` (Guid), `ProjectId` (Guid), `Status` (Enum, derselbe Typ wie `CurrentStatus`), `Timestamp` (DateTime), `Comment` (string, optional), `ChangedBy` (string).
- [x] **Datenbankkontext `ProjectRadarContext` aktualisieren:**
    - `DbSet<ProjectStatusHistory>` in `ntlt.projectradar.backend/Data/ProjectRadarContext.cs` hinzufügen.
    - Beziehung zwischen `ProjectDetails` und `ProjectStatusHistory` konfigurieren.
- [x] **Datenbankmigration erstellen und anwenden:**
    - Mittels `dotnet ef migrations add AddProjectStatusManagement` und `dotnet ef database update` die Änderungen in die Datenbank übernehmen.

### 2. Backend: Service-Logik für Statuswechsel
- [x] **Neuen Service `ProjectStatusService` erstellen (optional, alternativ Logik im Controller):**
    - In `ntlt.projectradar.backend/Services/` eine neue Datei `ProjectStatusService.cs` und `IProjectStatusService.cs` erstellen.
    - Methode implementieren, die einen Statuswechsel validiert (gemäß sequentieller Logik und Sonderfällen wie `NotInteresting`, `MissedOpportunity`).
    - Methode implementieren, die bei Statuswechsel einen Eintrag in `ProjectStatusHistory` erstellt und `CurrentStatus` in `ProjectDetails` aktualisiert.
    - Logik für initialen Status `New` bei Projekterstellung (z.B. durch `EmailProcessingBackgroundService`) implementieren, inklusive `ProjectStatusHistory`-Eintrag mit `ChangedBy = "System"` und Kommentar "Automatisch generiert".

### 3. Backend: API Endpoints anpassen und erstellen
- [x] **DTOs anpassen/erstellen:**
    - `ProjectDetailsDto` (`ntlt.projectradar.backend/DTOs/ProjectDetailsDto.cs`) um `CurrentStatus` erweitern.
    - Neues DTO `UpdateProjectStatusRequestDto.cs` in `ntlt.projectradar.backend/DTOs/` erstellen mit `NewStatus` (Enum) und `Comment` (string, optional).
- [x] **`ProjectsController` anpassen:**
    - `GET /api/projects` und `GET /api/projects/{id}`: `CurrentStatus` in die Antwort aufnehmen.
    - Neuen Endpoint `PATCH /api/projects/{id}/status` erstellen:
        - Akzeptiert `UpdateProjectStatusRequestDto`.
        - Nutzt den `ProjectStatusService` (oder interne Logik) für Validierung und Durchführung des Statuswechsels.
        - Stellt sicher, dass ein Kommentar für `Lost`, `NotInteresting`, `MissedOpportunity` vorhanden ist.
        - Setzt `ChangedBy` auf den aktuellen Benutzer (vorerst "Tobias").

### 4. Frontend: API Service anpassen
- [ ] **Typdefinitionen erweitern:**
    - In `ntlt.projectradar.frontend/src/types/project.ts` (oder Äquivalent) die `Project` Typdefinition um `currentStatus` erweitern.
    - Enum für Projektstatus im Frontend definieren, passend zum Backend.
- [ ] **`apiService.ts` erweitern:**
    - In `ntlt.projectradar.frontend/src/services/apiService.ts` eine neue Methode `updateProjectStatus(projectId: string, newStatus: string, comment?: string)` hinzufügen, die den `PATCH /api/projects/{id}/status` Endpoint aufruft.
    - Sicherstellen, dass `getProjects` und `getProjectById` den `currentStatus` verarbeiten.

### 5. Frontend: UI-Anpassungen für Projektstatus
- [ ] **Projektliste (`/projects`):**
    - `CurrentStatus` für jedes Projekt anzeigen.
    - Farbkodierung für Status implementieren (z.B. durch CSS-Klassen basierend auf dem Status).
        - `New`: Blau
        - `InterestingCold`: Hellblau
        - `InterestingContacted`: Gelb
        - `InterestingInProgress`: Orange
        - `Won`: Grün
        - `Lost`: Rot
        - `NotInteresting`: Grau
        - `MissedOpportunity`: Grau
    - Projekte mit Status `NotInteresting` oder `MissedOpportunity` ausgrauen oder Filteroption anbieten.
- [ ] **Statusänderungsfunktion implementieren (in Projektliste und/oder Detailansicht):**
    - UI-Element (z.B. Dropdown oder Button-Gruppe) zur Auswahl des neuen Status hinzufügen.
    - Das UI soll nur gültige nächste/vorherige Status basierend auf der aktuellen Logik anbieten.
    - Eingabefeld für Kommentar bei Statuswechsel ermöglichen.
    - Kommentarfeld als Pflichtfeld für `Lost`, `NotInteresting`, `MissedOpportunity` implementieren.
    - Bei Ausführung die `updateProjectStatus` Methode aus dem `apiService` aufrufen.

### 6. Testing
- [ ] **Backend Unit Tests:**
    - Tests für die Statuswechsel-Logik im `ProjectStatusService` oder `ProjectsController` schreiben.
    - Tests für die API-Endpoints (Status holen, Status ändern).
- [ ] **Manuelle Tests:**
    - Alle Akzeptanzkriterien der User Story durchtesten.
    - Überprüfen der korrekten Einträge in `ProjectStatusHistory`.
    - Überprüfen der sequentiellen Statusübergänge und Sonderfälle.
