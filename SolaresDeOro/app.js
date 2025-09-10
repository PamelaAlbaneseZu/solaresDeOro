// Funciones utilitarias para manejar sucursales, reservas y administración.

/*
 * Obtiene la lista completa de sucursales definidas en data/data.js.  
 * Cada sucursal contiene su id, nombre, ciudad, región, dirección, 
 * un arreglo de rutas a sus imágenes y un arreglo de habitaciones 
 * con precio y capacidad.
 */
function getSucursales() {
  return sucursales;
}

/*
 * Devuelve una sucursal por su identificador numérico.  
 * Si no se encuentra, devuelve undefined.
 */
function getSucursalById(id) {
  return sucursales.find(s => s.id === parseInt(id));
}

/*
 * Almacena el arreglo de reservas en localStorage.  
 * Se utiliza la clave 'so_reservas' para persistir la información en 
 * el navegador del usuario.
 */
function saveReservas(reservas) {
  localStorage.setItem('so_reservas', JSON.stringify(reservas));
}

/*
 * Recupera las reservas guardadas en localStorage.  
 * Si no existe información, devuelve un arreglo vacío.
 */
function getReservas() {
  const data = localStorage.getItem('so_reservas');
  return data ? JSON.parse(data) : [];
}

/*
 * Añade una nueva reserva.  
 * Se requiere el id de la sucursal, el tipo de habitación, la cantidad
 * de personas, el número de noches y opcionalmente la fecha de ingreso.  
 * La reserva se almacena en localStorage de forma acumulativa.
 */
function addReserva(sucursalId, tipo, personas, noches, fecha) {
  const reservas = getReservas();
  reservas.push({
    sucursalId: parseInt(sucursalId),
    tipo: tipo,
    personas: parseInt(personas),
    noches: parseInt(noches),
    fecha: fecha || ''
  });
  saveReservas(reservas);
}

/*
 * Elimina una reserva por su índice dentro del arreglo.  
 * Después de eliminar, se actualiza el localStorage.
 */
function removeReserva(index) {
  const reservas = getReservas();
  reservas.splice(index, 1);
  saveReservas(reservas);
}

/*
 * Verifica si el usuario actual tiene rol de administrador.  
 * El valor se guarda como cadena 'true' o 'false' en localStorage bajo
 * la clave 'so_admin'.
 */
function isAdmin() {
  return localStorage.getItem('so_admin') === 'true';
}

/*
 * Cierra la sesión de administrador y redirige al inicio.
 */
function logout() {
  localStorage.removeItem('so_admin');
  window.location.href = 'index.html';
}

/*
 * Renderiza la tabla de reservas en un contenedor específico.  
 * Muestra la lista con sus campos y calcula el total a pagar.  
 * Si existen reservas, también muestra un botón para confirmar.
 */
function renderReservasTable(containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  const reservas = getReservas();
  let html = '';
  let total = 0;
  html += '<table><thead><tr><th>#</th><th>Sucursal</th><th>Tipo</th><th>Personas</th><th>Noches</th><th>Fecha</th><th>Precio (CLP)</th><th>Total (CLP)</th><th>Acción</th></tr></thead><tbody>';
  reservas.forEach((res, idx) => {
    const suc = getSucursalById(res.sucursalId);
    if (!suc) return;
    const hab = suc.habitaciones.find(h => h.tipo === res.tipo);
    const precio = hab ? hab.precio : 0;
    const subtotal = precio * res.noches;
    total += subtotal;
    html += `<tr><td>${idx + 1}</td><td>${suc.nombre}</td><td>${res.tipo}</td><td>${res.personas}</td><td>${res.noches}</td><td>${res.fecha || ''}</td><td>${precio.toLocaleString('es-CL')}</td><td>${subtotal.toLocaleString('es-CL')}</td><td><button onclick="removeReserva(${idx});renderReservasTable('${containerId}')">Eliminar</button></td></tr>`;
  });
  html += '</tbody></table>';
  html += `<p><strong>Total a pagar:</strong> ${total.toLocaleString('es-CL')} CLP</p>`;
  if (reservas.length > 0) {
    html += '<button onclick="confirmarReservas()">Confirmar Reservas</button>';
  }
  cont.innerHTML = html;
}

/*
 * Acción para confirmar todas las reservas actuales.  
 * Limpia el localStorage y vuelve a renderizar las tablas si existen.
 */
function confirmarReservas() {
  alert('Reservas confirmadas. ¡Gracias por preferirnos!');
  localStorage.removeItem('so_reservas');
  // Actualizar tablas de reservas si están presentes en la página
  if (document.getElementById('reservasTabla')) {
    renderReservasTable('reservasTabla');
  }
  if (document.getElementById('adminReservasTabla')) {
    renderReservasTable('adminReservasTabla');
  }
}

/*
 * Maneja el inicio de sesión de usuarios y administrador.  
 * Valida dominio de correo, longitud de contraseña y determina si el
 * usuario es administrador. Para usuarios normales verifica que
 * exista en la lista registrada.
 */
function login(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const allowed = ['@duoc.cl','@profesor.duoc.cl','@gmail.com','@solaresdeoro.cl'];
  const domain = email.substring(email.indexOf('@'));
  if (!allowed.includes(domain)) {
    alert('Dominio de correo no permitido.');
    return;
  }
  if (password.length < 4 || password.length > 10) {
    alert('La contraseña debe tener entre 4 y 10 caracteres.');
    return;
  }
  if (email === 'admin@solaresdeoro.cl') {
    // Inicia sesión como administrador
    localStorage.setItem('so_admin', 'true');
    window.location.href = 'administrador.html';
  } else {
    // Verifica usuario registrado
    let users = JSON.parse(localStorage.getItem('so_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      alert('Usuario o contraseña inválidos.');
      return;
    }
    localStorage.setItem('so_admin', 'false');
    alert('Inicio de sesión exitoso.');
    window.location.href = 'index.html';
  }
}

/*
 * Comprueba que el usuario actual sea administrador; de lo contrario
 * redirige a la página de login.
 */
function checkAdmin() {
  if (isAdmin()==='false') {
    window.location.href = 'login.html';
  }
}

/*
 * Controla la navegación dentro del panel de administración.  
 * Oculta todas las secciones y muestra sólo la seleccionada.  
 * Además, actualiza los contenidos dinámicamente según corresponda.
 */
function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
  const elem = document.getElementById(id);
  if (elem) {
    elem.style.display = 'block';
  }
  if (id === 'adminReservas') {
    renderReservasTable('adminReservasTabla');
  }
  if (id === 'adminPrecios') {
    renderPreciosTable();
  }
  if (id === 'adminHabitaciones') {
    renderHabitacionesForm();
  }
  if (id === 'adminSucursales') {
    renderSucursalesForm();
  }
  if (id === 'adminTrabajadores') {
    renderTrabajadoresForm();
  }
}

/*
 * Renderiza la tabla de precios para cada sucursal y tipo de habitación.  
 * Permite editar los precios y guardarlos en la estructura de datos.
 */
function renderPreciosTable() {
  const cont = document.getElementById('adminPreciosTabla');
  if (!cont) return;
  let html = '<table><thead><tr><th>Sucursal</th><th>Tipo</th><th>Precio (CLP)</th><th>Nuevo Precio</th></tr></thead><tbody>';
  sucursales.forEach((suc, sidx) => {
    suc.habitaciones.forEach((hab, hidx) => {
      html += `<tr><td>${suc.nombre}</td><td>${hab.tipo}</td><td>${hab.precio.toLocaleString('es-CL')}</td><td><input type="number" id="precio_${sidx}_${hidx}" value="${hab.precio}" min="0"></td></tr>`;
    });
  });
  html += '</tbody></table>';
  html += '<button onclick="guardarPrecios()">Guardar Cambios</button>';
  cont.innerHTML = html;
}

/*
 * Guarda los nuevos precios introducidos en la tabla de precios.  
 * Valida que los valores sean números no negativos antes de aplicarlos.
 */
function guardarPrecios() {
  sucursales.forEach((suc, sidx) => {
    suc.habitaciones.forEach((hab, hidx) => {
      const input = document.getElementById(`precio_${sidx}_${hidx}`);
      const newPrice = parseInt(input.value);
      if (!isNaN(newPrice) && newPrice >= 0) {
        hab.precio = newPrice;
      }
    });
  });
  alert('Precios actualizados');
  renderPreciosTable();
}

/*
 * Renderiza el formulario para agregar nuevas habitaciones y muestra
 * las habitaciones existentes de cada sucursal.
 */
function renderHabitacionesForm() {
  const cont = document.getElementById('adminHabitacionesForm');
  if (!cont) return;
  let html = '<h3>Agregar tipo de habitación</h3>';
  html += '<label>Sucursal:</label><select id="habSucursal">';
  sucursales.forEach(suc => {
    html += `<option value="${suc.id}">${suc.nombre}</option>`;
  });
  html += '</select>';
  html += '<label>Tipo:</label><input type="text" id="habTipo">';
  html += '<label>Precio:</label><input type="number" id="habPrecio" min="0">';
  html += '<label>Capacidad:</label><input type="number" id="habCapacidad" min="1">';
  html += '<button onclick="guardarHabitacion()">Agregar</button>';
  html += '<h3>Habitaciones existentes</h3>';
  html += '<ul>';
  sucursales.forEach(suc => {
    html += `<li><strong>${suc.nombre}</strong>: ${suc.habitaciones.map(h => h.tipo).join(', ')}</li>`;
  });
  html += '</ul>';
  cont.innerHTML = html;
}

/*
 * Guarda una nueva habitación en la sucursal seleccionada.
 */
function guardarHabitacion() {
  const sucId = parseInt(document.getElementById('habSucursal').value);
  const tipo = document.getElementById('habTipo').value;
  const precio = parseInt(document.getElementById('habPrecio').value);
  const capacidad = parseInt(document.getElementById('habCapacidad').value);
  if (!tipo || isNaN(precio) || isNaN(capacidad)) {
    alert('Complete todos los campos');
    return;
  }
  const suc = getSucursalById(sucId);
  suc.habitaciones.push({
    tipo: tipo,
    precio: precio,
    capacidad: capacidad
  });
  alert('Habitación agregada');
  renderHabitacionesForm();
}

/*
 * Renderiza el formulario para crear nuevas sucursales y muestra las
 * existentes en una lista simple.
 */
function renderSucursalesForm() {
  const cont = document.getElementById('adminSucursalesForm');
  if (!cont) return;
  let html = '<h3>Agregar nueva sucursal</h3>';
  html += '<label>Nombre:</label><input type="text" id="sucNombre">';
  html += '<label>Ciudad:</label><input type="text" id="sucCiudad">';
  html += '<label>Región:</label><input type="text" id="sucRegion">';
  html += '<label>Dirección:</label><input type="text" id="sucDireccion">';
  html += '<button onclick="guardarSucursal()">Agregar Sucursal</button>';
  html += '<h3>Sucursales existentes</h3>';
  html += '<ul>';
  sucursales.forEach(suc => {
    html += `<li>${suc.nombre} - ${suc.ciudad}</li>`;
  });
  html += '</ul>';
  cont.innerHTML = html;
}

/*
 * Agrega una nueva sucursal al arreglo de sucursales.  
 * No persiste en el servidor, sólo en memoria, ya que no hay backend.
 */
