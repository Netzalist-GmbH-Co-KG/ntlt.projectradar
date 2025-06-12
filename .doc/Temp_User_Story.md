# User Story: Projektstatus Management

**Als ein** Benutzer
**Möchte ich** den Status von Projekten über einen definierten Lebenszyklus hinweg verwalten können
**Damit ich** den Fortschritt von Projekten verfolgen und Projekte nach ihrer Relevanz filtern oder archivieren kann.

## Akzeptanzkriterien

1.  **Projektentität Aktualisierung:**
    *   Die Entität `ProjectDetails` wird um ein Feld `CurrentStatus` (string, **im Backend als Enum implementiert**) erweitert.
    *   Mögliche Statuswerte (definierte Reihenfolge für sequentielle Übergänge):
        *   `New` (Neu)
        *   `InterestingCold` (Interessant - Kaltakquise)
        *   `InterestingContacted` (Interessant - Kontaktiert)
        *   `InterestingInProgress` (Interessant - In Anbahnung/Reaktion erfolgt)
        *   Parallel zu den "Interesting"-Stufen erreichbar: `NotInteresting` (Nicht interessant)
        *   Endstatus nach "InterestingInProgress": `Won` (Gewonnen) oder `Lost` (Verloren)
        *   Von jedem "Interesting"-Status aus erreichbar: `MissedOpportunity` (Verpasst / Nicht rechtzeitig kontaktiert) - ebenfalls ein Endstatus.


2.  **Statushistorie Tabelle:**
    *   Eine neue Tabelle `ProjectStatusHistory` wird erstellt.
    *   Felder:
        *   `Id` (PK, Guid)
        *   `ProjectId` (FK zu `ProjectDetails`, Guid)
        *   `Status` (string/Enum, der neue Status)
        *   `Timestamp` (DateTime, Zeitpunkt der Änderung)
        *   `Comment` (string, optional, für Begründungen/Notizen)
        *   `ChangedBy` (string, Name des Benutzers, der die Änderung vorgenommen hat, initial "Tobias")

3.  **Logik für Statuswechsel:**
    *   Bei jeder Statusänderung eines Projekts wird ein neuer Eintrag in `ProjectStatusHistory` erstellt (inkl. `ChangedBy`).
    *   Das Feld `CurrentStatus` in `ProjectDetails` wird auf den neuen Status aktualisiert.
    *   Statusübergänge sind nur sequentiell erlaubt (ein Schritt vorwärts oder rückwärts in der oben definierten Reihenfolge der "Interesting"-Stufen).
        *   Von jedem 'Interesting'-Status kann auch direkt zu `NotInteresting` oder `MissedOpportunity` gewechselt werden.
        *   Von `NotInteresting` oder `MissedOpportunity` kann nicht direkt zu `Won` oder `Lost` gewechselt werden, sondern nur zurück zu einem 'Interesting'-Status oder `New`.
    *   Automatisch erstellte Projekte (z.B. aus E-Mails) erhalten initial den Status `New`. Ein entsprechender Eintrag in `ProjectStatusHistory` wird mit einem Kommentar wie "Automatisch generiert" und `ChangedBy` = "System" (oder "Tobias" falls einfacher für den Start) erstellt.
    *   Bei manuellen Statuswechseln muss der Benutzer einen Kommentar eingeben können.
    *   Für die Status `Lost`, `NotInteresting` oder `MissedOpportunity` ist ein Kommentar erforderlich.

4.  **Backend API Anpassungen:**
    *   Ein neuer Endpoint (z.B. `PATCH /api/projects/{id}/status`) wird erstellt, um den Status eines Projekts zu ändern. Dieser Endpoint akzeptiert ein spezifisches DTO (z.B. `UpdateProjectStatusRequestDto`) mit `NewStatus` und einem optionalen `Comment`.
    *   Die Endpoints `GET /api/projects` und `GET /api/projects/{id}` inkludieren den `CurrentStatus` in der Antwort.
    *   Das Backend validiert, ob der angeforderte Statusübergang gemäß der definierten sequentiellen Logik erlaubt ist.

5.  **Frontend UI (Minimal):**
    *   In der Projektlistenansicht (`/projects`) wird der `CurrentStatus` jedes Projekts angezeigt. Die Anzeige ist farbkodiert:
        *   `New`: z.B. Blau
        *   `InterestingCold`: z.B. Hellblau
        *   `InterestingContacted`: z.B. Gelb
        *   `InterestingInProgress`: z.B. Orange
        *   `Won`: z.B. Grün
        *   `Lost`: z.B. Rot
        *   `NotInteresting`: z.B. Grau
        *   `MissedOpportunity`: z.B. Grau
    *   Benutzer können den Status eines Projekts (aus der Liste oder Detailansicht) ändern. Diese Aktion ermöglicht die Eingabe eines Kommentars.
    *   Das UI (z.B. Status-Dropdown) bietet nur die für den aktuellen Status gültigen nächsten/vorherigen Status zur Auswahl an, basierend auf der sequentiellen Logik (inkl. `MissedOpportunity`).
    *   Projekte mit dem Status `NotInteresting` oder `MissedOpportunity` sollen in der Liste ausgegraut dargestellt oder über einen Filter ausblendbar sein.

## Nicht im Scope dieser User Story

*   Anzeige der vollständigen Statushistorie im UI.
*   Swimlanes oder erweiterte Task-Management-Ansichten (Kanban-Board etc.).
*   Einführung eines Prioritätenfeldes.
*   Atomare Ausführung der Statusänderung und des Historien-Eintrags in einer DB-Transaktion (für SQLite vorerst nicht kritisch).
*   Detaillierte Referenzierung der ursprünglichen E-Mail im automatischen Kommentar des ersten Statuseintrags (Verknüpfung ist implizit über das Projekt gegeben).
