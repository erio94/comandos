
// ui.js
import { loadCommands } from './commands.js';
// Renderiza la tabla principal
export function renderTable(commands) {
    const tableBody = document.getElementById('commandsTable');

    if (!tableBody) {
        console.error('Error: El elemento commandsTable no está disponible en el DOM.');
        return;
    }

    if (commands.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No se encontraron resultados para la búsqueda.</td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = commands
            .map((command, i) => {
                // Limpia los espacios en los datos antes de renderizar
                const name = cleanSpaces(command.name || 'Sin nombre');
                const description = cleanSpaces(command.description || 'Sin descripción');
                return `
                <tr>
                    <td>${i + 1}</td>
                    <td>${name}</td>
                    <td>${description}</td>
                    <td>
                        <button class="details-button" data-command="${name}">Detalles</button>
                    </td>
                </tr>
            `;
            })
            .join('');

        // Asocia eventos a los botones después de renderizar la tabla
        document.querySelectorAll('.details-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const commandName = event.target.dataset.command;
                showDetails(commandName, commands);
                document.getElementById('search').style.display = 'none';
            });
        });
    }
}



export function renderComparisonTable(data) {
    const tableBody = document.getElementById('comparisonTableBody');

    if (!tableBody) {
        console.error('Error: El elemento comparisonTableBody no está disponible en el DOM.');
        return;
    }

    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7">No hay datos disponibles para la tabla comparativa.</td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = data
            .map(
                (row, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${row.powershell || 'N/A'}</td>
                <td>${row.p_description || 'N/A'}</td>
                <td>${row.p_example || 'N/A'}</td>
                <td>${row.cmd || 'N/A'}</td>
                <td>${row.c_description || 'N/A'}</td>
                <td>${row.c_example || 'N/A'}</td>
            </tr>
        `
            )
            .join('');
    }
}

// Muestra los detalles de un comando
export function showDetails(commandName, commands) {
    const detailsSection = document.getElementById('details');
    const mainTable = document.getElementById('mainTable');
    const detailsContent = document.getElementById('detailsContent');

    // Encuentra el comando seleccionado
    const command = commands.find(cmd => cleanSpaces(cmd.name) === cleanSpaces(commandName));

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
export function searchCommand(query, commands, isComparison = false) {
    const filteredCommands = query
        ? commands.filter((command) => {
            if (isComparison) {
                return (
                    (command.powershell && command.powershell.toLowerCase().includes(query.toLowerCase())) ||
                    (command.p_description &&
                        command.p_description.toLowerCase().includes(query.toLowerCase())) ||
                    (command.p_example && command.p_example.toLowerCase().includes(query.toLowerCase())) ||
                    (command.cmd && command.cmd.toLowerCase().includes(query.toLowerCase())) ||
                    (command.c_description &&
                        command.c_description.toLowerCase().includes(query.toLowerCase())) ||
                    (command.c_example && command.c_example.toLowerCase().includes(query.toLowerCase()))
                );
            } else {
                return (
                    (command.name && command.name.toLowerCase().includes(query.toLowerCase())) ||
                    (command.description && command.description.toLowerCase().includes(query.toLowerCase()))
                );
            }
        })
        : commands;

    if (isComparison) {
        renderComparisonTable(filteredCommands);
    } else {
        renderTable(filteredCommands);
    }
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

// Limpia espacios innecesarios y controla longitudes
function cleanSpaces(input, maxLength = 5000) {
    if (typeof input !== 'string') return input; // Devuelve sin cambios si no es una cadena
    const cleanedInput = input.trim().replace(/\s+/g, ' ');
    return cleanedInput.length > maxLength ? 'Sin descripción' : cleanedInput;
}


// Añade evento a los botones del menú
document.addEventListener("DOMContentLoaded", () => {
    const titleTable = document.getElementById("titleTable");

    // Selecciona todos los botones de la navegación
    const navButtons = document.querySelectorAll("header nav button");

    // Asocia un evento de clic a cada botón
    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Cambia el contenido del h3 con el título del botón
            const buttonTitle = button.innerText || button.textContent;
            titleTable.textContent = buttonTitle; // Actualiza el texto del h3
        });
    });
});
