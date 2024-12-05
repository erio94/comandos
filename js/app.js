import { loadCommands } from './commands.js';
import {
    loadCommandsForPlatform,
    renderTable,
    searchCommand,
    renderComparisonTable,
} from './ui.js';

let commands = []; // Variable global para los comandos
let currentPlatform = 'powershell'; // Plataforma actual por defecto
let isComparisonTable = false; // Controla si la tabla activa es la comparativa

document.addEventListener('DOMContentLoaded', () => {
    // Cargar la tabla inicial (PowerShell)
    loadCommandsForPlatform(currentPlatform).then((loadedCommands) => {
        commands = loadedCommands;
        renderTable(commands); // Renderizar la tabla inicial
        showTable('mainTable'); // Asegurarse de mostrar la tabla principal
    });

    // Eventos para cambiar entre plataformas
    document.getElementById('powershellButton').addEventListener('click', () => changePlatform('powershell'));
    document.getElementById('cmdButton').addEventListener('click', () => changePlatform('cmd'));
    document.getElementById('cmdletsButton').addEventListener('click', () => changePlatform('cmdletsinfo'));
    document.getElementById('bashButton').addEventListener('click', () => changePlatform('bash'));
    document.getElementById('compareButton').addEventListener('click', () => loadComparisonTable());

    // Evento para buscar comandos
    document.getElementById('search').addEventListener('input', () => {
        const query = document.getElementById('search').value.trim();
        searchCommand(query, commands, isComparisonTable);
    });

    // Botón para volver
    document.getElementById('backButton').addEventListener('click', () => {
        document.getElementById('details').style.display = 'none';
        showTable('mainTable');
        document.getElementById('search').style.display = 'inline-block'; // Mostrar el buscador
        renderTable(commands); // Restaurar la tabla principal
    });
});

// Cambiar la plataforma activa
function changePlatform(platform) {
    if (currentPlatform !== platform) {
        currentPlatform = platform;
        isComparisonTable = false; // No es la tabla comparativa

        // Mostrar buscador solo para tablas que lo necesiten
        document.getElementById('search').style.display = 'inline-block';

        // Cargar y renderizar la tabla para la nueva plataforma
        loadCommandsForPlatform(platform).then((loadedCommands) => {
            commands = loadedCommands;
            renderTable(commands);
            showTable('mainTable');
        });
    }
}

// Cargar y mostrar la tabla comparativa
function loadComparisonTable() {
    const dataFile = './data/cmdlets_comparison.json';
    loadCommands(dataFile).then((data) => {
        renderComparisonTable(data);
        commands = data; // Actualiza los comandos cargados
        isComparisonTable = true; // Marca que la tabla activa es la comparativa
        document.getElementById('search').style.display = 'inline-block'; // Habilita el buscador
        showTable('comparisonTable'); // Mostrar la tabla comparativa
    });
}

// Mostrar una tabla específica
function showTable(tableId) {
    // Ocultar todas las tablas
    document.getElementById('mainTable').style.display = 'none';
    document.getElementById('comparisonTable').style.display = 'none';

    // Mostrar la tabla específica
    document.getElementById(tableId).style.display = 'block';
}
