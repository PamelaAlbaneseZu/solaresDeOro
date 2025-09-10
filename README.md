# Solares de Oro — Proyecto Frontend (sin backend)
Empresa hotelera 

Bienvenido/a a la **última versión** del sitio web de la cadena hotelera **Solares de Oro**.  
Este proyecto está hecho **100% en Frontend** (HTML, CSS y JavaScript) y **no requiere backend**.  
La persistencia se simula con **localStorage** del navegador.

---

## ✨ Características principales

- **Inicio** con héroe, CTA y **habitaciones destacadas**.
  - Hero (héroe): nombre de patrón de diseño para la sección superior destacada (no es una etiqueta HTML). En este proyecto se implementa con <section>.
  - CTA (Call To Action): enlaces/botones que invitan a una acción clave (Reservar ahora, Ver sucursales). Aquí se usan hipervínculos dentro del hero.
- **Sucursales (8 en total)** con tarjetas y **carrusel de 3 imágenes** por sucursal.
- **Detalle de sucursal**: tabla de habitaciones con **precio/noche**, **personas**, **noches** y **fecha** + botón **“Añadir a reservas”**.
- **Reservas**: listado con columnas **(Sucursal, Tipo, Fecha, Personas, Noches, Precio, Total)**, quitar y confirmar (demo).
- **Login + Registro (sin backend)**:
  - Usuarios con dominios permitidos: `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`.
  - **Administrador especial**: `admin@solaresdeoro.cl` (contraseña **cualquiera** de 4–10 chars).
- **Panel de Administrador** (solo si inicias sesión como admin) con:
  - **Panel** (métricas rápidas).
  - **Reservas** (vista de reservas guardadas).
  - **Precios** (modificación local por sucursal/tipo).
  - **Habitaciones** (añadir/editar/eliminar).
  - **Sucursales** (crear sucursales locales referenciando imágenes existentes).
  - **Trabajadores** (ABM básico con validación de RUT).
- **Contacto** con formulario de ejemplo (demo).
- **Diseño responsive**, colores **pasteles** y **enlaces** del menú **más oscuros**.
- **Logo grande** junto al nombre en la barra superior.

> **Importante**: toda la información editable desde el panel de administrador y las reservas se guardan **solo en localStorage** (del navegador actual).

---

## 📁 Estructura del proyecto

```
raíz-del-proyecto/
├─ index.html
├─ sucursales.html
├─ sucursal.html
├─ reservas.html
├─ administrador.html
├─ admin.html
├─ login.html
├─ contacto.html
├─ styles.css
├─ app.js
├─ data/
│  └─ data.js           # Datos base de sucursales, imágenes y habitaciones
└─ assets/
   └─ imagenes_proyecto/
      ├─ hotel antofagasta/
      │  ├─ fachada.jpg
      │  ├─ lobby.jpg
      │  └─ cuarto.jpg
      ├─ hotel arica/
      │  └─ ...
      └─ ... (resto de sucursales)
```

> **Nota**: Los nombres de carpetas/archivos en `assets/imagenes_proyecto/` pueden variar según tus imágenes. Asegúrate de que **coincidan** con las rutas definidas en `data/data.js`.

---

## ▶️ Cómo ejecutar el proyecto

1. **Descarga y descomprime** el proyecto.
2. Abre **`index.html`** en tu navegador (doble clic suele ser suficiente).
3. (Opcional) Para mejor experiencia, usa **Live Server** de VS Code o cualquier servidor estático.

> No necesitas instalar nada más. No hay dependencias externas ni backend.

---

## 🔐 Credenciales y flujo de acceso

- **Administrador**  
  - Usuario: `admin@solaresdeoro.cl`  
  - Contraseña: **cualquiera** entre 4 y 10 caracteres.  
  - Acceso: `Login` → **Administrador** → verás el **Panel** y los módulos (Reservas, Precios, Habitaciones, Sucursales, Trabajadores).

- **Usuario registrado (demo)**  
  - Ve a `Login` → sección **Registrarse**.  
  - Dominios permitidos: `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`.  
  - Tras registrarte, inicia sesión y navega normalmente (no tendrás acceso al panel admin).

---

## 🧭 Navegación y páginas

