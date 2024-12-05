window.onload = function () {

    const tableBody = document.getElementById('commandsTable');

    // Consulta fetch para cargar comandos desde el JSON
    fetch('./comandos/allcommands.json')
        .then(response => response.json())
        .then(data => {
            // Recorrer y agregar filas a la tabla
            let i = 1;
            data.forEach((command, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="num" data-label="#">${i}</td>
                    <td data-label="PowerShell">${command.powershell || 'N/A'}</td>
                    <td data-label="Descripción">${command.p_description || 'N/A'}</td>
                    <td data-label="Ejemplo">
                        <span>${command.p_example || 'N/A'}</span>
                        ${command.p_example ? `<button onclick="copyToClipboard('${command.p_example}')">Copiar</button>` : ''}
                    </td>
                    <td class="num" data-label="#">${i}</td>
                    <td data-label="CMD">${command.cmd || 'N/A'}</td>
                    <td data-label="Descripción">${command.c_description || 'N/A'}</td>
                    <td data-label="Ejemplo">
                        <span>${command.c_example || 'N/A'}</span>
                        ${command.c_example ? `<button onclick="copyToClipboard('${command.c_example}')">Copiar</button>` : ''}
                    </td>
                `;
                tableBody.appendChild(row);
                i++;
            });
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
};

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Texto copiado al portapapeles');
}

// Función para buscar comandos
function searchCommand() {
    const search = document.getElementById('search');
    const term = search.value.trim().toLowerCase();
    const tableBody = document.getElementById('commandsTable');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Función para limpiar el buscador
function resetSearch() {
    const search = document.getElementById('search');
    search.value = '';
    const tableBody = document.getElementById('commandsTable');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}