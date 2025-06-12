# User Story #8 Implementation Plan - Project Detail & Edit

## Ziel
Implementierung einer vollständigen Projekt-Verwaltung mit echten Backend-Daten, bestehend aus ProjectDetails-Komponente mit Edit-Modus, EmailDetails-Refactoring und einem neuen Split-View Layout für die Projektseite.

## Überblick der Änderungen
- **Mock-Daten vollständig entfernen** und durch echte Backend-Integration ersetzen
- **Frontend-Interfaces** an Backend `ProjectDetailsDto` anpassen
- **Neue ProjectDetails-Komponente** mit ReadOnly und Edit-Modus
- **EmailDetails-Refactoring** in Sub-Komponenten
- **Neue Split-View Projektseite** (Liste links, Details rechts)

## Implementation Steps

### 1. Backend Integration & API Services
**Datei:** `src/services/apiService.ts`
- [x] ProjectDetailsDto Interface hinzufügen (basierend auf Backend DTO)
- [x] Project API Service Funktionen implementieren:
  - `getProjects()` - GET /api/projects
  - `getProject(id)` - GET /api/projects/{id}
  - `updateProject(id, data)` - PUT /api/projects/{id}
  - `getProjectsByEmail(emailId)` - GET /api/projects/by-email/{emailId}

### 2. Frontend Interfaces & Types Update
**Datei:** `src/types/project.ts` (neu)
- [x] `ProjectDetailsDto` Interface (1:1 mit Backend)
- [x] `UpdateProjectDetailsDto` Interface für Updates
- [x] Helper-Funktionen für Datenkonvertierung

### 3. Project Hooks Implementierung
**Datei:** `src/hooks/useProjects.ts` (neu)
- [x] `useProjects()` Hook - Liste aller Projekte
- [x] `useProject(id)` Hook - Einzelnes Projekt
- [x] `useProjectUpdate()` Hook - Projekt-Updates mit Auto-Save
- [x] `useProjectsByEmail(emailId)` Hook - Projekte zu Email

### 4. AppContext Mock-Daten Entfernung
**Datei:** `src/contexts/AppContext.tsx`
- [x] Alle Mock-Daten und Project-State entfernen
- [x] AppContext vereinfachen (nur noch gemeinsame UI-States)
- [x] Project-spezifische Actions entfernen

### 5. ProjectDetails Komponente (ReadOnly)
**Datei:** `src/components/Project/ProjectDetails.tsx` (neu)
- [X] Kompakte Kachel-Darstellung für Projektdaten
- [X] Edit Button (Pencil Icon) für Wechsel in Edit-Modus
- [X] Responsive Layout mit allen Backend-Feldern
- [X] Loading und Error States

### 6. ProjectDetails Edit-Modus
**Datei:** `src/components/Project/ProjectDetailsEdit.tsx` (neu)
- [x] Editierbare Form für alle Projektfelder
- [x] Auto-Save bei change events (kein Save Button)
- [x] Debounced Updates (500ms delay)
- [x] Optimistic Updates mit Rollback bei Fehler
- [x] Validation und Error Handling

### 7. EmailDetails Refactoring - Sub-Komponenten
**Dateien:** `src/components/Email/` (Refactoring)
- [x] `EmailDetailContent.tsx` - Email Content Bereich
- [x] `EmailDetailAttachments.tsx` - Attachments Bereich
- [x] `EmailDetailHeader.tsx` - Header mit Projekten
- [x] `EmailDetailError.tsx` - Error States
- [x] `EmailDetailMissing.tsx` - Missing States
- [x] `EmailDetail.tsx` refactored zu Composition

### 8. EmailDetailHeader mit Projektliste
**Datei:** `src/components/Email/EmailDetailHeader.tsx`
- [x] Projektliste oben rechts im Email Header
- [x] MouseOver: ProjectDetails als Overlay
- [x] Click: Navigation zu `/projects/{id}`
- [x] Integration mit `useProjectsByEmail(emailId)`

### 9. Neue Project Split-View Seite
**Datei:** `src/app/projects/[[...id]]/page.tsx` (neu)
- [x] Optional Catch-All Route für `/projects` und `/projects/{id}`
- [x] Split Layout: Liste links (1/3), Details rechts (2/3)
- [x] ProjectList Komponente (ohne Overlay, wie EmailList)
- [x] Selected State Management über URL Parameter id
- [x] Responsive Verhalten (Mobile: Stack)

### 10. Anpassen der Email Liste als Splitview / catchall
- [ ] Die Email route app/emails soll exakt analog zur projekte route app/projects/[[...id]] umgebaut werden.
- [ ] Dies ermöglicht einer direkte Navigation zu einer spezifischen Email und Browser Navigation
- [ ] Layout und Verhalten soll analog zu /app/projects sein (z.B. ist der Content Container bei Projekten "top" aligned und bei emails "vertical centered")

### 11. Routes & Navigation Update
- [ ] `src/app/projects/page.tsx` löschen (ersetzt durch [[...id]])
- [ ] `src/app/projects/[id]/page.tsx` löschen (ersetzt durch [[...id]])
- [ ] Navigation Links in Header/Sidebar anpassen
- [ ] Breadcrumb Updates für neue Routen-Struktur

### 12. Testing & Refinement
- [ ] Integration Testing mit echten Backend-Daten
- [ ] Error Handling für alle Edge Cases
- [ ] Loading States und UX Optimierung
- [ ] Mobile Responsive Tests
- [ ] Performance Optimierung (Memo, Callbacks)

## Technische Details

### Route Strategie
```
/projects              -> ProjectList (links) + leerer Detail-Bereich (rechts)
/projects/{id}         -> ProjectList (links) + ProjectDetails (rechts) für {id}
```

### Auto-Save Implementierung
- Debounced Updates mit 500ms delay
- Optimistic UI Updates
- Toast Notifications für Save Status
- Rollback bei API Errors

### Split-View Layout
```
┌─────────────────────────────────────────┐
│ Project Radar - Projects                │
├─────────────────────────────────────────┤
│ [Projects] [Emails] [Upload]            │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────┐ ┌─────────────────────┐ │
│ │ProjectList  │ │ ProjectDetails      │ │
│ │             │ │                     │ │
│ │ [●] Proj A  │ │ Title: [editable]   │ │
│ │ [ ] Proj B  │ │ Desc:  [editable]   │ │
│ │ [ ] Proj C  │ │ Tech:  [editable]   │ │
│ │             │ │                     │ │
│ └─────────────┘ └─────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Abhängigkeiten
- **Keine Backend-Änderungen** erforderlich (API bereits vollständig)
- **Keine neuen Dependencies** erforderlich
- **Breaking Change:** Alte Project Pages werden ersetzt

## Erfolgs-Kriterien
- [ ] Alle Mock-Daten entfernt, nur echte Backend-Daten
- [ ] ProjectDetails Komponente funktional (ReadOnly + Edit)
- [ ] EmailDetails refactored und zeigt verknüpfte Projekte
- [ ] Split-View Project Page mit URL-basierter Selektion
- [ ] Auto-Save funktioniert ohne Save Button
- [ ] Responsive Design auf allen Viewports

## Geschätzte Implementierungszeit: 4-5 Stunden
