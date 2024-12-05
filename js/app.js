import { loadCommands } from './commands.js';
import { renderTable, showDetails, resetSearch, searchCommand, searchDetails } from './ui.js';

let commands = [];

document.addEventListener('DOMContentLoaded', () => {
    const isLinux = window.location.pathname.includes('linux.html');
    const dataFile = isLinux ? './data/linux.json' : './data/windows.json';

    // Cargar los comandos
    loadCommands(dataFile).then(loadedCommands => {
        commands = loadedCommands; // Guarda los comandos
        renderTable(commands); // Renderiza la tabla
    });

    // Evento para mostrar los detalles de un comando
    document.getElementById('commandsTable').addEventListener('click', event => {
        if (event.target.dataset.command) {
            showDetails(event.target.dataset.command, commands); // Pasa los comandos a showDetails
        }
    });

    // Botón para volver a la tabla principal
    document.getElementById('backButton').addEventListener('click', () => {
        const detailsSection = document.getElementById('details');
        const mainTable = document.getElementById('mainTable');

        // Oculta la sección de detalles y muestra la tabla principal
        detailsSection.style.display = 'none';
        mainTable.style.display = 'block';
    });

    document.getElementById('search').addEventListener('input', () => {
        const query = document.getElementById('search').value.trim();

        const mainTable = document.getElementById('mainTable');
        const detailsSection = document.getElementById('details');

        if (mainTable.style.display !== 'none') {
            // Si la tabla principal está visible, busca en los comandos principales
            searchCommand(query, commands);
        } else if (detailsSection.style.display !== 'none') {
            // Si los detalles están visibles, busca en los parámetros del comando actual
            const commandName = detailsSection.dataset.currentCommand; // Asigna el nombre del comando actualmente mostrado
            const command = commands.find(cmd => cmd.name === commandName);

            if (command) {
                searchDetails(query, command.parameters || []);
            }
        }
    });
});


