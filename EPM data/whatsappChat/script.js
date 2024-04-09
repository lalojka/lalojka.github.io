const messages = [
    { sender: "Leandro", text: "¡Buenas! ¿Les parece si dividimos los gastos?" },
    { sender: "Julian", text: "¡Sí! ¡Arranco!" },
    { sender: "Julian", text: "julian:300" },
    { sender: "Marcos", text: "julian:300,marcos:400" },
    { sender: "Fernando", text: "julian:300,marcos:400,<br><br>fernando:0" },
    { sender: "Carlos", text: "julian:300,marcos:400,<br><br>fernando:0,carlos:1000" },
    { sender: "Leandro", text: "julian:300,marcos:400,<br><br>fernando:0,carlos:1000,<br><br>leandro:0" },
    { sender: "Leandro", text: "¿Ya sumaron todos los gastos?" },
    { sender: "Leandro", text: "Les comparto la división:<br><br>Total gastado: 1700<br>Cantidad de personas: 5<br>Gasto promedio por persona: 340<br><br>Julian debe pagarle 40 a Marcos<br>Fernando debe pagarle 20 a Marcos y 320 a Carlos<br>Leandro debe pagarle 340 a carlos<br><br>" }

];

const chatContainer = document.getElementById('chat-container');

function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(message.sender === 'Leandro' ? 'outgoing' : 'incoming');

    const senderDiv = document.createElement('div');
    senderDiv.classList.add('sender');
    senderDiv.classList.add(message.sender);

    senderDiv.textContent = message.sender;
    messageDiv.appendChild(senderDiv);

    const messageTextDiv = document.createElement('div');
    messageTextDiv.classList.add('message-text');

    // Reemplaza los saltos de línea con elementos <br>
    const messageLines = message.text.split('\n');
    messageLines.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.innerHTML = line;
        messageTextDiv.appendChild(lineElement);
    });

    messageDiv.appendChild(messageTextDiv);

    chatContainer.appendChild(messageDiv);
}


function simulateConversation() {
    messages.forEach((message, index) => {
        setTimeout(() => {
            displayMessage(message);
        }, (index + 1) * 1000); // Mostrar cada mensaje con un segundo de diferencia
    });
}

// Iniciar la simulación de la conversación cuando la página se carga completamente
window.addEventListener('load', simulateConversation);
