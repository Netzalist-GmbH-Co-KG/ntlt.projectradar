<AUFGABE>
Aktualisiere die technische Dokumentation in der Datei .doc/System_Overview.md des Projektes, falls nötig.
</AUFGABE>

<DETAILS>
Der aktuelle Status des Projekts wird im Dokument .doc/System_Overview.md beschrieben.
Mit jeder Iteration veraltet diese Dokumentation. Deine Aufgabe ist es,
den tatsächlichen Programmzustand mit der Dokumentation abzugleichen
und diese ggf. zu aktualisieren, wenn er nicht mehr stimmt.
Das Dokument hat den unten beschriebenen festen Aufbau, der nicht geändert werden soll.
<backend> ist das .NET Backend unter /src/ntlt.projectradar.backend
<frontend> ist das NextJS Frontend unter /src/ntlt.projectradar.frontend
Lies Dir zuerst das aktuelle Dokument durch und gleiche es dann mit dem Rechercheergebnis unten ab.
</DETAILS>

<AUFBAU>

# NTLT ProjectRadar System Overview

## Backend

### Persistence: Database Structure

Hinweise für die Recherche:

- <backend>/Data/ProjectRadarContext.cs
- <backend>/Migrations/**
- <backend>/Model/**

Generiere ein Mermaid Diagramm.

### API / Endpoints / DTOs

Check:

- <backend>/Controllers/**
- <backend>/DTOs/**

Generiere eine tabellarische Übersicht über alle Endpunkte gruppiert nach Controller und eine tabellarische Übersicht über alle DTOs mit Properties und Typ.

### Background Services

Check:

- <backend>/BackgroundServices

Erstelle eine tabellarische Übersicht über alle Background Services (Namen) und deren Funktion als knappe Beschreibung was dort getan wird.

## Frontend

### API connection

Check:

- <frontend>/services/apiService.ts

Erstelle eine tabellarische Übersicht über die verwendeten Endpunkte.
Untersuche Diskrepanzen zwischen Backendapi und apiService. Abweichungen bitte auch in der Tabelle erfassen. 

### Pages

Check:

- <frontend>/app/**

Liste alle Seiten mit Routen und deren Funktionalität als Description auf (Tabelle mit zwei Spalten)

</AUFBAU>
