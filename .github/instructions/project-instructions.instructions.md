---
applyTo: '**'
---
# Project Instructions

- Do not be overly eager. Only execute what was asked for and ask for permission to continue on the next logical task.
- Create new projects and add dependencies using CLI commands
  like `dotnet new` or `npm create`, or `dotnet add package`.
- Die CLI ist Powershell. Bitte bei der Syntax beachten (z.B. kein `&&` verwenden, sondern `;` für mehrere Befehle in einer Zeile).
- Bitte keine Navigation Properties in den Datenmodellen erzeugen.

# Base Information

The project spec is in .doc/project_acquisition_system_spec.md
The spec for the MVP is in .doc/mvp_specification.md

## GitHub Repository Information

- **Organization:** Netzalist-GmbH-Co-KG
- **Repository:** ntlt.projectradar
- **Full Repository Path:** `Netzalist-GmbH-Co-KG/ntlt.projectradar`
- **GitHub Projects Board:** https://github.com/orgs/Netzalist-GmbH-Co-KG/projects/4/views/1
- **Repository URL:** https://github.com/Netzalist-GmbH-Co-KG/ntlt.projectradar

### GitHub Workflow
- Use GitHub Issues for task tracking and project planning
- Repository has GitHub Projects enabled for project management
- Access to repository via MCP GitHub integration
- Work with issues, pull requests, and project boards as part of development workflow

# Tool handling
- WICHTIG: es gibt einen Bug? im Tool Calling: eine neu erstellte Datei wird zunächst nur
  in der IDE erstellt, aber nicht gespeichert. Wenn möglich neue Dateien nach der Erstellung
  explizit speichern.