document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";

  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function fetchParqueos() {
    try {
      const { data, error } = await supabase.from('Parqueo').select('*');
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

      data.forEach(parqueo => {
        const activo = parqueo.activo ? 'Sí' : 'No';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${parqueo.numParqueo}</td>
          <td>${parqueo.capacidadRegular}</td>
          <td>${parqueo.capacidadMoto}</td>
          <td>${parqueo.capacidad7600}</td>
          <td>${activo}</td>
          <td>
            <a href="#editItemModal" class="edit" data-toggle="modal" data-numparqueo="${parqueo.numParqueo}" data-capacidadregular="${parqueo.capacidadRegular}" data-capacidadmoto="${parqueo.capacidadMoto}" data-capacidad7600="${parqueo.capacidad7600}" data-activo="${parqueo.activo}"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
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

  function validateInputs(...inputs) {
    for (const input of inputs) {
      if (input.value < 1) {
        alert("Los valores deben ser números mayores o iguales a 1.");
        return false;
      }
    }
    return true;
  }

  function isNumeric(value) {
    return /^\d+$/.test(value);
  }

  document.getElementById('addParqueoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const numParqueo = document.getElementById('numParqueo');
    const capacidadRegular = document.getElementById('capacidadRegular');
    const capacidadMoto = document.getElementById('capacidadMoto');
    const capacidad7600 = document.getElementById('capacidad7600');

    if (!isNumeric(numParqueo.value)) {
      alert("El número de parqueo debe ser un valor numérico.");
      return;
    }

    if (!validateInputs(capacidadRegular, capacidadMoto, capacidad7600)) {
      return;
    }

    // Verificar si el número de parqueo ya existe
    const { data: existingData, error: existingError } = await supabase
      .from('Parqueo')
      .select('*')
      .eq('numParqueo', numParqueo.value);

    if (existingError) {
      console.error('Error checking existing data:', existingError);
      return;
    }

    if (existingData.length > 0) {
      alert('El número de parqueo ya existe. Por favor, ingrese un número diferente.');
      return;
    }

    console.log('Agregando nuevo parqueo...');
    const { data, error } = await supabase.from('Parqueo').insert([{ numParqueo: numParqueo.value, capacidadRegular: capacidadRegular.value, capacidadMoto: capacidadMoto.value, capacidad7600: capacidad7600.value }]);

    if (error) {
      console.error('Error inserting data:', error);
      return;
    }

    alert('Parqueo agregado exitosamente.');
    $('#addItemModal').modal('hide');
    document.getElementById('addParqueoForm').reset();
    fetchParqueos();
  });

  document.addEventListener('click', function(event) {
    if (event.target.closest('.edit')) {
      const button = event.target.closest('.edit');
      const numParqueo = button.getAttribute('data-numparqueo');
      const capacidadRegular = button.getAttribute('data-capacidadregular');
      const capacidadMoto = button.getAttribute('data-capacidadmoto');
      const capacidad7600 = button.getAttribute('data-capacidad7600');
      const activo = button.getAttribute('data-activo') === 'true' ? 'true' : 'false';

      document.getElementById('editNumParqueo').value = numParqueo;
      document.getElementById('editCapacidadRegular').value = capacidadRegular;
      document.getElementById('editCapacidadMoto').value = capacidadMoto;
      document.getElementById('editCapacidad7600').value = capacidad7600;
      document.getElementById('editActivo').value = activo;

      document.getElementById('editParqueoForm').dataset.numParqueo = numParqueo;
    }
  });

  document.getElementById('editParqueoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const numParqueo = document.getElementById('editParqueoForm').dataset.numParqueo;
    const capacidadRegular = document.getElementById('editCapacidadRegular');
    const capacidadMoto = document.getElementById('editCapacidadMoto');
    const capacidad7600 = document.getElementById('editCapacidad7600');
    const activo = document.getElementById('editActivo').value === 'true';

    if (!validateInputs(capacidadRegular, capacidadMoto, capacidad7600)) {
      return;
    }

    console.log('Editando parqueo con numParqueo:', numParqueo);

    const { data, error } = await supabase
      .from('Parqueo')
      .update({ capacidadRegular: capacidadRegular.value, capacidadMoto: capacidadMoto.value, capacidad7600: capacidad7600.value, activo })
      .eq('numParqueo', numParqueo);

    if (error) {
      console.error('Error updating data:', error);
      return;
    }

    alert('Parqueo actualizado exitosamente.');
    $('#editItemModal').modal('hide');
    fetchParqueos();
  });

  fetchParqueos();
});
