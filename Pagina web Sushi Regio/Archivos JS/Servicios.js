document.addEventListener('DOMContentLoaded', () => {
    const platillosContainer = document.getElementById('platillos-container');
    const addPlatilloButton = document.getElementById('add-platillo');
    const totalElement = document.getElementById('total');

    let total = 0;

    addPlatilloButton.addEventListener('click', () => {
        const selectedPlatillo = platillosContainer.querySelector('.platillo');
        const selectedOption = selectedPlatillo.options[selectedPlatillo.selectedIndex];

        if (selectedOption && selectedOption.value !== 'Selecciona') {
            const price = parseInt(selectedOption.textContent.split('$')[1]);
            total += price;
            totalElement.textContent = total;
        }
    });
});

document.getElementById('add-platillo').addEventListener('click', function() {
    const container = document.getElementById('platillos-container');
    const platilloCount = container.getElementsByClassName('platillo-group').length;

    if (platilloCount < 5) {
        const newPlatilloGroup = document.createElement('div');
        newPlatilloGroup.classList.add('platillo-group');
        newPlatilloGroup.innerHTML = `
            <label for="platillo">Platillos:</label>
            <select name="platillo" class="platillo">
                <option value="Selecciona" disabled selected>Selecciona un platillo</option>
                <option value="Sushi Norteño Ahumado">Sushi Norteño Ahumado - $150</option>
                <option value="Cono Regio">Cono Regio - $120</option>
                <option value="Sushi de Res Tataki">Sushi de Res Tataki - $180</option>
                <option value="Sushi de Fajita o Pastor">Sushi de Fajita o Pastor - $140</option>
                <option value="Sushi Empanizado con Tocino">Sushi Empanizado con Tocino - $160</option>
                <option value="Sushi Regio">Sushi Regio - $170</option>
                <option value="Sushi de Charro Roll">Sushi de Charro Roll - $150</option>
                <option value="Sushi de Cabrito Maki">Sushi de Cabrito Maki - $190</option>
                <option value="Sushi Sinaloa Crunch">Sushi Sinaloa Crunch - $130</option>
            </select>
        `;
        container.appendChild(newPlatilloGroup);
    } else {
        alert('Solo puedes agregar hasta 5 platillos.');
    }
});

function getPlatilloCount() {
    return document.getElementById('platillos-container').getElementsByClassName('platillo-group').length;
}

document.getElementById('add-complemento').addEventListener('click', function() {
    const container = document.getElementById('complementos-container');
    const complementoCount = container.getElementsByClassName('complemento-group').length;
    const platilloCount = getPlatilloCount();
    const maxComplementos = platilloCount * 2;

    if (complementoCount < maxComplementos) {
        const newComplementoGroup = document.createElement('div');
        newComplementoGroup.classList.add('complemento-group');
        newComplementoGroup.innerHTML = `
            <label for="complemento">Complementos:</label>
            <select name="complemento" class="complemento">
                <option value="Selecciona" disabled selected>Selecciona un complemento</option>
                <option value="Guacamole">Guacamole - $50</option>
                <option value="Salsa de Aguacate">Salsa de Aguacate - $40</option>
                <option value="Salsa de Chipotle">Salsa de Chipotle - $30</option>
                <option value="Salsa de Mango">Salsa de Mango - $35</option>
                <option value="Salsa de Tamarindo">Salsa de Tamarindo - $35</option>
                <option value="Salsa de Chile Habanero">Salsa de Chile Habanero - $40</option>
            </select>
        `;
        container.appendChild(newComplementoGroup);
    } else {
        alert(`Solo puedes agregar hasta ${maxComplementos} complementos, basado en los platillos seleccionados.`);
    }
});

function calculateTotal() {
    let total = 0;

    // Sumar precios de los platillos
    const platillos = document.querySelectorAll('#platillos-container .platillo');
    platillos.forEach(platillo => {
        const selectedOption = platillo.options[platillo.selectedIndex];
        if (selectedOption && selectedOption.value !== "Selecciona") {
            const price = parseInt(selectedOption.textContent.split('$')[1]);
            total += price;
        }
    });

    // Sumar precios de los complementos
    const complementos = document.querySelectorAll('#complementos-container .complemento');
    complementos.forEach(complemento => {
        const selectedOption = complemento.options[complemento.selectedIndex];
        if (selectedOption && selectedOption.value !== "Selecciona") {
            const price = parseInt(selectedOption.textContent.split('$')[1]);
            total += price;
        }
    });

    // Actualizar el total en la página
    document.getElementById('total').textContent = total;
}

// Escuchar cambios en los select de platillos y complementos
document.getElementById('platillos-container').addEventListener('change', calculateTotal);
document.getElementById('complementos-container').addEventListener('change', calculateTotal);

document.querySelector('input[type="submit"]').addEventListener('click', (event) => {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Recopilar datos del formulario de platillos
    const platillos = [];
    document.querySelectorAll('#platillos-container .platillo').forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value !== 'Selecciona') {
            platillos.push(selectedOption.value);
        }
    });

    // Recopilar datos del formulario de complementos
    const complementos = [];
    document.querySelectorAll('#complementos-container .complemento').forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value !== 'Selecciona') {
            complementos.push(selectedOption.value);
        }
    });

    // Crear un objeto con los datos recopilados
    const datos = {
        platillos,
        complementos,
        total: document.getElementById('total').textContent
    };

    // Confirmar la orden
    if (confirm('¿Confirmas tu orden?')) {
        console.log('Datos recopilados:', datos);
        alert('Orden enviada correctamente.');

        // Recargar la página para borrar todas las selecciones
        location.reload();
    }
});
