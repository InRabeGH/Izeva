# Política de seguridad

## Versiones soportadas

Este proyecto está en desarrollo activo y aún no ha tenido un release estable.
Mientras tanto, solo la rama `develop` recibe parches de seguridad.

| Versión | Soporte |
| --- | --- |
| `develop` (HEAD) | ✅ |
| Cualquier commit anterior | ❌ |

Cuando el proyecto haga su primer release `1.0.0` esta tabla se actualizará.

## Reportar una vulnerabilidad

**No abras un issue público.** Los issues son visibles para cualquiera y
podrían exponer la vulnerabilidad antes de que esté parcheada.

Reporta vulnerabilidades por uno de estos canales privados:

1. **GitHub Security Advisories (preferido)** — abre un reporte privado en
   https://github.com/InRabeGH/Izeva/security/advisories/new. Solo los
   mantenedores y tú pueden verlo hasta que decidamos publicarlo.
2. **Email** — a `rabe.edgar.gp@gmail.com` con el asunto
   `[security] Izeva: <título corto>`.

### Qué incluir en el reporte

- Descripción del problema y su impacto potencial
- Pasos para reproducir (idealmente un PoC mínimo)
- Versión / commit afectado
- Si tienes una propuesta de fix, agrégala — no es obligatorio

### Tiempos de respuesta

| Acción | Plazo |
| --- | --- |
| Acuse de recibo | ≤ 72 horas |
| Evaluación inicial (severidad, alcance) | ≤ 7 días |
| Plan de remediación o fix | ≤ 30 días para vulnerabilidades de alta severidad |
| Disclosure público | tras parchear, normalmente con un security advisory |

Te mantendré al tanto del avance y te daré crédito en el _security advisory_
salvo que prefieras permanecer anónimo.

## Buenas prácticas para colaboradores

- Nunca commitees secretos al repo. El `.env` está en `.gitignore` por una
  razón. Si crees que un secreto se filtró:
    1. Rota la credencial inmediatamente (Neon API key, OAuth secrets, etc.)
    2. Avisa por los canales privados de arriba — incluso si fue tu propio
       commit, queremos saberlo
- Usa la GitHub App de
  [secret scanning](https://docs.github.com/es/code-security/secret-scanning)
  (ya viene activa en repos públicos)
- Mantén las dependencias al día — Dependabot abrirá PRs cada lunes
- No deshabilites verificaciones de tipos o lints para "salir del paso";
  un `// eslint-disable` mal ubicado se convierte en deuda
