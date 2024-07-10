document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function fetchVehiculos() {
    try {
      const { data, error } = await supabase.from('Vehiculos').select('*');
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No data found');
        return;
      }

      console.log('Datos obtenidos de Supabase:', data);

      const tbody = document.querySelector('table tbody');
      tbody.innerHTML = '';

      data.forEach(vehiculo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${vehiculo.marca}</td>
          <td>${vehiculo.color}</td>
          <td>${vehiculo.placa}</td>
          <td>${vehiculo.tipo}</td>
          <td>${vehiculo.duenoID}</td>
          <td>${vehiculo.cat7600 ? 'Si' : 'No'}</td>
          <td>
            <a href="#editItemModal" class="edit" data-toggle="modal" data-id="${vehiculo.idVehiculo}" data-marca="${vehiculo.marca}" data-color="${vehiculo.color}" data-placa="${vehiculo.placa}" data-tipo="${vehiculo.tipo}" data-duenoid="${vehiculo.duenoID}" data-cat7600="${vehiculo.cat7600 ? 'Si' : 'No'}"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
            <a href="#deleteItemModal" class="delete" data-toggle="modal" data-id="${vehiculo.idVehiculo}"><i class="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i></a>
          </td>
        `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll('[data-toggle="tooltip"]').forEach(element => {
        element.addEventListener('mouseover', function() {
          const tooltipText = this.getAttribute('title');
          const tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          tooltip.innerText = tooltipText;
          document.body.appendChild(tooltip);
          tooltip.style.left = this.getBoundingClientRect().left + 'px';
          tooltip.style.top = this.getBoundingClientRect().top - tooltip.offsetHeight + 'px';
        });
        element.addEventListener('mouseout', function() {
          document.querySelector('.tooltip').remove();
        });
      });
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  }

  async function fetchUsuarios() {
    try {
      const { data, error } = await supabase.from('Usuario').select('*');
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

      const editPropietarioSelect = document.getElementById('editPropietario');
      editPropietarioSelect.innerHTML = '<option value="">Seleccione el propietario del vehículo</option>';

      data.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.cedula; // Usando la cédula como valor
        option.textContent = `${usuario.cedula} - ${usuario.nombre}`;
        editPropietarioSelect.appendChild(option);
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

  document.getElementById('propietario').addEventListener('change', async function(event) {
    const cedula = event.target.value;
    const usuario = await getUsuarioIDByCedula(cedula);

    if (usuario) {
      console.log(`ID del usuario seleccionado: ${usuario.idUsuario}`);
    } else {
      console.log('No se encontró el ID del usuario.');
    }
  });

  document.getElementById('addVehiculoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const marca = document.getElementById('marca').value;
    const color = document.getElementById('color').value;
    const placa = document.getElementById('placa').value;
    const tipo = document.getElementById('tipo').value;
    const cedula = document.getElementById('propietario').value; // Obteniendo la cédula del propietario
    const usuario = await getUsuarioIDByCedula(cedula); // Obteniendo el id del propietario usando la cédula
    const duenoID = usuario ? usuario.idUsuario : null;
    const cat7600 = document.getElementById('cat7600').value === 'Si';
    const activo = true;

    if (!duenoID) {
      alert('No se encontró el ID del propietario.');
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
    console.log(`marca: ${marca}`);
    console.log(`color: ${color}`);
    console.log(`placa: ${placa}`);
    console.log(`tipo: ${tipo}`);
    console.log(`duenoID: ${duenoID}`);
    console.log(`cat7600: ${cat7600}`);
    console.log(`activo: ${activo}`);

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

  document.addEventListener('click', function(event) {
    if (event.target.closest('.edit')) {
      const button = event.target.closest('.edit');
      const idVehiculo = button.getAttribute('data-id');
      const marca = button.getAttribute('data-marca');
      const color = button.getAttribute('data-color');
      const placa = button.getAttribute('data-placa');
      const duenoID = button.getAttribute('data-duenoid');
      const cat7600 = button.getAttribute('data-cat7600');

      document.getElementById('editMarca').value = marca;
      document.getElementById('editColor').value = color;
      document.getElementById('editPlaca').value = placa;
      document.getElementById('editCat7600').value = cat7600;

      document.getElementById('editVehiculoForm').dataset.idVehiculo = idVehiculo;
    }

    if (event.target.closest('.delete')) {
      const button = event.target.closest('.delete');
      const idVehiculo = button.getAttribute('data-id');
      document.getElementById('deleteVehiculoForm').dataset.idVehiculo = idVehiculo;
    }
  });

  document.getElementById('editVehiculoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const idVehiculo = document.getElementById('editVehiculoForm').dataset.idVehiculo;
    const marca = document.getElementById('editMarca').value;
    const color = document.getElementById('editColor').value;
    const placa = document.getElementById('editPlaca').value;
    const cat7600 = document.getElementById('editCat7600').value === 'Si';

    console.log('Editando vehículo con idVehiculo:', idVehiculo);

    console.log(`marca: ${marca}`);
    console.log(`color: ${color}`);
    console.log(`placa: ${placa}`);
    console.log(`cat7600: ${cat7600}`);

    const { data, error } = await supabase
      .from('Vehiculos')
      .update({ marca, color, placa, cat7600 })
      .eq('idVehiculo', idVehiculo);

    if (error) {
      console.error('Error updating data:', error);
      return;
    }

    alert('Vehículo actualizado exitosamente.');
    $('#editItemModal').modal('hide');
    fetchVehiculos();
  });

  document.getElementById('deleteVehiculoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const idVehiculo = document.getElementById('deleteVehiculoForm').dataset.idVehiculo;

    console.log('Eliminando vehículo con idVehiculo:', idVehiculo);

    const { data, error } = await supabase
      .from('Vehiculos')
      .delete()
      .eq('idVehiculo', idVehiculo);

    if (error) {
      console.error('Error deleting data:', error);
      return;
    }

    alert('Vehículo eliminado exitosamente.');
    $('#deleteItemModal').modal('hide');
    fetchVehiculos();
  });

  fetchVehiculos();
  fetchUsuarios();
});
