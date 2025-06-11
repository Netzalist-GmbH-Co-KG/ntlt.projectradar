# User Story 5 - Email Content Viewer Implementation Plan

## Überblick
**User Story**: Als Nutzer möchte ich die originalen Email-Inhalte einsehen können, damit ich alle Informationen zur Verfügung habe.

**Geschätzter Aufwand**: 1,5-2 Stunden  
**Priorität**: P0 (Required for MVP baseline)  
**Abhängigkeiten**: #4 (File Upload)

## Backend Implementation

### 1. Dependencies & Setup
- [ ] MimeKit Package zum Backend hinzufügen (`dotnet add package MimeKit`)
- [ ] ProcessingStatus enum anpassen (Status "New" entfernen, Default "Processing" beibehalten)

### 2. Database Models
- [ ] `EmailDetails` Model erstellen (1:1 Relation zu RawLead)
  - email_from, email_to, email_subject, email_date
  - email_body_text, email_body_html
- [ ] `EmailAttachment` Model erstellen (n:1 Relation zu EmailDetails)
  - attachment_filename, attachment_mimetype, attachment_content
- [ ] ProjectRadarContext um neue DbSets erweitern

### 3. Database Migration
- [ ] EF Migration erstellen (`dotnet ef migrations add AddEmailDetailsAndAttachments`)
- [ ] Database Update (`dotnet ef database update`)

### 4. Email Parser Service
- [ ] `IEmailParserService` Interface erstellen
- [ ] `EmailParserService` Implementation mit MimeKit
- [ ] Email Headers extrahieren (From, To, Subject, Date, Reply-To)
- [ ] Email Body extrahieren (Plain Text & HTML)
- [ ] Attachments extrahieren und speichern

### 5. Background Service
- [ ] `EmailProcessingBackgroundService` erstellen
- [ ] AutoResetEvent/Semaphore für effiziente Endlos-Loop
- [ ] Verarbeitung aller RawLeads mit Status "Processing"
- [ ] Status-Updates (Processing → Completed/Failed)
- [ ] DI Registration in Program.cs

### 6. Service Integration
- [ ] RawLeadService um Trigger-Funktionalität erweitern
- [ ] AutoResetEvent nach Upload triggern
- [ ] Error Handling und Logging

### 7. API Erweiterung
- [ ] RawLeadsController um EmailDetails Endpoint erweitern
- [ ] GET `/api/rawleads/{id}/details` für Email-Details
- [ ] Response DTOs für strukturierte Email-Daten

## Frontend Implementation

### 8. API Service Erweiterung
- [ ] apiService.ts um Email-Details Funktionen erweitern
- [ ] TypeScript Interfaces für EmailDetails und EmailAttachment
- [ ] Error Handling für neue Endpoints

### 9. Routing & Pages
- [ ] `/emails` Route erstellen (Email-Client Layout)
- [ ] `/emails/[id]` Route für Detail-Ansicht
- [ ] Navigation zwischen Listen- und Detail-View

### 10. Email List Component
- [ ] Kompakte Liste mit Autoscroller (100 Emails pro Batch)
- [ ] Zwei-Zeilen Layout: Absender/Datum + Subject
- [ ] Chronologische Sortierung (absteigend)
- [ ] Loading States und Pagination

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
- [ ] Email Detail-Page `/emails/{id}` mit allen Headers und Body (Text/HTML)
- [ ] Mobile responsive Layout
- [ ] Error Handling für nicht existierende IDs
- [ ] Loading States für alle API Calls

---

**Erstellt**: 11. Juni 2025  
**Letztes Update**: 11. Juni 2025  
**Status**: Bereit für Implementierung
