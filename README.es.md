# Asistente de currículum

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md)

Herramienta local de diseño y exportación de currículums de SQHOME. Renderiza JSON compatible en el navegador, sin backend. Al abrirla se carga un ejemplo ficticio y localizado.

## Funciones

- Diseños profesional de dos columnas y clásico de una columna; encabezados estándar y con foto centrada.
- Interfaz en seis idiomas: chino simplificado, inglés, japonés, coreano, español y francés.
- Edita directamente el ejemplo o importa tu propio JSON. Los cambios se previsualizan al instante y se mantienen en la memoria de la página.
- Exporta HTML, JSON editado, PDF de una página o PDF paginado con la impresión del navegador.
- Visibilidad de secciones, temas de color, foto de perfil y zoom de vista previa.

### Capturas

**Espacio de trabajo**

![Configuración y vista previa del currículum](docs/images/app-overview.png)

**Editor**

![Editor de contenido del currículum](docs/images/editor.png)

## Ejecución local

Requiere Node.js 18 o posterior.

```sh
npm install
npm run dev
```

Abre la URL local que muestra Vite. Ejecuta `npm test` y `npm run build` para probar y compilar.

## Editar el ejemplo

El ejemplo localizado se carga al abrir la aplicación y se puede editar directamente. Pulsa **Editar contenido**, realiza los cambios y guárdalos. Usa **Descargar JSON** para conservar una copia. Si cambias de idioma mientras usas el ejemplo, se carga el ejemplo original de ese idioma. Si importaste tu propio JSON, cambiar el idioma no reemplaza su contenido.

## Obtener JSON de Resume.io

Puedes obtener el JSON de tu currículum desde una sesión autenticada de Resume.io:

1. Inicia sesión en [Resume.io](https://resume.io/).
2. En la misma sesión del navegador, abre [`https://resume.io/api/app/resumes`](https://resume.io/api/app/resumes) y localiza el `id` del currículum.
3. Abre `https://resume.io/api/app/resumes/{id}` sustituyendo `{id}` por ese valor. La respuesta contiene el JSON.
4. Guarda la respuesta como `resume.json` y selecciona **Importar JSON** en esta aplicación.

El endpoint usa tu sesión activa. No compartas respuestas que contengan datos personales o metadatos de la cuenta. Un `renderingToken` por sí solo no permite reconstruir el currículum; el endpoint de imágenes de Resume.io solo sirve la primera página.

Se admiten campos como `firstName`, `lastName`, `position`, `profile`, `workExperiences`, `educations`, `skills`, `languages`, `customSections` y `sectionsOrder`. Consulta [`examples/resume.sample.json`](examples/resume.sample.json) para ver la estructura completa.

## PDF

El PDF de una página ajusta todo el currículum a una hoja A4; en currículums largos el texto será más pequeño. El PDF paginado usa la impresión nativa del navegador. El nombre del archivo combina nombre, cargo, `Resume` y fecha. El PDF de una página se genera como imagen y el texto no se puede seleccionar.

Todo el procesamiento ocurre localmente en el navegador. Las URL de fotos requieren conexión a internet. Revisa el JSON antes de compartirlo; las descargas editadas conservan los campos desconocidos del archivo original.

## Licencia

[MIT License](LICENSE). Las dependencias y fuentes mantienen sus propias licencias. No se concede derecho de uso de la marca SQHOME.
