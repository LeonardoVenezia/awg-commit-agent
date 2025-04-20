#! /usr/bin/env node
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import readline from 'readline';
import shell from 'shelljs';

const aiModel = "gemini-1.5-flash";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Create readline interface outside the function so it can be reused
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

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

async function aiResponse(userInput) {
  const response = await genAI.models.generateContent({
    model: aiModel,
    contents: `Como experto en Git y siguiendo las especificaciones de Conventional Commits, analiza el siguiente texto de commit y genera un mensaje de commit válido en inglés plano. Si la información proporcionada es insuficiente para crear un commit lógico respondiedo exactamente invalid input, indica que se requiere información adicional. Evita explicaciones y respuestas especulativas.
    Texto del commit: "${userInput}"`,
  }).then(response => response.text);

  return response.trim().toLowerCase().includes('invalid input')
    ? 'invalid input'
    : response;
}

async function commitReader(isRetry = false) {
  try {
    // Prompt for user input with different messages for initial try vs retry
    const promptMessage = isRetry
      ? 'Ingresa los cambios realizados en el commit con mayor detalle: '
      : 'Ingresa los cambios realizados en el commit: ';

    const userInput = await askQuestion(promptMessage);

    console.log('\n------------------------------------------------------------------')
    console.log(`     Generando conventional commit utilizando ${aiModel}  `)
    console.log('------------------------------------------------------------------\n')

    const responseText = await aiResponse(userInput);

    if (responseText === 'invalid input') {
      console.log('Descripcion de commit inválida!');
      // Recursively call the function with retry flag
      return await commitReader(true);
    } else {
      console.log('Commit válido: \n', responseText);
      // Execute git commands
      shell.exec('git status');
      // Success - close readline and return the response
      rl.close();
      return responseText;
    }

  } catch (error) {
    console.error('Error:', error);
    // On error, give option to retry
    const retryResponse = await askQuestion('¿Deseas intentar nuevamente? (s/n): ');
    if (retryResponse.toLowerCase() === 's') {
      return await commitReader(true);
    } else {
      rl.close();
      return null;
    }
  }
}

// Main execution
commitReader().then(result => {
  if (result === null) {
    console.log('Proceso terminado por el usuario.');
  }
}).catch(error => {
  console.error('Error fatal:', error);
  rl.close();
});
