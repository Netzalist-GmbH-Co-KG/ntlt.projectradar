# AI-Agentic Project Acquisition System - Spezifikation

## Überblick

Ein spezialisiertes Mini-CRM System zur automatisierten Akquise und Analyse von Softwareentwicklungs- und Consulting-Projekten. Das System fungiert als Aggregator für verschiedene Lead-Quellen und nutzt AI-Agenten zur intelligenten Verarbeitung und Aufbereitung von Projektangeboten.

## Projektziele

- **Primärziel**: Systematische Übersicht und Analyse aller verfügbaren Projekte aus verschiedenen Quellen
- **Sekundärziel**: Bessere Projektauswahl durch datengetriebene Entscheidungen statt "lauteste" oder "bestbezahlte" Projekte
- **Langfristig**: Vollautomatisierte Bewerbungsabwicklung und CRM-Integration

## Lead-Quellen

### Aktuelle Quellen
- **Agenturen**: Haze, Accenture, diverse kleinere Vermittlungsagenturen
- **Social Media**: XING, LinkedIn
- **Plattformen**: freelancer.de, freelancerweb
- **Sonstige**: E-Mail-basierte Angebote

### Verarbeitungsansatz
- **Nur E-Mail-basiert**: Alle Quellen werden über E-Mails verarbeitet
- **Kein API-Zugriff**: Bewusster Verzicht auf Plattform-APIs
- **Email-Scanning**: Out of Scope - System startet ab eingehender E-Mail

## System-Architektur

### High-Level Datenfluss

```mermaid
graph TB
    A[Manual Input] --> D[RawLead via Email]
    B[Email Watcher] --> D
    C[Social Media Watcher] --> D
    E[Web Crawler] --> D
    
    D --> F[Raw Lead Processor]
    F --> G[Deduplicated RawLead Storage]
    F --> H[Initial Task Creation]
    
    H --> I[Analytic Agent]
    I --> J[Task Orchestration]
    
    J --> K[Task Execution]
    K --> L[Data Extraction]
    K --> M[Web Research]
    K --> N[Classification]
    
    L --> O[Structured Data]
    M --> O
    N --> O
    
    O --> P[Final Lead Database]
```

### Detaillierter Verarbeitungsprozess

```mermaid
sequenceDiagram
    participant ES as Email Source
    participant RLP as Raw Lead Processor
    participant DB as Database
    participant AA as Analytic Agent
    participant TS as Task System
    
    ES->>RLP: Incoming Email
    RLP->>DB: Persist Raw Email (Headers + Body)
    RLP->>TS: Create Initial Analysis Task
    
    TS->>AA: Execute Analysis Plan
    AA->>AA: Content Classification
    
    alt Contains External Links
        AA->>TS: Create Crawling Task
        TS->>AA: Execute Web Crawling
    end
    
    alt Content Analysis Complete
        AA->>TS: Create Data Extraction Task
        TS->>AA: Execute Data Extraction
        AA->>DB: Store Structured Lead Data
    end
    
    AA->>TS: Create Deduplication Task
    TS->>AA: Execute Deduplication
    AA->>DB: Update Lead Status
```

## Kern-Komponenten

### 1. Raw Lead Processor
**Funktion**: Erste Verarbeitungsstufe für eingehende E-Mails
- Persistierung der kompletten E-Mail als Content
- Erstellung des initialen Analyse-Tasks
- Keine Datenextraktion oder -verarbeitung

### 2. Analytic Agent
**Funktion**: KI-basierte Task-Orchestrierung und -Ausführung
- Erstellt Ausführungspläne basierend auf Inhaltsanalyse
- Koordiniert abhängige Tasks
- Hauptsächlich als Task-Scheduler konzipiert

### 3. Task-System
**Kern-Task-Typen**:
- **Content Analysis**: Klassifizierung des E-Mail-Inhalts
- **Web Crawling**: Extraktion von Jobs aus verlinkten Webseiten
- **Data Extraction**: Strukturierte Datenextraktion aus Rohdaten
- **Deduplication**: Erkennung und Behandlung von Duplikaten
- **Classification**: Tagging und Kategorisierung

**Task-Eigenschaften**:
- Abhängigkeiten zwischen Tasks möglich
- Sequentielle Ausführung bei Dependencies
- Parallelisierung bei unabhängigen Tasks

## Datenmodell

### Entity-Relationship Übersicht

```mermaid
erDiagram
    RawLead ||--|| Job : "contains"
    Job ||--o| Customer : "offers"
    Job ||--o| Agency : "mediated_by"
    Job ||--o{ TagWeight : "has"
    TagWeight }|--|| Tag : "references"
    
    RawLead {
        id string PK
        content text
        received_at datetime
    }
    
    Agency {
        id string PK
        name string
        contact_info text
    }
    
    Customer {
        id string PK
        name string
        industry string
        is_anonymous boolean
    }
    
    Job {
        id string PK
        title string
        description text
        raw_lead_id string FK
        customer_id string FK
        agency_id string FK
        extracted_at datetime
        status string
    }
    
    TagWeight {
        id string PK
        job_id string FK
        tag_id string FK
        weight float
        relevance string
    }
    
    Tag {
        id string PK
        name string
        category string
        required_skills text
    }
```

