# Upcoming Updates

Este documento recoge propuestas adicionales de mejoras y correcciones basadas en una revisión del código actual del proyecto. Las entradas están organizadas por prioridad y contienen notas de implementación y archivos relevantes cuando aplica.

- [ ] Reescribir el sistema de validación usando `zod`
  - Motivo: `zod` proporciona schemas tipados y validación sinérgica con TypeScript, lo que facilita mantenimiento y validaciones complejas (ej. respuestas encadenadas entre prompts).
  - Notas de implementación:
    - Crear adaptadores para aceptar validadores personalizados actuales y migrarlos a `zod`.
    - Añadir tests para validar el comportamiento de `ValidationManager`.
  - Archivos relacionados: `src/core/validation-manager.ts`

- [ ] Reemplazar dependencias externas por implementaciones propias¹
  - Detalle (definiciones ya presentes):
    - `picocolors` → `@useful-libs/neocolors`
    - `commander` → `my-custom-command`
    - `ora` → `my-custom-ora`
  - Notas:
    - Extraer abstracciones para `UI/Spinner/CLI-Parser` y crear adaptadores para facilitar la transición y pruebas.
    - Mantener compatibilidad de la API pública: `exitOverride`, parseo síncrono/async y options parsing.
  - Archivos relacionados: `package.json`, `src/core/cli-builder.ts`, `src/core/project-generator.ts`, `src/core/ui-manager.ts`

- [ ] Introducir un sistema de plugins y plantillas predefinidas
  - Motivo: facilitar la extensión y compartir templates/plugins (p. ej. integración con frameworks).
  - Características sugeridas:
    - API para registrar plugins (hooks lifecycle: before-generate, after-generate, modify-files).
    - Plantillas publicables (registro local / remoto).
    - Validación de schema para templates (nombre, archivos, dependencies, postInstall).
  - Archivos relacionados: `src/plugins/*`, `src/core/project-generator.ts`, `src/types/*`

- [ ] Fix: Typo y robustez en `generatePackageJson`
  - Problema detectado: la clave `devDepencies` está mal escrita y causa que `devDependencies` no se escriban.
  - Acción: corregir a `devDependencies` y añadir test que valide la salida de `package.json` generada por `ProjectGenerator`.
  - Archivo: `src/core/project-generator.ts`

- [ ] Fix: Manejo de valores por defecto en confirm prompts
  - Problema detectado: en `handleConfirmPrompt` el bloque que intenta aplicar el default no hace nada:
    - Código actual no asigna el valor por defecto cuando el usuario presiona Enter.
  - Acción: aplicar el default correctamente y normalizar respuesta antes de evaluar.
  - Archivo: `src/core/cli-builder.ts`

- [ ] Abstraer la UI y spinner para permitir pruebas sin dependencias de runtime
  - Motivo: permitir que ejemplos y tests corran sin `ora`/`picocolors`.
  - Implementación:
    - Introducir interfaz `Spinner` e inyectarla en `ProjectGenerator`.
    - Proveer implementación real (`my-custom-ora`) y una no-op para tests/examples.
  - Archivos relacionados: `src/core/project-generator.ts`, `src/core/ui-manager.ts`

- [ ] Detectar y soportar distintos gestores de paquetes (npm, pnpm, yarn)
  - Motivo: mejorar la experiencia del usuario al instalar dependencias.
  - Implementación:
    - Detectar `npm`, `pnpm` o `yarn` en PATH o usar heurística (`pnpm-lock.yaml`, `yarn.lock`).
    - Ejecutar comando correspondiente (`npm install`, `pnpm install`, `yarn install`).
    - Añadir opción para saltar instalación.
  - Archivo: `src/core/project-generator.ts`

- [ ] Mejorar manejo de errores y fábrica de errores
  - Propuestas:
    - Estandarizar códigos y tipos de errores (filesystem, dependency, validation).
    - Añadir más metadatos en los errores (operation, filePath, template).
    - Registrar errores para debug (con verbosity).
  - Archivo: `src/errors/*`

- [ ] Documentación: ejemplos, guía de migración y API pública
  - Añadir:
    - Guía para migrar desde `commander`/`ora` a implementaciones propias.
    - API reference para `CLIBuilder`, `ProjectGenerator` y el sistema de plugins.
    - Ejemplos de templates y plugins.
  - Archivos: `README.md`, `CONTRIBUTING.md`, `examples/*`

- [ ] Tests y cobertura
  - Incrementar cobertura sobre:
    - `ProjectGenerator.generate` (falla en filesystem, hooks, instalación).
    - `CLIBuilder` prompts y parse (tests con `exitOverride`).
    - Validadores con `zod`.
  - Añadir tests de integración que simulen la generación de proyectos en un tmpdir.

- [ ] Añadir un modo "headless" / programático
  - Permitir consumir la librería desde código (no solo CLI) para automatización:
    - Exportar una API programática estable (ej. `generateFromTemplate(config)`).
  - Archivos: `src/index.ts`, `src/core/*`

- [ ] Mejorar UX de prompts
  - Soporte para:
    - Valores por defecto aplicados correctamente.
    - Validación en tiempo real (cuando aplique).
    - Mejor manejo de multiselect (teclas, atajos).
  - Archivos: `src/core/cli-builder.ts`, `src/core/readline-manager.ts`

- [ ] Registro de cambios automático / CHANGES generation
  - Generar changelog a partir de etiquetas y PRs para mantener `CHANGES.md` actualizado automáticamente en releases.

- [ ] CLI Autocompletion y contribuciones de shell
  - Añadir scripts para autocompletado en Bash/Zsh/Fish (con exportación desde el parser de comandos).

- [ ] Soporte offline para plantillas
  - Permitir empaquetar plantillas (tar/zip) e instalarlas sin conexión.

---

### Prioridad sugerida
1. Fixes críticos (default confirm, devDependencies typo) — alta
2. Abstracciones (UI/Spinner, package manager detection) — alta
3. Reescritura de validación con `zod` y tests — media/alta
4. Plugins y plantillas predefinidas — media
5. Docs, tests y CI — media
6. Reemplazo completo de dependencias por impl. propias — baja/mediana (trabajo mayor, dividir en etapas)

---

### Notas de implementación y convenciones
- Mantener API pública estable: cualquier cambio breaking debe ir acompañado de un CHANGELOG con instrucciones de migración.
- Al reemplazar `commander` o `ora`, proveer adaptadores que acepten la API actual para facilitar la transición.
- Añadir configuración opcional para inyectar implementaciones (`ui`, `spinner`, `commandParser`) en las clases principales.
- Preferir tests unitarios sobre mocks en lugar de integraciones con procesos reales cuando sea posible (ej. commander/ora).

---

### Definitions

¹ Implementaciones propias:
- `picocolors` → `@useful-libs/neocolors`
- `commander` → `my-custom-command`
- `ora` → `my-custom-ora`

---

Si quieres, puedo:
- Crear issues/PR templates para cada ítem priorizado.
- Generar un checklist con subtareas por item (estimaciones en horas / complejidad).
- Empezar implementando los fixes críticos (corrijo `devDependencies` y el confirm default) y preparar tests correspondientes.
