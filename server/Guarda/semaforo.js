// Inicializar Supabase
const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchBitacora() {
  try {
    const { data, error } = await supabase.from("Bitacora").select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No data found");
      return;
    }

    console.log("Datos obtenidos de Supabase:", data);

    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    data.forEach((bitacora) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${bitacora.idVehiculo}</td>
        <td>${bitacora.idUsuario}</td>
        <td>${bitacora.tipoMovimiento}</td>
        <td>${bitacora.FechaHora}</td>
        <td>${bitacora.idParqueo}</td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => {
      element.addEventListener("mouseover", function () {
        const tooltipText = this.getAttribute("title");
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = tooltipText;
        document.body.appendChild(tooltip);
        tooltip.style.left = this.getBoundingClientRect().left + "px";
        tooltip.style.top =
          this.getBoundingClientRect().top - tooltip.offsetHeight + "px";
      });
      element.addEventListener("mouseout", function () {
        document.querySelector(".tooltip").remove();
      });
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
}

async function fetchVehiculos() {
  try {
    const { data, error } = await supabase.from("Vehiculos").select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No data found");
      return;
    }

    console.log("Datos obtenidos de Supabase:", data);

    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    data.forEach((vehiculo) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${vehiculo.marca}</td>
          <td>${vehiculo.color}</td>
          <td>${vehiculo.placa}</td>
          <td>${vehiculo.tipo}</td>
          <td>${vehiculo.duenoID}</td>
          <td>${vehiculo.cat7600 ? "Si" : "No"}</td>
          <td>
            <a href="#editItemModal" class="edit" data-toggle="modal" data-id="${
              vehiculo.idVehiculo
            }" data-marca="${vehiculo.marca}" data-color="${
        vehiculo.color
      }" data-placa="${vehiculo.placa}" data-tipo="${
        vehiculo.tipo
      }" data-duenoid="${vehiculo.duenoID}" data-cat7600="${
        vehiculo.cat7600 ? "Si" : "No"
      }"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
            <a href="#deleteItemModal" class="delete" data-toggle="modal" data-id="${
              vehiculo.idVehiculo
            }"><i class="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i></a>
          </td>
        `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => {
      element.addEventListener("mouseover", function () {
        const tooltipText = this.getAttribute("title");
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = tooltipText;
        document.body.appendChild(tooltip);
        tooltip.style.left = this.getBoundingClientRect().left + "px";
        tooltip.style.top =
          this.getBoundingClientRect().top - tooltip.offsetHeight + "px";
      });
      element.addEventListener("mouseout", function () {
        document.querySelector(".tooltip").remove();
      });
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
}

async function fetchParqueos() {
  try {
    const { data, error } = await supabase.from("Parqueo").select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No data found");
      return;
    }

    console.log("Datos obtenidos de Supabase:", data);

    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    data.forEach((parqueo) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${parqueo.numParqueo}</td>
        <td>${parqueo.capacidadRegular}</td>
        <td>${parqueo.capacidadMoto}</td>
        <td>${parqueo.capacidad7600}</td>
        <td>
          <a href="#editItemModal" class="edit" data-toggle="modal" data-numparqueo="${parqueo.numParqueo}" data-capacidadregular="${parqueo.capacidadRegular}" data-capacidadmoto="${parqueo.capacidadMoto}" data-capacidad7600="${parqueo.capacidad7600}"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
          <a href="#deleteItemModal" class="delete" data-toggle="modal" data-numparqueo="${parqueo.numParqueo}"><i class="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i></a>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => {
      element.addEventListener("mouseover", function () {
        const tooltipText = this.getAttribute("title");
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = tooltipText;
        document.body.appendChild(tooltip);
        tooltip.style.left = this.getBoundingClientRect().left + "px";
        tooltip.style.top =
          this.getBoundingClientRect().top - tooltip.offsetHeight + "px";
      });
      element.addEventListener("mouseout", function () {
        document.querySelector(".tooltip").remove();
      });
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
}

async function fetchBitacoraNoRegistro() {
  try {
    const { data, error } = await supabase
      .from("BitacoraNoRegistro")
      .select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No data found");
      return;
    }

    console.log("Datos obtenidos de Supabase:", data);

    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    document.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => {
      element.addEventListener("mouseover", function () {
        const tooltipText = this.getAttribute("title");
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = tooltipText;
        document.body.appendChild(tooltip);
        tooltip.style.left = this.getBoundingClientRect().left + "px";
        tooltip.style.top =
          this.getBoundingClientRect().top - tooltip.offsetHeight + "px";
      });
      element.addEventListener("mouseout", function () {
        document.querySelector(".tooltip").remove();
      });
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
}

async function getParqueoDByNum(numParqueo) {
  try {
    const { data, error } = await supabase
      .from("Parqueo")
      .select("idParqueo, numParqueo, capacidadRegular")
      .eq("numParqueo", numParqueo)
      .single();

    if (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

//Consulta tabla de usuarios para ver si la cedula existe
async function getCeudlaByCedula(cedula) {
  try {
    const { data, error } = await supabase
      .from("Usuario")
      .select("idUsuario, idRol, cedula")
      .eq("cedula", cedula)
      .single();

    if (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

//Consulta la tabla de vehiculos para obtener datos
async function getVehiculoIDDByPlaca(placa) {
  try {
    const { data, error } = await supabase
      .from("Vehiculos")
      .select("idVehiculo, placa, duenoID")
      .eq("placa", placa)
      .single();

    if (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

//Consulta la tabla de bitacora para obtener datos
async function getBitacoraIDDByIDVehiculo(idVehiculo) {
  try {
    const { data, error } = await supabase
      .from("Bitacora")
      .select("numMovimiento, idVehiculo, tipoMovimiento, fechaHora")
      .eq("idVehiculo", idVehiculo)
      .order("fechaHora", { ascending: false })
      .limit(1)
      .single();

    const { count, error: countError } = await supabase
      .from("BitacoraNoRegistro")
      .select("idBNoRegistro", { count: "exact" }) // "id" es cualquier campo; no importa qué campo seleccionas aquí
      .eq("placa", placa);

    // Manejo de errores en la consulta del conteo
    if (countError) {
      console.error("Error counting records:", countError);
      return null;
    }

    if (error) {
      console.error("Error fetching bitacora ID:", error);
      return null;
    }

    return count;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

//Consulta la tabla de bitacoraNoRegistro para obtener datos
async function getBitacoraNoByPlaca(placa) {
  try {
    const { data, error } = await supabase
      .from("BitacoraNoRegistro")
      .select(
        "cedula, placa, idParqueo, is7600 , movimiento, fechaHora, tipoVehiculo"
      )
      .eq("placa", placa)
      .order("fechaHora", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching bitacora :", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

//Cuenta cuantos registros hay con una misma placa
async function getRegistrosTotal(placa) {
  try {
    // Consulta para obtener el conteo de registros con la placa especificada
    const { count, error: countError } = await supabase
      .from("BitacoraNoRegistro")
      .select("idBNoRegistro", { count: "exact" })
      .eq("placa", placa);

    // Manejo de errores en la consulta del conteo
    if (countError) {
      console.error("Error counting records:", countError);
      return null;
    }

    // Devuelve el registro más reciente y el conteo de registros
    return { count };
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

//Cuenta cuantos vehiculos tiene un usuario sin registrar
async function placaPorCedula(cedula) {
  try {
    // Consulta para obtener todas las placas asociadas con la cédula especificada
    const { data: vehiculos, error: vehiculosError } = await supabase
      .from("BitacoraNoRegistro")
      .select("placa")
      .eq("cedula", cedula);

    // Manejo de errores en la consulta de vehículos por cédula
    if (vehiculosError) {
      console.error("Error fetching vehicles by cedula:", vehiculosError);
      return null;
    }

    // Filtrar placas únicas
    const placasUnicas = [...new Set(vehiculos.map((v) => v.placa))];
    const countCedula = placasUnicas.length;

    // Devuelve el conteo de placas únicas
    return { countCedula };
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

async function handleIngresarClick(event) {
  event.preventDefault();

  const ingresarNoRegistroButton =
    document.getElementById("ingresarNoRegistro");

  if (ingresarNoRegistroButton) {
    ingresarNoRegistroButton.addEventListener(
      "click",
      handleIngresarNoRegistroClick
    );
  } else {
    console.error('El botón con id "ingresar" no fue encontrado.');
  }

  // Se pasa el parámetro o la variable de la ventana anterior para obtenerla aquí
  var params = new URLSearchParams(window.location.search);
  var numParqueo = params.get("parqueo");

  // Obtiene la placa del html
  const placa = document.getElementById("placa").value;

  //Prueba que el campo no esté vacío
  if (placa == "") {
    alert("Campo vacio");
    return;
  }

  //Verifica si existe la placa
  console.log("Verificando si la placa ya existe...");
  const vehiculo = await getVehiculoIDDByPlaca(placa);
  var idVehiculo = 0;
  var idUsuario = 0;
  var noRegistrado;

  if (vehiculo) {
    console.log(`id de vehículo: ${vehiculo.idVehiculo}`);
    //Se asigna el id del vehículo
    idVehiculo = vehiculo.idVehiculo;
    noRegistrado = false;
    idUsuario = vehiculo.duenoID;
  } else {
    console.log(
      "No se encontró la placa, solo puede entrar una vez sin registrarse"
    );
    noRegistrado = true;
    //return;
  }
  //Revisa si el parqueo existe en el sistema
  const { data: existingParqueo, error: checkError2 } = await supabase
    .from("Parqueo")
    .select("*")
    .eq("numParqueo", numParqueo);

  const parqueo = await getParqueoDByNum(numParqueo);
  var campos = 0;
  if (parqueo) {
    console.log(`Campos: ${parqueo.capacidadRegular}`);
    //Asigna los campos para compararlos
    campos = parqueo.capacidadRegular;
    //Asigna el id del parqueo encontrado
    idParqueo = parqueo.idParqueo;
  } else {
    console.log("No se encontró el Parqueo");
    return;
  }

  // Verifica si hay campo en el parqueo
  if (campos <= 0) {
    alert("El parqueo no tiene campo");
    return;
  }

  //Obtiene la fecha y hora actual
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var hrs = String(today.getHours());
  var min = String(today.getMinutes());
  var sec = String(today.getSeconds());
  today = mm + "-" + dd + "-" + yyyy + " " + hrs + ":" + min + ":" + sec;
  const fechaHora = today;

  //Verifica si el movimiento es de entrada o salida
  const bitacora = await getBitacoraIDDByIDVehiculo(idVehiculo);
  var tipoMovimiento;

  if (bitacora) {
    console.log(`id de vehículo: ${bitacora.idVehiculo}`);

    tipoMovimiento = bitacora.tipoMovimiento;
    console.log(`tipo de movimiento: ${bitacora.tipo}`);
    if (tipoMovimiento == "entrada") {
      tipoMovimiento = "salida";
    } else {
      tipoMovimiento = "entrada";
    }
  } else {
    tipoMovimiento = "entrada";
  }

  console.log(`idVehiculo: ${idVehiculo}`); //listo
  console.log(`idUsuario: ${idUsuario}`); //listo
  console.log(`TipoMovimiento: ${tipoMovimiento}`); //listo
  console.log(`fechaHora: ${fechaHora}`); //listo
  console.log(`idParqueo: ${idParqueo}`); //listo

  //elementos a ocultar y mostrar
  const buttonNoRegistro = document.getElementById("ingresarNoRegistro");
  const cedulaC = document.getElementById("cedula");
  const cedulaLabel = document.getElementById("labelCedula");
  const buttonIngresar = document.getElementById("ingresar");
  const ley7600 = document.getElementById("7600");
  const ley7600Label = document.getElementById("label7600");
  const vehiculoTipo = document.getElementById("vehiculo");
  const vehiculoLabel = document.getElementById("labelVehiculo");

  //Valida en la tabla bitacoraNoRegistro
  const bitacoraNoRegistro = await getBitacoraNoByPlaca(placa);
  var movimiento;
  var cedula;
  const registros = await getRegistrosTotal(placa);

  //Para determinar el movimiento y ver si ya no puede ingresar
  if (bitacoraNoRegistro && registros) {
    cedula = bitacoraNoRegistro.cedula;
    const cantidadVehiculos = await placaPorCedula(cedula);
    if (cantidadVehiculos) {
      if (cantidadVehiculos.countCedula >= 2) {
        alert("Acceso denegado. El usuario ya posee dos vehiculos registrados");

        return;
      }
    }
    total = registros.count;
    const usuario = await getCeudlaByCedula(cedula);
    //Revisa si aun tiene intentos disponibles si es administrativo o estudiante
    if (total >= 2 && usuario.idRol == 1) {
      alert("Acceso denegado. Ya no posee mas intentos con este vehículo");
      location.reload();
      return;
    } else if (total >= 6 && usuario.idRol == 2) {
      alert("Acceso denegado. Ya no posee mas intentos con este vehículo");
      location.reload();
      return;
    }
    //Se asigna el tipo de movimiento
    movimiento = bitacoraNoRegistro.movimiento;
    if (movimiento == "entrada") {
      movimiento = "salida";
    } else {
      movimiento = "entrada";
    }
  } else {
    movimiento = "entrada";
  }

  //Asigna el tipo de vehiculo, cedula, campo 7600 e ingresa los datos de una vez
  if (noRegistrado && bitacoraNoRegistro) {
    const tipoVehiculo = document.getElementById("vehiculo").value;
    cedula = bitacoraNoRegistro.cedula;
    var is7600 = document.getElementById("7600").value;
    if (is7600 == "si") {
      is7600 = true;
    } else {
      is7600 = false;
    }
    const { data3, error3 } = await supabase.from("BitacoraNoRegistro").insert([
      {
        cedula,
        placa,
        idParqueo,
        is7600,
        movimiento,
        fechaHora,
        tipoVehiculo,
      },
    ]);
    alert("Ingresado correctamente en bitacoraNoRegistro");
    location.reload();
  }

  async function handleIngresarNoRegistroClick(event) {
    console.log("INGRESANDO SIN REGISTRO");
    const cedula = document.getElementById("cedula").value;
    const usuario = await getCeudlaByCedula(cedula);
    const cantidadVehiculos = await placaPorCedula(cedula);
    if (cantidadVehiculos) {
      if (cantidadVehiculos.countCedula >= 2) {
        alert("Acceso denegado. El usuario ya posee dos vehiculos registrados");

        return;
      } else {
        console.log("xd");
      }
    } else {
      console.log("XD");
    }
    if (usuario) {
      console.log("el usuario existe");
    } else {
      console.log("el usuario no existe");
      alert("La cédula ingresada no está en el sistema");
      return;
    }
    const tipoVehiculo = document.getElementById("vehiculo").value;
    var is7600 = document.getElementById("7600").value;
    if (is7600 == "si") {
      is7600 = true;
    } else {
      is7600 = false;
    }

    const { data3, error3 } = await supabase.from("BitacoraNoRegistro").insert([
      {
        cedula,
        placa,
        idParqueo,
        is7600,
        movimiento,
        fechaHora,
        tipoVehiculo,
      },
    ]);

    alert("Ingresado correctamente en bitacoraNoRegistro");
    cedulaC.style.display = "none";
    cedulaLabel.style.display = "none";
    buttonIngresar.style.display = "block";
    ley7600.style.display = "none";
    ley7600Label.style.display = "none";
    buttonNoRegistro.style.display = "none";
    vehiculoTipo.style.display = "none";
    vehiculoLabel.style.display = "none";
    location.reload();
  }

  //Si el vehiculo no esta registrado del todo
  if (noRegistrado) {
    cedulaC.style.display = "block";
    cedulaLabel.style.display = "block";
    buttonIngresar.style.display = "none";
    ley7600.style.display = "block";
    ley7600Label.style.display = "block";
    buttonNoRegistro.style.display = "block";
    vehiculoTipo.style.display = "block";
    vehiculoLabel.style.display = "block";
  } else {
    const { data2, error2 } = await supabase
      .from("Bitacora")
      .insert([
        { idVehiculo, idUsuario, tipoMovimiento, fechaHora, idParqueo },
      ]);
    location.reload();
    if (error2) {
      console.error("Error inserting data:", error2);
      return;
    }

    alert("Ingresado correctamente en bitacora");
  }

  fetchBitacora();
}

document.addEventListener("DOMContentLoaded", function () {
  const ingresarButton = document.getElementById("ingresar");

  if (ingresarButton) {
    ingresarButton.addEventListener("click", handleIngresarClick);
  } else {
    console.error('El botón con id "ingresar" no fue encontrado.');
  }
  fetchBitacoraNoRegistro();
  fetchParqueos();
  fetchVehiculos();
  fetchBitacora();
});
