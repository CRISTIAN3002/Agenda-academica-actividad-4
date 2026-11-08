// 1. Modelado de datos y recuperación desde localStorage
let tareas = JSON.parse(localStorage.getItem('tareasAgenda')) || [];
let editandoId = null;

// Referencias al DOM
const formulario = document.getElementById('formulario');
const listaTareas = document.getElementById('lista-tareas');
const filtro = document.getElementById('filtro-categoria');
const contador = document.getElementById('contador');
const mensajeError = document.getElementById('mensaje-error');
const btnGuardar = document.getElementById('btn-guardar');

// 2. Función para renderizar el DOM (Visualizar y Función adicional: Filtrado y Contador)
const renderizarTareas = (filtroActual = 'Todas') => {
    listaTareas.innerHTML = '';
    
    // Uso de métodos de arreglos modernos (.filter)
    const tareasFiltradas = filtroActual === 'Todas' 
        ? tareas 
        : tareas.filter(tarea => tarea.categoria === filtroActual);

    // Actualización del contador en tiempo real
    contador.textContent = `Total de tareas: ${tareasFiltradas.length}`;

    if (tareasFiltradas.length === 0) {
        listaTareas.innerHTML = '<p style="text-align:center; color:#888;">No hay tareas registradas.</p>';
        return;
    }

    // Creación dinámica del HTML usando template literals
    tareasFiltradas.forEach(tarea => {
        const div = document.createElement('div');
        div.className = 'tarea-card';
        div.innerHTML = `
            <h3>${tarea.titulo}</h3>
            <p><strong>Materia:</strong> ${tarea.categoria}</p>
            <p><strong>Fecha límite:</strong> ${tarea.fecha}</p>
            <div style="margin-top: 10px;">
                <button class="btn-edit" onclick="cargarEdicion(${tarea.id})">Editar</button>
                <button class="btn-delete" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </div>
        `;
        listaTareas.appendChild(div);
    });
};

// 3. Operación Agregar / Editar (Eventos y Validación)
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const fecha = document.getElementById('fecha').value;

    // Validación de datos
    if (!titulo || !categoria || !fecha) {
        mensajeError.classList.remove('oculto');
        return;
    }
    mensajeError.classList.add('oculto');

    if (editandoId) {
        // Actualizar registro existente usando .map()
        tareas = tareas.map(t => t.id === editandoId ? { id: editandoId, titulo, categoria, fecha } : t);
        editandoId = null;
        btnGuardar.textContent = 'Guardar Tarea';
    } else {
        // Crear nuevo registro (Modelado con Objetos)
        const nuevaTarea = {
            id: Date.now(),
            titulo,
            categoria,
            fecha
        };
        tareas.push(nuevaTarea);
    }

    // 4. Persistencia local
    localStorage.setItem('tareasAgenda', JSON.stringify(tareas));
    
    formulario.reset();
    renderizarTareas(filtro.value);
});

// 5. Operación Eliminar
const eliminarTarea = (id) => {
    if(confirm("¿Estás seguro de eliminar esta tarea?")) {
        tareas = tareas.filter(t => t.id !== id);
        localStorage.setItem('tareasAgenda', JSON.stringify(tareas));
        renderizarTareas(filtro.value);
    }
};

// 6. Preparar Operación Editar
const cargarEdicion = (id) => {
    const tarea = tareas.find(t => t.id === id);
    if(tarea) {
        document.getElementById('titulo').value = tarea.titulo;
        document.getElementById('categoria').value = tarea.categoria;
        document.getElementById('fecha').value = tarea.fecha;
        
        editandoId = id;
        btnGuardar.textContent = 'Actualizar Tarea';
        mensajeError.classList.add('oculto');
    }
};

// 7. Evento para el filtro de categorías
filtro.addEventListener('change', (e) => {
    renderizarTareas(e.target.value);
});

// Inicialización de la app al cargar
renderizarTareas();