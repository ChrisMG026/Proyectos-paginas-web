document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const platilloSelect = document.getElementById('platillo-select');
    const complementoSelect = document.getElementById('complemento-select');
    const addPlatilloBtn = document.getElementById('add-platillo');
    const addComplementoBtn = document.getElementById('add-complemento');
    const enviarPedidoBtn = document.getElementById('enviar-pedido');
    const totalSpan = document.getElementById('total');
    const platillosSeleccionadosDiv = document.getElementById('platillos-seleccionados');
    const complementosSeleccionadosDiv = document.getElementById('complementos-seleccionados');
    const mensajeDiv = document.getElementById('mensaje');

    // Datos del pedido
    let platillos = [];
    let complementos = [];
    let total = 0;

    // Agregar platillo
    addPlatilloBtn.addEventListener('click', function() {
        const selectedOption = platilloSelect.options[platilloSelect.selectedIndex];
        
        if (selectedOption.value !== 'Selecciona') {
            const [nombre, precio] = selectedOption.value.split(' - ');
            platillos.push({ nombre, precio: parseFloat(precio) });
            actualizarSeleccionados();
            actualizarTotal();
        }
    });

    // Agregar complemento
    addComplementoBtn.addEventListener('click', function() {
        const selectedOption = complementoSelect.options[complementoSelect.selectedIndex];
        
        if (selectedOption.value !== 'Selecciona') {
            const [nombre, precio] = selectedOption.value.split(' - ');
            complementos.push({ nombre, precio: parseFloat(precio) });
            actualizarSeleccionados();
            actualizarTotal();
        }
    });

    // Enviar pedido
    enviarPedidoBtn.addEventListener('click', function() {
        if (platillos.length === 0) {
            mostrarMensaje('Por favor selecciona al menos un platillo', 'error');
            return;
        }

        const pedido = {
            platillos: platillos,
            complementos: complementos,
            total: total
        };

        fetch('../back-end/procesar_pedido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje('Pedido enviado con éxito!', 'success');
                resetearPedido();
            } else {
                mostrarMensaje('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al enviar el pedido', 'error');
        });
    });

    // Funciones auxiliares
    function actualizarSeleccionados() {
        platillosSeleccionadosDiv.innerHTML = '<h4>Platillos:</h4>' + 
            platillos.map(p => `<p>${p.nombre} - $${p.precio}</p>`).join('');
        
        complementosSeleccionadosDiv.innerHTML = '<h4>Complementos:</h4>' + 
            (complementos.length > 0 ? 
             complementos.map(c => `<p>${c.nombre} - $${c.precio}</p>`).join('') : 
             '<p>No hay complementos seleccionados</p>');
    }

    function actualizarTotal() {
        total = platillos.reduce((sum, p) => sum + p.precio, 0) + 
               complementos.reduce((sum, c) => sum + c.precio, 0);
        totalSpan.textContent = total.toFixed(2);
    }

    function resetearPedido() {
        platillos = [];
        complementos = [];
        total = 0;
        totalSpan.textContent = '0';
        platillosSeleccionadosDiv.innerHTML = '';
        complementosSeleccionadosDiv.innerHTML = '';
        platilloSelect.selectedIndex = 0;
        complementoSelect.selectedIndex = 0;
    }

    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = tipo;
        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.className = '';
        }, 3000);
    }
});