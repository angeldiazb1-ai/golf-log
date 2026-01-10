# ✅ Golf Log — Checklist de Estabilidad y Regresión
Versión del checklist: v1.0  
Objetivo: Blindar las funciones existentes y evitar regresiones en cada actualización.

---

## 🔒 REGLA DE ORO
❗ **No se hace push a `main` si falla un solo punto de este checklist.**  
Cada cambio debe ser incremental y no romper lo ya validado.

---

## A) Infraestructura PWA / iPhone (OBLIGATORIO)
- [ ] La app abre correctamente en Safari iPhone (URL pública).
- [ ] Se puede **instalar** (Add to Home Screen).
- [ ] Abre como app independiente (sin barra de Safari).
- [ ] Funciona **offline** después de haber abierto al menos una vez online.
- [ ] Tras un `git push`, Safari carga la versión nueva (sin cache fantasma).

---

## B) Navegación / UI (OBLIGATORIO)
- [ ] Cambiar modo: Range ↔ Zona ↔ Evaluación ↔ Objetivo funciona siempre.
- [ ] Cambiar palo (Driver, 7i, PW, etc.) actualiza el botón activo.
- [ ] Cambiar dirección: Izq / Centro / Der.
- [ ] Orden en pantalla correcto: **Dirección → Distancia**.
- [ ] Tablas/historial no se salen de pantalla (scroll horizontal si aplica).

---

## C) Guardado / Persistencia de Datos (OBLIGATORIO)
- [ ] Guardar golpe con distancia válida (>0) funciona.
- [ ] Distancia vacía o inválida **no guarda** y no rompe la app.
- [ ] Recargar la página mantiene los tiros guardados.
- [ ] Botón **Deshacer** elimina el último tiro esperado.

---

## D) Reglas de Evaluación (OBLIGATORIO)

### D1. Modo Zona (rangos fijos 0–300 m)
- [ ] Zona seleccionable (0–300 m).
- [ ] Tiro menor al rango → **Corto**.
- [ ] Tiro dentro del rango → **OK**.
- [ ] Tiro mayor al rango → **Largo**.

### D2. Range / Evaluación / Objetivo (±5% por palo)
- [ ] Driver evalúa por ±5% correctamente.
- [ ] Hierros (ej. 7i) evalúan por ±5% correctamente.
- [ ] Evaluación es consistente en los tres modos.

### D3. Aprendizaje por palo
- [ ] Al llegar a **10 tiros del mismo palo**, el target se recalcula.
- [ ] Se indica visualmente que el palo está “aprendido”.
- [ ] El aprendizaje **no afecta** el modo Zona.

---

## E) Sesiones / Historial (OBLIGATORIO)
- [ ] Vista **Sesión** muestra solo los tiros de la sesión actual.
- [ ] Vista **Totales** muestra todos los tiros históricos.
- [ ] Botón **Nueva sesión**:
  - [ ] Limpia la vista Sesión
  - [ ] Conserva Totales
- [ ] Guardar un tiro en nueva sesión:
  - [ ] Aparece en Sesión
  - [ ] Se suma en Totales

---

## F) Compatibilidad y Migraciones (OBLIGATORIO SI HAY CAMBIOS INTERNOS)
- [ ] Cambios en `localStorage` incluyen migración automática.
- [ ] Tiros antiguos siguen visibles en Totales tras actualizar.
- [ ] No se pierde información histórica.

---

## G) Validación Final (ANTES DEL PUSH)
- [ ] Probado en Mac (Chrome o Safari).
- [ ] Probado en iPhone Safari.
- [ ] Probado en app instalada.
- [ ] Checklist completo revisado.

---

## 📌 NOTAS DE RELEASE
- Versión:
- Cambio principal:
- Cambios secundarios:
- Riesgos conocidos:
- Checklist validado por:
