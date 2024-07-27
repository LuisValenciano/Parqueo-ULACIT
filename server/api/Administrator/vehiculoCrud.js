document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function fetchVehiculos() {
    try {
      const { data: vehiculos, error: vehiculosError } = await supabase
        .from('Vehiculos')
        .select('*');
      if (vehiculosError) {
        console.error('Error fetching vehicles:', vehiculosError);
        return;
      }

      if (!vehiculos || vehiculos.length === 0) {
        console.log('No data found');
        return;
      }

      const duenoIDs = vehiculos.map(vehiculo => vehiculo.duenoID);
      const { data: usuarios, error: usuariosError } = await supabase
        .from('Usuario')
        .select('idUsuario, cedula')
        .in('idUsuario', duenoIDs);

      if (usuariosError) {
        console.error('Error fetching users:', usuariosError);
        return;
      }

      const usuarioMap = {};
      usuarios.forEach(usuario => {
        usuarioMap[usuario.idUsuario] = usuario.cedula;
      });

      const tbody = document.querySelector('table tbody');
      tbody.innerHTML = '';

      vehiculos.forEach(vehiculo => {
        const activo = vehiculo.activo ? 'Sí' : 'No';
        const cedula = usuarioMap[vehiculo.duenoID] || 'N/A';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${vehiculo.marca}</td>
          <td>${vehiculo.color}</td>
          <td>${vehiculo.placa}</td>
          <td>${vehiculo.tipo}</td>
          <td>${cedula}</td>
          <td>${vehiculo.cat7600 ? 'Si' : 'No'}</td>
          <td>${activo}</td>
          <td>
            <a href="#editItemModal" class="edit" data-toggle="modal" data-id="${vehiculo.idVehiculo}" data-marca="${vehiculo.marca}" data-color="${vehiculo.color}" data-placa="${vehiculo.placa}" data-tipo="${vehiculo.tipo}" data-duenoid="${vehiculo.duenoID}" data-cat7600="${vehiculo.cat7600 ? 'Si' : 'No'}" data-activo="${vehiculo.activo}"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
          </td>
        `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll('[data-toggle="tooltip"]').forEach(element => {
        element.addEventListener('mouseover', function () {
          const tooltipText = this.getAttribute('title');
          const tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          tooltip.innerText = tooltipText;
          document.body.appendChild(tooltip);
          tooltip.style.left = this.getBoundingClientRect().left + 'px';
          tooltip.style.top = this.getBoundingClientRect().top - tooltip.offsetHeight + 'px';
        });
        element.addEventListener('mouseout', function () {
          document.querySelector('.tooltip').remove();
        });
      });
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  }

  async function fetchUsuarios() {
    try {
      const { data, error } = await supabase.from('Usuario').select('*').eq('activo', true);
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No data found');
        return;
      }

      console.log('Datos obtenidos de Supabase:', data);

      const propietarioSelect = document.getElementById('propietario');
      propietarioSelect.innerHTML = '<option value="">Seleccione el propietario del vehículo</option>';

      data.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.cedula; // Usando la cédula como valor
        option.textContent = `${usuario.cedula} - ${usuario.nombre}`;
        propietarioSelect.appendChild(option);
      });
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  }

  async function getUsuarioIDByCedula(cedula) {
    try {
      const { data, error } = await supabase
        .from('Usuario')
        .select('idUsuario, cedula')
        .eq('cedula', cedula)
        .single();

      if (error) {
        console.error('Error fetching user ID:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      return null;
    }
  }

  document.getElementById('propietario').addEventListener('change', async function (event) {
    const cedula = event.target.value;
    const usuario = await getUsuarioIDByCedula(cedula);

    if (usuario) {
      console.log(`ID del usuario seleccionado: ${usuario.idUsuario}`);
    } else {
      console.log('No se encontró el ID del usuario.');
    }
  });

  document.getElementById('addVehiculoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const marca = document.getElementById('marca').value;
    const color = document.getElementById('color').value;
    const placa = document.getElementById('placa').value;
    const tipo = document.getElementById('tipo').value;
    const cedula = document.getElementById('propietario').value;
    const usuario = await getUsuarioIDByCedula(cedula);
    const duenoID = usuario ? usuario.idUsuario : null;
    const cat7600 = document.getElementById('cat7600').value === 'Si';
    const activo = true;

    if (!duenoID) {
      alert('No se encontró el ID del propietario.');
      return;
    }

    // Verificar si el propietario ya tiene dos vehículos activos
    const { data: activeVehicles, error: activeVehiclesError } = await supabase
      .from('Vehiculos')
      .select('*')
      .eq('duenoID', duenoID)
      .eq('activo', true);

    if (activeVehiclesError) {
      console.error('Error checking active vehicles:', activeVehiclesError);
      return;
    }

    if (activeVehicles.length >= 2) {
      alert('El propietario ya tiene dos vehículos activos.');
      return;
    }

    console.log('Verificando si la placa ya existe...');
    const { data: existingPlaca, error: checkError } = await supabase
      .from('Vehiculos')
      .select('*')
      .eq('placa', placa);

    if (checkError) {
      console.error('Error checking existing placa:', checkError);
      return;
    }

    if (existingPlaca.length > 0) {
      alert('La placa ya está registrada.');
      return;
    }

    console.log('Agregando nuevo vehículo...');
    const { data, error } = await supabase.from('Vehiculos').insert([{ marca, color, placa, tipo, duenoID, cat7600, activo }]);

    if (error) {
      console.error('Error inserting data:', error);
      return;
    }

    alert('Vehículo agregado exitosamente.');
    $('#addItemModal').modal('hide');
    document.getElementById('addVehiculoForm').reset();
    fetchVehiculos();
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('.edit')) {
      const button = event.target.closest('.edit');
      const idVehiculo = button.getAttribute('data-id');
      const marca = button.getAttribute('data-marca');
      const color = button.getAttribute('data-color');
      const placa = button.getAttribute('data-placa');
      const tipo = button.getAttribute('data-tipo');
      const duenoID = button.getAttribute('data-duenoid');
      const cat7600 = button.getAttribute('data-cat7600');
      const activo = button.getAttribute('data-activo') === 'true' ? 'true' : 'false';

      document.getElementById('editMarca').value = marca;
      document.getElementById('editColor').value = color;
      document.getElementById('editPlaca').value = placa;
      document.getElementById('editTipo').value = tipo;
      document.getElementById('editCat7600').value = cat7600;
      document.getElementById('editActivo').value = activo;

      document.getElementById('editVehiculoForm').dataset.idVehiculo = idVehiculo;
      document.getElementById('editVehiculoForm').dataset.duenoID = duenoID;
    }
  });

  document.getElementById('editVehiculoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const idVehiculo = document.getElementById('editVehiculoForm').dataset.idVehiculo;
    const duenoID = document.getElementById('editVehiculoForm').dataset.duenoID;
    const marca = document.getElementById('editMarca').value;
    const color = document.getElementById('editColor').value;
    const placa = document.getElementById('editPlaca').value;
    const tipo = document.getElementById('editTipo').value;
    const cat7600 = document.getElementById('editCat7600').value === 'Si';
    const activo = document.getElementById('editActivo').value === 'true';

    if (activo) {
      // Verificar si el propietario ya tiene dos vehículos activos
      const { data: activeVehicles, error: activeVehiclesError } = await supabase
        .from('Vehiculos')
        .select('*')
        .eq('duenoID', duenoID)
        .eq('activo', true);

      if (activeVehiclesError) {
        console.error('Error checking active vehicles:', activeVehiclesError);
        return;
      }

      const editingVehicle = activeVehicles.find(vehicle => vehicle.idVehiculo == idVehiculo);

      if (activeVehicles.length >= 2 && !editingVehicle) {
        alert('El propietario ya tiene dos vehículos activos.');
        return;
      }
    }

    console.log('Editando vehículo con idVehiculo:', idVehiculo);

    const { data, error } = await supabase
      .from('Vehiculos')
      .update({ marca, color, placa, tipo, cat7600, activo })
      .eq('idVehiculo', idVehiculo);

    if (error) {
      console.error('Error updating data:', error);
      return;
    }

    alert('Vehículo actualizado exitosamente.');
    $('#editItemModal').modal('hide');
    fetchVehiculos();
  });

  fetchVehiculos();
  fetchUsuarios();
});
