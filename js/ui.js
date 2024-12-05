
// ui.js
import { loadCommands } from './commands.js';

// Renderiza la tabla principal
export function renderTable(commands) {
    const tableBody = document.getElementById('commandsTable');

    if (commands.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No se encontraron resultados para la búsqueda.</td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = commands.map((command, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${command.name}</td>
                <td>${command.description}</td>
                <td>
                    <button class="details-button" data-command="${command.name}">Detalles</button>
                </td>
            </tr>
        `).join('');

        // Asocia eventos a los botones después de renderizar la tabla
        document.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const commandName = event.target.dataset.command;
                showDetails(commandName, commands);
                document.getElementById('search').style.display = 'none';
            });
        });
    }
}

// Muestra los detalles de un comando
export function showDetails(commandName, commands) {
    const detailsSection = document.getElementById('details');
    const mainTable = document.getElementById('mainTable');
    const detailsContent = document.getElementById('detailsContent');

    // Encuentra el comando seleccionado
    const command = commands.find(cmd => cmd.name === commandName);

    if (command) {
        detailsSection.dataset.currentCommand = commandName; // Guarda el comando actual
        detailsContent.innerHTML = `
            <h2>${command.name}</h2>
            <p>${command.description}</p>
            <table>
                <thead>
                    <tr>
                        <th>Parámetro</th>
                        <th>Descripción</th>
                        <th>Ejemplo</th>
                    </tr>
                </thead>
                <tbody>
                    ${command.parameters?.length
                ? command.parameters.map(param => `
                            <tr>
                                <td>${param.parameter}</td>
                                <td>${param.description}</td>
                                <td>${param.example}</td>
                            </tr>
                        `).join('')
                : `<tr><td colspan="3">No hay parámetros disponibles</td></tr>`}
                </tbody>
            </table>
        `;

        mainTable.style.display = 'none'; // Oculta la tabla principal
        detailsSection.style.display = 'block'; // Muestra los detalles
    }
}

// Filtra y renderiza la tabla según el término de búsqueda
export function searchCommand(query, commands) {
    const filteredCommands = query
        ? commands.filter(command =>
            command.name.toLowerCase().includes(query.toLowerCase()) ||
            command.description.toLowerCase().includes(query.toLowerCase())
        )
        : commands;

    renderTable(filteredCommands);
}

// Carga los comandos según la plataforma seleccionada
export async function loadCommandsForPlatform(platform) {
    const dataFile = `./data/${platform}.json`;

    try {
        const loadedCommands = await loadCommands(dataFile);
        renderTable(loadedCommands);
        return loadedCommands; // Retorna los comandos cargados
    } catch (error) {
        console.error(`Error al cargar los comandos para ${platform}:`, error);
        return [];
    }
}