- **Inicio (`index.html`)**  
  Héroe, CTA principales y “Habitaciones destacadas”.

- **Sucursales (`sucursales.html`)**  
  Mosaico de 8 sucursales con **carrusel de 3 imágenes** y **precio “desde”**. Enlace a **Detalle**.

- **Detalle de sucursal (`sucursal.html`)**  
  Tabla con **Tipo**, **Precio (CLP/noche)**, **Capacidad**, campos de **Personas**, **Noches** y **Fecha**.  
  Botón **“Añadir”** que guarda la reserva (con total calculado) en `localStorage`.

- **Reservas (`reservas.html`)**  
  Muestra el listado completo de reservas (incluye **Fecha**), permite **quitar** y **confirmar** (demo).

- **Login (`login.html`)**  
  Inicio de sesión + **Registro** (demo sin backend).

- **Administrador (`admin.html` y `administrador.html`)**  
  - **Panel** con métricas (sucursales, reservas, habitaciones, trabajadores).
  - **Reservas**: lectura de reservas guardadas.
  - **Precios**: edición local por sucursal/tipo.
  - **Habitaciones**: alta/edición/baja por sucursal.
  - **Sucursales**: alta local de sucursales (elige imágenes ya existentes).
  - **Trabajadores**: alta/baja, con validación de RUT simple (`11111111-1`).

- **Contacto (`contacto.html`)**  
  Formulario de ejemplo (envío simulado).

---

## 💾 Persistencia (localStorage)

Estas claves se usan en el navegador:

- `so_reservas` → array de reservas del cliente (cada item incluye: sucursal, tipo, personas, noches, **fecha**, **precio**, **total**).
- `so_users` → usuarios registrados (demo).
- `so_admin` → flag de sesión admin (`'1'` si está logueado como admin).
- `so_admin_data` → copia editable de datos para **precios/habitaciones/sucursales** desde el panel admin (demo local).
- `so_trabajadores` → listado de trabajadores (demo local).

> **Limitación**: al borrar caché/datos del navegador, se pierde esta información. No hay sincronización entre dispositivos.

---

## 🖼️ Imágenes y logo

- Las imágenes están dentro de `assets/imagenes_proyecto/...` organizadas por sucursal (3 por sucursal).  
- El **logo** se muestra grande (96×96 px) junto al nombre **Solares de Oro**.
- Si agregas imágenes nuevas, respeta rutas y nombres en `data/data.js` o créalas desde el módulo **Sucursales** del administrador (referenciando archivos existentes).

**Recomendaciones**:
- Evita tildes/caracteres extraños extremos en nombres de archivo.
- Cuida mayúsculas/minúsculas: en web “`Foto.JPG`” ≠ “`foto.jpg`”.

---

## 🛠️ Personalización rápida

- **Colores/enlaces/logo** → `styles.css`  
- **Textos y copy** → archivos `.html` correspondientes  
- **Precios/capacidades por defecto** → `data/data.js` (o desde **Administrador → Precios/Habitaciones**)  
- **Sucursales por defecto** → `data/data.js` (o desde **Administrador → Sucursales**)  

---

## ❗ Solución de problemas comunes

- **“No se ven las imágenes”**  
  - Revisa que la ruta comience con `assets/imagenes_proyecto/...`  
  - Verifica mayúsculas/minúsculas y espacios en nombres de archivos/carpetas.  
  - Confirma que esas rutas están referenciadas en `data/data.js`.

- **“No puedo entrar al Administrador”**  
  - Inicia sesión con `admin@solaresdeoro.cl` (contraseña 4–10 caracteres).  
  - El enlace **Administrador** redirige a `login.html` si no eres admin.

- **“No se guardan cambios”**  
  - Recuerda que todo se guarda en **localStorage** del navegador actual.  
  - Si borras caché/datos, se perderán.

---

## 📜 Licencia / uso educativo

Proyecto pensado para **uso educativo/demostrativo**. Puedes adaptarlo libremente a tus necesidades.

---

## 👩‍💻 Autora del encargo

**Pamela** — Estudiante de Ingeniería en Informática.  
Este README acompaña la entrega **final** con las últimas correcciones (logo grande, enlaces oscuros, imágenes operativas, reservas con fecha, registro y panel admin).
