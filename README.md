# 🌤️ Tiempo Valencia · Neo-Glass Weather

Una aplicación meteorológica en tiempo real con diseño glassmorphism, centrada en **Valencia y España**. Usa datos meteorológicos reales de la API pública de **Open-Meteo** — sin necesidad de clave de acceso.

**[Ver demo en GitHub Pages →](https://salvagar.github.io/dynamic-weather-webapp/)**

---

## ¿Qué es?

Aplicación web de una sola página (SPA) que muestra el tiempo actual y la previsión para las principales ciudades de España. Construida con HTML, CSS y JavaScript puros — sin frameworks, sin dependencias de servidor.

### Características

- **Tiempo real** — datos actualizados directamente desde Open-Meteo
- **Centrada en España** — Valencia como ciudad principal, con Madrid, Barcelona, Sevilla, Bilbao y más
- **Sin API key** — la API de Open-Meteo es completamente gratuita y pública
- **Previsión a 10 días** — temperaturas máximas/mínimas, probabilidad de lluvia
- **Previsión horaria** — gráfico de temperatura por horas con icono meteorológico
- **Calidad del aire** — índice US AQI en tiempo real (Copernicus / Open-Meteo)
- **Radar visual** — mapa estilizado con ciudades españolas y control de capas
- **Búsqueda de ciudades** — geocodificación en español vía Open-Meteo Geocoding API
- **Geolocalización** — botón para usar la ubicación actual del dispositivo
- **Diseño glassmorphism** — fondos dinámicos según la condición meteorológica
- **Totalmente responsivo** — adaptado a móvil, tablet y escritorio
- **Desplegado en GitHub Pages** — con GitHub Actions

---

## Fuentes de datos

| Dato | API | Coste |
|------|-----|-------|
| Tiempo actual y previsión | [Open-Meteo Forecast API](https://open-meteo.com/en/docs) | Gratuito |
| Geocodificación de ciudades | [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) | Gratuito |
| Calidad del aire (AQI) | [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) | Gratuito |

> **Similar a AEMET Open Data** en cuanto a precisión para España — Open-Meteo integra modelos ECMWF, GFS, Copernicus y otros de alta calidad europeos.

---

## Vistas

### Inicio
- Temperatura actual en °C
- Condición meteorológica con icono
- Viento (km/h), Humedad (%), Índice UV, Sensación térmica
- Previsión horaria scrollable
- Calidad del aire con indicador visual

### Previsión
- Gráfico SVG de temperatura por horas
- Lista de los próximos 10 días con barras de temperatura
- Panel lateral con horarios de amanecer/atardecer

### Radar
- Mapa estilizado centrado en la Península Ibérica
- Marcadores de ciudades principales
- Animación de precipitación con control de tiempo
- Capas: Precipitación, Temperatura, Viento, Nubes

### Ciudades
- Tarjetas de ciudades guardadas con temperatura en tiempo real
- Buscador de ciudades con autocompletado en español
- Botón de ubicación actual

---

## Tecnologías

- **HTML5 / CSS3 / JavaScript** (ES2022+) — sin frameworks
- **[Tailwind CSS](https://tailwindcss.com/)** via CDN
- **[Lucide Icons](https://lucide.dev/)** via CDN
- **[Google Fonts — Inter](https://fonts.google.com/specimen/Inter)**
- **[Open-Meteo](https://open-meteo.com/)** — API meteorológica de código abierto

---

## Despliegue local

```bash
# Clona el repositorio
git clone https://github.com/SalvaGaR/dynamic-weather-webapp.git
cd dynamic-weather-webapp

# Abre directamente en el navegador
open index.html

# O usa un servidor local simple
npx serve .
# o
python3 -m http.server 8080
```

No se necesita proceso de build ni variables de entorno.

---

## Despliegue en GitHub Pages

El proyecto incluye un workflow de **GitHub Actions** que despliega automáticamente en GitHub Pages cada vez que se hace push a la rama `main`.

### Configuración

1. Ve a **Settings → Pages** en tu repositorio de GitHub
2. En **Source**, selecciona **GitHub Actions**
3. Haz push a `main` — el workflow se ejecuta automáticamente

El archivo de workflow está en `.github/workflows/pages.yml`.

### URL del sitio

```
https://<tu-usuario>.github.io/dynamic-weather-webapp/
```

---

## Estructura del proyecto

```
dynamic-weather-webapp/
├── index.html                  # Aplicación completa (HTML + CSS + JS)
├── .github/
│   └── workflows/
│       └── pages.yml           # GitHub Actions: despliegue a GitHub Pages
├── LICENSE                     # MIT License
└── README.md                   # Este archivo
```

---

## Variables y configuración

No se necesita ninguna variable de entorno ni clave de API. Todo funciona de forma inmediata.

Para cambiar la ciudad por defecto, edita estas líneas en `index.html`:

```javascript
let state = {
  currentCity: 'Valencia',
  currentLat : 39.4699,
  currentLon : -0.3763,
  // ...
};
```

---

## Licencia

[MIT](LICENSE) — libre para usar, modificar y distribuir.
