
const URL = "http://localhost:4000";

function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// ---------------------- USUARIOS ----------------------
async function crearUsuario(e) {
  e.preventDefault();
  const nombre = document.getElementById("usuarioNombre").value;
  const email = document.getElementById("usuarioEmail").value;

  await fetch(URL + "/usuarios", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nombre, email })
  });

  document.getElementById("usuarioNombre").value = "";
  document.getElementById("usuarioEmail").value = "";
  obtenerUsuarios();
}

async function obtenerUsuarios() {
  const res = await fetch(URL + "/usuarios");
  const data = await res.json();
  const lista = document.getElementById("lista-usuarios");
  lista.innerHTML = "";
  data.forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = `${u.nombre} (${u.email})
      <button class="delete-button" onclick="eliminarUsuario('${u._id}')">Eliminar</button>`;
    lista.appendChild(li);
  });
}

async function eliminarUsuario(id) {
  await fetch(URL + "/usuarios/" + id, { method: "DELETE" });
  obtenerUsuarios();
}

// ---------------------- PRODUCTOS ----------------------
async function crearProducto(e) {
  e.preventDefault();
  const nombre = document.getElementById("productoNombre").value;
  const precio = parseFloat(document.getElementById("productoPrecio").value);

  await fetch(URL + "/productos", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nombre, precio })
  });

  document.getElementById("productoNombre").value = "";
  document.getElementById("productoPrecio").value = "";
  obtenerProductos();
}

async function obtenerProductos() {
  const res = await fetch(URL + "/productos");
  const data = await res.json();
  const lista = document.getElementById("lista-productos");
  lista.innerHTML = "";
  data.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `${p.nombre} - S/.${p.precio}
      <button class="delete-button" onclick="eliminarProducto('${p._id}')">Eliminar</button>`;
    lista.appendChild(li);
  });
}

async function eliminarProducto(id) {
  await fetch(URL + "/productos/" + id, { method: "DELETE" });
  obtenerProductos();
}

// ---------------------- MASCOTAS ----------------------
async function crearMascota(e) {
  e.preventDefault();
  const nombre = document.getElementById("mascotaNombre").value;
  const tipo = document.getElementById("mascotaTipo").value;
  const raza = document.getElementById("mascotaRaza").value;

  await fetch(URL + "/mascotas", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nombre, tipo, raza })
  });

  document.getElementById("mascotaNombre").value = "";
  document.getElementById("mascotaTipo").value = "";
  document.getElementById("mascotaRaza").value = "";
  obtenerMascotas();
}

async function obtenerMascotas() {
  const res = await fetch(URL + "/mascotas");
  const data = await res.json();
  const lista = document.getElementById("lista-mascotas");
  lista.innerHTML = "";
  data.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `${m.nombre} (${m.tipo} - ${m.raza})
      <button class="delete-button" onclick="eliminarMascota('${m._id}')">Eliminar</button>`;
    lista.appendChild(li);
  });
}

async function eliminarMascota(id) {
  await fetch(URL + "/mascotas/" + id, { method: "DELETE" });
  obtenerMascotas();
}

// ---------------------- ÓRDENES ----------------------
async function crearOrden(e) {
  e.preventDefault();
  const total = parseFloat(document.getElementById("ordenTotal").value);
  const estado = document.getElementById("ordenEstado").value;

  await fetch(URL + "/ordenes", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ total, estado })
  });

  document.getElementById("ordenTotal").value = "";
  document.getElementById("ordenEstado").value = "";
  obtenerOrdenes();
}

async function obtenerOrdenes() {
  const res = await fetch(URL + "/ordenes");
  const data = await res.json();
  const lista = document.getElementById("lista-ordenes");
  lista.innerHTML = "";
  data.forEach(o => {
    const li = document.createElement("li");
    li.innerHTML = `S/.${o.total} - ${o.estado}
      <button class="delete-button" onclick="eliminarOrden('${o._id}')">Eliminar</button>`;
    lista.appendChild(li);
  });
}

async function eliminarOrden(id) {
  await fetch(URL + "/ordenes/" + id, { method: "DELETE" });
  obtenerOrdenes();
}

// ---------------------- DONACIONES ----------------------
async function crearDonacion(e) {
  e.preventDefault();
  const monto = parseFloat(document.getElementById("donacionMonto").value);

  await fetch(URL + "/donaciones", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ monto })
  });

  document.getElementById("donacionMonto").value = "";
  obtenerDonaciones();
}

async function obtenerDonaciones() {
  const res = await fetch(URL + "/donaciones");
  const data = await res.json();
  const lista = document.getElementById("lista-donaciones");
  lista.innerHTML = "";
  data.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `S/.${d.monto}
      <button class="delete-button" onclick="eliminarDonacion('${d._id}')">Eliminar</button>`;
    lista.appendChild(li);
  });
}

async function eliminarDonacion(id) {
  await fetch(URL + "/donaciones/" + id, { method: "DELETE" });
  obtenerDonaciones();
}

// ---------------------- ASOCIACIONES ----------------------
async function crearAsociacion(e) {
  e.preventDefault();
  const nombre = document.getElementById("asociacionNombre").value;
  const ciudad = document.getElementById("asociacionCiudad").value;

  await fetch(URL + "/asociaciones", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name: nombre, Ciudad: ciudad })
  });

  document.getElementById("asociacionNombre").value = "";
  document.getElementById("asociacionCiudad").value = "";
  obtenerAsociaciones();
}

async function obtenerAsociaciones() {
  const res = await fetch(URL + "/asociaciones");
  const data = await res.json();
  const lista = document.getElementById("lista-asociaciones");
  lista.innerHTML = "";
  data.forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `${a.name} (${a.Ciudad || 'Ciudad desconocida'})
      <button class="delete-button" onclick="eliminarAsociacion('${a._id}')">Eliminar</button>`;
    lista.appendChild(li);
  });
}

async function eliminarAsociacion(id) {
  await fetch(URL + "/asociaciones/" + id, { method: "DELETE" });
  obtenerAsociaciones();
}

// ---------------------- INIT ----------------------
window.onload = () => {
  obtenerUsuarios();
  obtenerProductos();
  obtenerMascotas();
  obtenerOrdenes();
  obtenerDonaciones();
  obtenerAsociaciones();
};
