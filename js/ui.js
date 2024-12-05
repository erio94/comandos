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
            });
        });
    }
}
export function showDetails(commandName, commands) {
    const detailsSection = document.getElementById('details');
    const mainTable = document.getElementById('mainTable');
    const detailsContent = document.getElementById('detailsContent');

    // Encuentra el comando seleccionado
    const command = commands.find(cmd => cmd.name === commandName);

    if (command) {
        // Guarda el comando actual en un atributo de la sección de detalles
        detailsSection.dataset.currentCommand = commandName;

        // Genera el contenido de los detalles
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
                <tbody id="detailsTableBody">
                    ${command.parameters && command.parameters.length > 0
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

        // Muestra la sección de detalles y oculta la tabla principal
        mainTable.style.display = 'none';
        detailsSection.style.display = 'block';
    }
}

export function searchDetails(query, parameters) {
    const detailsTableBody = document.getElementById('detailsTableBody');

    if (!query) {
        // Mostrar todos los parámetros si no hay búsqueda
        detailsTableBody.innerHTML = parameters.map(param => `
            <tr>
                <td>${param.parameter}</td>
                <td>${param.description}</td>
                <td>${param.example}</td>
            </tr>
        `).join('');
        return;
    }

    // Filtrar parámetros que coincidan con la búsqueda
    const filteredParameters = parameters.filter(param =>
        param.parameter.toLowerCase().includes(query.toLowerCase()) ||
        param.description.toLowerCase().includes(query.toLowerCase()) ||
        param.example.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredParameters.length === 0) {
        detailsTableBody.innerHTML = `
            <tr>
                <td colspan="3">No se encontraron resultados para la búsqueda.</td>
            </tr>
        `;
    } else {
        detailsTableBody.innerHTML = filteredParameters.map(param => `
            <tr>
                <td>${param.parameter}</td>
                <td>${param.description}</td>
                <td>${param.example}</td>
            </tr>
        `).join('');
    }
}



// Función de búsqueda
export function searchCommand(query, commands) {

    if (!query) {
        renderTable(commands); // Si no hay búsqueda, mostrar todos los comandos
        return;
    }
    // Filtrar los comandos que coincidan con la búsqueda
    const filteredCommands = commands.filter(command =>
        command.name.toLowerCase().includes(query.toLowerCase()) ||
        command.description.toLowerCase().includes(query.toLowerCase())
    );

    renderTable(filteredCommands);
}


export function resetSearch() {
    document.getElementById('search').value = ''; // Vaciar el campo de búsqueda

    const mainTable = document.getElementById('mainTable');
    const detailsSection = document.getElementById('details');

    if (mainTable.style.display !== 'none') {
        // Si la tabla principal está visible, renderizar todos los comandos
        renderTable(commands);
    } else if (detailsSection.style.display !== 'none') {
        // Si los detalles están visibles, mostrar todos los parámetros
        const commandName = detailsSection.dataset.currentCommand;
        const command = commands.find(cmd => cmd.name === commandName);

        if (command) {
            searchDetails('', command.parameters || []); // Limpiar búsqueda en parámetros
        }
    }
}

