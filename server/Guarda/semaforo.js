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

async function handleIngresarClick(event) {
  event.preventDefault();

  // Se pasa el parámetro o la variable de la ventana anterior para obtenerla aquí
  var params = new URLSearchParams(window.location.search);
  var numParqueo = params.get("parqueo");

  // Si 'parqueo' tiene un valor, puedes utilizarlo QUITARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
  if (numParqueo) {
    console.log("Valor de 'parqueo' recibido:", numParqueo);
    // Aquí puedes usar el valor como necesites en tu página semaforo.html
  }

  // Obtiene la placa para verificar si existe en el sistema
  const placa = document.getElementById("placa").value;
  var campos = 0;
  console.log("Verificando si la placa ya existe...");
  const { data: existingPlaca, error: checkError } = await supabase
    .from("Vehiculos")
    .select("*")
    .eq("placa", placa);

  const vehiculo = await getVehiculoIDDByPlaca(placa);
  var idVehiculo = 0;
  var idUsuario = 0;

  if (vehiculo) {
    console.log(`id de vehículo: ${vehiculo.idVehiculo}`);
    //Se asigna el id del vehículo
    idVehiculo = vehiculo.idVehiculo;

    idUsuario = vehiculo.duenoID;
  } else {
    console.log("No se encontró la placa");
    alert("No se encontró la placa");
    return;
  }

  if (checkError) {
    console.error("Error checking existing placa:", checkError);
    return;
  }

  if (existingPlaca.length < 1) {
    alert("La placa no está registrada");
    return;
  }

  //Revisa si el parqueo existe en el sistema

  const { data: existingParqueo, error: checkError2 } = await supabase
    .from("Parqueo")
    .select("*")
    .eq("numParqueo", numParqueo);

  const parqueo = await getParqueoDByNum(numParqueo);
  var idparqueo = 0;

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

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var hrs = String(today.getHours());
  var min = String(today.getMinutes());
  var sec = String(today.getSeconds());

  today = mm + "-" + dd + "-" + yyyy + " " + hrs + ":" + min + ":" + sec;

  console.log(today);

  const fechaHora = today;

  //const idUsuario = 29;
  const tipoMovimiento = "entrada";

  console.log(`idVehiculo: ${idVehiculo}`); //listo
  console.log(`idUsuario: ${idUsuario}`); //listo
  console.log(`TipoMovimiento: ${tipoMovimiento}`);
  console.log(`fechaHora: ${fechaHora}`); //listo
  console.log(`idParqueo: ${idParqueo}`); //listo

  const { data2, error2 } = await supabase
    .from("Bitacora")
    .insert([{ idVehiculo, idUsuario, tipoMovimiento, fechaHora, idParqueo }]);

  if (error2) {
    console.error("Error inserting data:", error2);
    return;
  }

  alert("Ingresado correctamente");

  fetchBitacora();
}

document.addEventListener("DOMContentLoaded", function () {
  const ingresarButton = document.getElementById("ingresar");

  if (ingresarButton) {
    ingresarButton.addEventListener("click", handleIngresarClick);
  } else {
    console.error('El botón con id "ingresar" no fue encontrado.');
  }

  fetchParqueos();
  fetchVehiculos();
  fetchBitacora();
});
