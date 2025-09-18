# Consulta de Resultados – UCSP (Google Apps Script)

Este proyecto implementa un sistema web de consulta de resultados de admisión, 
integrado con Google Sheets y desplegado como WebApp con Google Apps Script.

## 🚀 Funcionalidades
- Login de postulantes (documento + contraseña = DNI).
- Cálculo de ranking dinámico por programa (OP1).
- Validación de puntaje mínimo de ingreso.
- Interfaz moderna en HTML + TailwindCSS.
- Confetti 🎉 si el postulante aprueba.

## 📂 Estructura
src/
├── Code.gs # Lógica en Apps Script (backend)
└── index.html # Interfaz web (frontend)

markdown
Copiar código

## ⚙️ Tecnologías
- Google Apps Script (JS)
- Google Sheets como base de datos
- HTML + TailwindCSS
- Confetti.js

## 📖 Cómo usar
1. Crea un nuevo proyecto en [Google Apps Script](https://script.google.com/).
2. Copia `Code.gs` al editor.
3. Crea un archivo HTML en Apps Script y pega `index.html`.
4. Reemplaza el ID de tu Google Sheet en `SpreadsheetApp.openById("...")`.
5. Despliega como Web App (**Deploy → New deployment → Web App**).

## 📌 Nota
Este proyecto es de carácter educativo y está adaptado para procesos de admisión.