### Kernentitäten

#### RawLead
- Rohe E-Mail-Persistierung (nur Content)
- Minimale Metadaten (Received_at)
- 1:1 Beziehung zum Job

#### Agency
- Vermittlungsagentur-Identifikation (optional)
- Kontaktinformationen
- Unabhängig von RawLead-Zuordnung

#### Customer
- Endkunde (optional, falls identifizierbar)
- Anonymitäts-Flag für ungenannte Kunden
- Direkte Zuordnung zum Job

#### Job
- Zentrale Entität mit extrahierten Daten
- Verbindung zu RawLead (1:1)
- Optionale Verbindungen zu Customer und Agency
- Basis für Tag-Zuordnungen

#### Tag/TagWeight System
- Job kann 0 bis N TagWeights haben
- Jeder TagWeight referenziert genau einen Tag
- Skill-basiertes Tagging mit Gewichtung

## Task-Orchestrierung

### Execution Plan Beispiel

```mermaid
graph TD
    A[Initial Analysis Task] --> B{Content Type?}
    
    B -->|Direct Job Description| C[Extract Data Task]
    B -->|Contains Links| D[Web Crawling Task]
    B -->|Unclassifiable| E[Manual Review Task]
    
    D --> F[Link Content Analysis]
    F --> C
    
    C --> G[Data Structuring]
    G --> H[Tag Generation]
    H --> I[Deduplication Task]
    
    I --> J[Final Persistence]
    J --> K[UI Update Trigger]
```

### Task-Dependencies
- **Sequential**: Crawling → Content Analysis → Data Extraction
- **Parallel**: Tag Generation und Customer Identification (nach Data Extraction)
- **Final**: Deduplication als letzter Schritt vor Persistierung

## Deduplication-Strategie

### Ansatz
- **Timing**: Kann jederzeit als separater Task ausgeführt werden
- **Implementation**: Als unabhängiger Task im Task-System
- **Methode**: Merge-basierte Zusammenführung von Duplikaten
- **Persistierung**: Daten werden immer normal persistiert, Deduplizierung erfolgt nachgelagert

### Deduplizierung als Merge-Task
```mermaid
graph LR
    A[Persistierte Daten] --> B[Deduplication Task]
    B --> C{Duplicate Found?}
    C -->|Yes| D[Merge Duplicates]
    C -->|No| E[No Action]
    D --> F[Updated Database]
    E --> F
```

## User Interface Ziele

### Primäre Funktionen
- **Einheitliche Darstellung**: Alle Leads aus verschiedenen Quellen in konsistentem Format
- **Filterung und Suche**: Tag-basierte Filterung nach Skills und Kriterien
- **Historische Analyse**: Übersicht über vergangene Angebote von Kunden/Agenturen
- **Status-Tracking**: Verarbeitungsstatus der einzelnen Leads

### Zukünftige Erweiterungen (Out of Scope)
- Automatische Bewerbungsgenerierung
- CRM-Integration
- Skill-Matching und Scoring
- Automatisierte Kontaktaufnahme

## Technische Rahmenbedingungen

### Technology Stack
- **Frontend**: Next.js
- **Backend**: .NET 9
- **Deployment**: Lokal, später containerisiert
- **LLM Provider**: Google Gemini 25 (konfigurierbar)

### Architektur-Prinzipien
- **LLM-Abstraction**: Konfigurierbare Provider ohne externe Frameworks
- **Dependency Injection**: Standard .NET Patterns
- **Task-based Processing**: Async/await Patterns
- **Email-centric**: Alle Eingänge über E-Mail-System

## Scope-Abgrenzung

### In Scope (Phase 1)
- E-Mail Processing ab eingehender Nachricht
- Task-basierte AI-Agents
- Datenextraktion und -strukturierung
- Basic UI für Lead-Übersicht
- Deduplication-System

### Out of Scope (Phase 1)
- E-Mail-Scanning und -Überwachung
- Skill-Matching und Scoring
- Automatische Bewerbungsgenerierung
- CRM-Funktionalitäten
- API-Integration mit externen Plattformen

## Nächste Schritte

1. **Datenmodell-Refinement**: Detaillierte Feldspezifikation
2. **Task-System Design**: Konkrete Task-Typen und Interfaces
3. **LLM-Integration**: Prompt Engineering und Provider-Abstraktion
4. **UI/UX Design**: Wireframes und User Flows
5. **Implementation Planning**: Sprint-Planung und Meilensteine