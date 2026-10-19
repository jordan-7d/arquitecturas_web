# Microservicios: arquitectura desacoplada

Recurso educativo responsivo sobre los fundamentos de la arquitectura de software basada en microservicios. Incluye un diagrama de ejemplo, un reproductor de video local y un cuestionario interactivo.

## Estructura

- `index.html`: contenido y estructura semántica.
- `css/styles.css`: estilos responsivos y personalizados.
- `js/script.js`: carga local del video y lógica del cuestionario.
- `assets/images/` y `assets/videos/`: directorios opcionales para recursos locales del proyecto.

Bootstrap 5 y Bootstrap Icons se cargan desde CDN; no se requiere instalar dependencias.

## Ejecutar localmente

Abre `index.html` en un navegador moderno. Para servirlo mediante HTTP local, ejecuta desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Reproducir un video

En la sección **Aprende con un video**, selecciona un archivo MP4 o WebM de tu dispositivo. Se reproduce localmente en el navegador y no se envía ni guarda en un servidor. Para distribuir videos entre visitantes se necesita un backend o un servicio de almacenamiento.
