import { loadCommandsForPlatform, renderTable, searchCommand } from './ui.js';

let commands = []; // Variable global para los comandos
let currentPlatform = 'powershell'; // Por defecto PowerShell

document.addEventListener('DOMContentLoaded', () => {
    // Carga inicial de PowerShell
    loadCommandsForPlatform(currentPlatform).then(loadedCommands => {
        commands = loadedCommands; // Guarda los comandos cargados
    });

    // Cambiar entre plataformas
    document.getElementById('powershellButton').addEventListener('click', () => changePlatform('powershell'));
    document.getElementById('cmdButton').addEventListener('click', () => changePlatform('cmd'));
    document.getElementById('bashButton').addEventListener('click', () => changePlatform('bash'));

    // Evento para buscar
    document.getElementById('search').addEventListener('input', () => {
        const query = document.getElementById('search').value.trim();
        searchCommand(query, commands);
    });

    // Botón para volver
    document.getElementById('backButton').addEventListener('click', () => {
        document.getElementById('details').style.display = 'none';
        document.getElementById('mainTable').style.display = 'block';
        // Mostrar el buscador principal
        document.getElementById('search').style.display = 'inline-block';
        renderTable(commands); // Mostrar todos los comandos
    });
});

function changePlatform(platform) {
    if (currentPlatform !== platform) {
        currentPlatform = platform;
        loadCommandsForPlatform(platform).then(loadedCommands => {
            commands = loadedCommands; // Actualiza la lista de comandos
        });
    }
}
