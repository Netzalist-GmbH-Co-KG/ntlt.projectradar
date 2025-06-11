# User Story #5 in Github - Email Content Viewer Implementation Plan

## Überblick
**User Story**: Als Nutzer möchte ich die originalen Email-Inhalte einsehen können, damit ich alle Informationen zur Verfügung habe.

**Geschätzter Aufwand**: 1,5-2 Stunden  
**Priorität**: P0 (Required for MVP baseline)  
**Abhängigkeiten**: #4 (File Upload)

## Backend Implementation

### 1. Dependencies & Setup
- [x] MimeKit Package zum Backend hinzufügen (`dotnet add package MimeKit`)
- [x] ProcessingStatus enum anpassen (Status "New" entfernen, Default "Processing" beibehalten)

### 2. Database Models
- [x] `EmailDetails` Model erstellen (1:1 Relation zu RawLead)
  - email_from, email_to, email_subject, email_date
  - email_body_text, email_body_html
- [x] `EmailAttachment` Model erstellen (n:1 Relation zu EmailDetails)
  - attachment_filename, attachment_mimetype, attachment_content
- [x] ProjectRadarContext um neue DbSets erweitern

### 3. Database Migration
- [x] EF Migration erstellen (`dotnet ef migrations add AddEmailDetailsAndAttachments`)
- [x] Database Update (`dotnet ef database update`)

### 4. Email Parser Service
- [x] `IEmailParserService` Interface erstellen
- [x] `EmailParserService` Implementation mit MimeKit
- [x] Email Headers extrahieren (From, To, Subject, Date, Reply-To)
- [x] Email Body extrahieren (Plain Text & HTML)
- [x] Attachments extrahieren und speichern
- [x] Deduplizierung: Bestehende EmailDetails und Attachments überschreiben
- [x] DI Registration in Program.cs
- [x] Unit Tests für EmailParserService

### 5. Background Service
- [x] `EmailProcessingBackgroundService` erstellen
- [x] Die Implementierung muss sicher testbar sein. Die Tests müssen ohne Verzögerung laufen (kein Task.Delay oder ähnliches)
- [x] AutoResetEvent für effiziente Endlos-Loop
- [x] Verarbeitung aller RawLeads mit Status "Processing"
- [x] Status-Updates (Processing → Completed/Failed)
- [x] DI Registration in Program.cs
- [x] UnitTests.

### 6. Service Integration
- [x] RawLeadService um Trigger-Funktionalität erweitern
- [x] AutoResetEvent nach Upload triggern
- [x] Error Handling und Logging

### 7. API Erweiterung
- [X] Neuer emails controller GET /api/emails/ der einen paginierten Abruf der Emails erlaubt (chronologisch absteigend)
- [X] GET `/api/emails/{id}` für den Abruf einer einzelnen Email
- [X] Response DTOs für strukturierte Email-Daten inklusive der Attachments

## Frontend Implementation

### 8. API Service Erweiterung
- [x] apiService.ts um Email Funktionen erweitern
- [x] TypeScript Interfaces für EmailDetails und EmailAttachments sowie Listen
- [x] Error Handling für neue Endpoints
- [x] Email utilities für Formatierung und Display-Helper
- [x] Custom React Hooks für Email-Datenmanagement

### 9. Routing & Pages
- [x] `/emails` Route erstellen (Email-Client Layout)

### 10. Email List Component
- [x] Kompakte Liste mit Autoscroller (100 Emails pro Batch)
- [x] Zwei-Zeilen Layout: Absender/Datum + Subject
- [x] Chronologische Sortierung (absteigend)
- [x] Loading States und Pagination

### 11. Email Detail Component
- [ ] Email Headers in strukturierter Card-Form
- [ ] Toggle zwischen Plain Text und HTML View
- [ ] Attachment-Liste mit Download-Funktionalität
- [ ] Breadcrumb Navigation

### 12. HTML Email Rendering
- [ ] Sichere HTML-Rendering Implementation
- [ ] iframe oder dangerouslySetInnerHTML (je nach Anforderung)
- [ ] Alternative: Einfache Email-Rendering Library evaluieren
- [ ] Embedded Images Support

### 13. UI/UX Finalisierung
- [ ] Mobile-responsive Layout
- [ ] Error Handling für nicht existierende IDs
- [ ] Loading States für alle API Calls
- [ ] Kompakte, lesbare Darstellung

## Testing & Validation

### 14. Backend Tests
- [ ] EmailParserService Unit Tests
- [ ] BackgroundService Integration Tests
- [ ] Controller Tests für neue Endpoints

### 15. Frontend Tests
- [ ] Component Tests für Email-Viewer
- [ ] Integration Tests für Email-Navigation
- [ ] End-to-End Tests für kompletten Workflow

## Technische Notizen

### Background Service Details
- Endlos-Loop mit AutoResetEvent/Semaphore für sparsamen Ressourcenverbrauch
- Trigger direkt nach Upload, später auch für Batch-Imports von anderen Quellen
- Verarbeitung nur von RawLeads mit Status "Processing"

### HTML Email Rendering
- Interne Lösung - wenig Sorge vor Injections
- Präferenz: dangerouslySetInnerHTML oder iframe
- Alternative: Einfache Library mit wenigen Zeilen Code

### ProcessingStatus Workflow
- Upload → Status "Processing" (Default)
- Background Service → Status "Completed" oder "Failed"
- Status "New" wird entfernt (redundant)

## Definition of Done
- [ ] BackgroundService existiert und kann aus Code getriggert werden
- [ ] Email-Page `/emails` mit Email-Client Layout (Liste links, Details rechts)
- [ ] Liste mit Autoscroller (100 Emails), chronologisch absteigend
- [ ] Kompakte Darstellung: Absender/Datum + Subject
- [ ] Mobile responsive Layout
- [ ] Error Handling für nicht existierende IDs
- [ ] Loading States für alle API Calls

---

**Erstellt**: 11. Juni 2025  
**Letztes Update**: 11. Juni 2025  
**Status**: Bereit für Implementierung