function guardarSucursal() {
  const nombre = document.getElementById('sucNombre').value;
  const ciudad = document.getElementById('sucCiudad').value;
  const region = document.getElementById('sucRegion').value;
  const direccion = document.getElementById('sucDireccion').value;
  if (!nombre || !ciudad || !region || !direccion) {
    alert('Complete todos los campos');
    return;
  }
  const newId = sucursales.length + 1;
  sucursales.push({
    id: newId,
    nombre: nombre,
    ciudad: ciudad,
    region: region,
    direccion: direccion,
    imagenes: [],
    habitaciones: []
  });
  alert('Sucursal agregada');
  renderSucursalesForm();
}

/*
 * Renderiza el formulario de trabajadores y lista los trabajadores
 * existentes almacenados en localStorage.
 */
function renderTrabajadoresForm() {
  const cont = document.getElementById('adminTrabajadoresForm');
  if (!cont) return;
  let workers = JSON.parse(localStorage.getItem('so_trabajadores') || '[]');
  let html = '<h3>Agregar trabajador</h3>';
  html += '<label>Nombre:</label><input type="text" id="trabNombre">';
  html += '<label>Rol:</label><input type="text" id="trabRol">';
  html += '<label>Sucursal:</label><select id="trabSucursal">';
  sucursales.forEach(suc => {
    html += `<option value="${suc.id}">${suc.nombre}</option>`;
  });
  html += '</select>';
  html += '<button onclick="guardarTrabajador()">Agregar Trabajador</button>';
  html += '<h3>Trabajadores existentes</h3>';
  html += '<ul>';
  workers.forEach((w, idx) => {
    const suc = getSucursalById(w.sucursalId);
    html += `<li>${w.nombre} - ${w.rol} (${suc ? suc.nombre : ''}) <button onclick="eliminarTrabajador(${idx})">Eliminar</button></li>`;
  });
  html += '</ul>';
  cont.innerHTML = html;
}

/*
 * Guarda un trabajador en localStorage bajo la clave so_trabajadores.
 */
function guardarTrabajador() {
  let workers = JSON.parse(localStorage.getItem('so_trabajadores') || '[]');
  const nombre = document.getElementById('trabNombre').value;
  const rol = document.getElementById('trabRol').value;
  const sucId = parseInt(document.getElementById('trabSucursal').value);
  if (!nombre || !rol) {
    alert('Complete todos los campos');
    return;
  }
  workers.push({
    nombre: nombre,
    rol: rol,
    sucursalId: sucId
  });
  localStorage.setItem('so_trabajadores', JSON.stringify(workers));
  alert('Trabajador agregado');
  renderTrabajadoresForm();
}

/*
 * Elimina un trabajador en un índice específico del arreglo.  
 * Después de eliminar, se actualiza localStorage y se vuelve a pintar la lista.
 */
function eliminarTrabajador(index) {
  let workers = JSON.parse(localStorage.getItem('so_trabajadores') || '[]');
  workers.splice(index, 1);
  localStorage.setItem('so_trabajadores', JSON.stringify(workers));
  renderTrabajadoresForm();
}

/*
 * Maneja el registro de usuarios.  
 * Verifica que el dominio del correo sea aceptado, que la contraseña
 * tenga la longitud adecuada y que el correo no exista previamente.  
 * Almacena los datos en localStorage.
 */
function register(e) {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const allowed = ['@duoc.cl','@profesor.duoc.cl','@gmail.com','@solaresdeoro.cl'];
  const domain = email.substring(email.indexOf('@'));
  if (!allowed.includes(domain)) {
    alert('Dominio de correo no permitido.');
    return;
  }
  if (password.length < 4 || password.length > 10) {
    alert('La contraseña debe tener entre 4 y 10 caracteres.');
    return;
  }
  let users = JSON.parse(localStorage.getItem('so_users') || '[]');
  if (users.find(u => u.email === email)) {
    alert('El correo ya está registrado.');
    return;
  }
  users.push({ email: email, password: password });
  localStorage.setItem('so_users', JSON.stringify(users));
  alert('Registro exitoso. Ahora puede iniciar sesión.');
  document.getElementById('registerEmail').value = '';
  document.getElementById('registerPassword').value = '';
}