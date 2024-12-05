// command.js - Código de los comandos
export async function loadCommands(file) {
    try {
        const response = await fetch(file);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los comandos:', error);
        return [];
    }
}
