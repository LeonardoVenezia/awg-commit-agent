#! /usr/bin/env node
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import shell from 'shelljs';

const aiModel = "gemini-1.5-flash";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log('\n\n');
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log('++++++++++++++    APPS COMMIT BOT     +++++++++++++++');
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log('\n');
console.log('                     █████████                       ');
console.log('                   ██         ██                     ');
console.log('                  ██           ██                    ');
console.log('                 ██             ██                   ');
console.log('                ██               ██                  ');
console.log('               ██                 ██                 ');
console.log('              ██                   ██                ');
console.log('             ██         ███         ██               ');
console.log('            ██        ██   ██        ██              ');
console.log('           ██                         ██             ');
console.log('          ██                           ██            ');
console.log('         ██                             ██           ');
console.log('        ██                               ██          ');
console.log('       ██                                 ██         ');
console.log('       ██                                  █         ');
console.log('       █               █████               █         ');
console.log('       ██           ███     ███           ██         ');
console.log('        ███      ███           ███      ███          ');
console.log('           ██████                 ██████             ');
console.log('\n');
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log('\n');

async function aiResponse(diff) {
  const response = await genAI.models.generateContent({
    model: aiModel,
    contents: `Como experto en Git y siguiendo las especificaciones de Conventional Commits, analiza el siguiente diff de Git y genera un mensaje de commit válido en inglés plano. Si la información proporcionada es insuficiente para crear un commit lógico respondiedo exactamente invalid input, indica que se requiere información adicional. Evita explicaciones y respuestas especulativas.
    Diff de Git: "${diff}"`,
  }).then(response => response.text);

  return response.trim().toLowerCase().includes('invalid input')
    ? 'invalid input'
    : response;
}

async function generateCommit() {
  try {
    console.log('Obteniendo el diff de los cambios...');
    const diff = shell.exec('git diff --cached', { silent: true }).stdout;
console.log('aveeeer:', diff);
    if (!diff.trim()) {
      console.log('No hay cambios para commitear.');
      return;
    }

    console.log('\n------------------------------------------------------------------');
    console.log(`     Generando conventional commit utilizando ${aiModel}  `);
    console.log('------------------------------------------------------------------\n');

    const responseText = await aiResponse(diff);

    if (responseText === 'invalid input') {
      console.log('El diff no contiene suficiente información para generar un commit válido.');
    } else {
      console.log('Commit válido generado automáticamente: \n', responseText);
      // Ejecutar comandos de Git
      shell.exec('git add .');
      shell.exec(`git commit -m "${responseText}"`);
      console.log('Commit realizado con éxito.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Main execution
generateCommit();