document.addEventListener('DOMContentLoaded', async function() {
    const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    async function fetchUsers() {
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

            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';

            data.forEach(usuario => {
                let rol = '';
                switch (usuario.idRol) {
                    case 1: rol = 'Estudiante'; break;
                    case 2: rol = 'Administrativo'; break;
                    case 3: rol = 'Oficial de Seguridad'; break;
                    case 4: rol = 'AdminSistema'; break;
                    default: rol = 'Desconocido'; break;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.fechaNacimiento}</td>
                    <td>${usuario.cedula}</td>
                    <td>${rol}</td>
                    <td>${usuario.password}</td>
                    <td>
                        <a href="#editItemModal" class="edit" data-toggle="modal" data-cedula="${usuario.cedula}" data-nombre="${usuario.nombre}" data-apellidos="${usuario.apellidos}" data-correo="${usuario.email}" data-fecha="${usuario.fechaNacimiento}" data-rol="${usuario.idRol}" data-contrasena="${usuario.password}"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
                        <a href="#deleteItemModal" class="delete" data-toggle="modal" data-cedula="${usuario.cedula}"><i class="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i></a>
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

    document.getElementById('addUserForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const correo = document.getElementById('correo').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const cedula = document.getElementById('cedula').value;
        const rol = document.getElementById('rol').value;

        console.log('Verificando si el correo o la cédula ya existen...');
        const { data: existingUsers, error: checkError } = await supabase
            .from('Usuario')
            .select('*')
            .or(`email.eq.${correo},cedula.eq.${cedula}`);

        if (checkError) {
            console.error('Error checking existing users:', checkError);
            return;
        }

        if (existingUsers.length > 0) {
            alert('El correo o la cédula ya están registrados.');
            return;
        }

        console.log('Agregando nuevo usuario...');
        const { data, error } = await supabase.from('Usuario').insert([{ nombre, apellidos, email: correo, fechaNacimiento, cedula, idRol: parseInt(rol), isPaid: true }]);

        if (error) {
            console.error('Error inserting data:', error);
            return;
        }

        alert('Usuario agregado exitosamente.');
        $('#addItemModal').modal('hide');
        document.getElementById('addUserForm').reset();
        fetchUsers();
    });

    document.getElementById('deleteUserForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const cedula = document.querySelector('#deleteUserForm').dataset.cedula;
        if (!cedula) {
            console.log('No users selected for deletion');
            return;
        }

        const { data, error } = await supabase.from('Usuario').delete().eq('cedula', cedula);

        if (error) {
            console.error('Error deleting data:', error);
            return;
        }

        $('#deleteItemModal').modal('hide');
        fetchUsers();
    });

    document.addEventListener('click', function(event) {
        if (event.target.closest('.edit')) {
            const button = event.target.closest('.edit');
            const cedula = button.getAttribute('data-cedula');
            const nombre = button.getAttribute('data-nombre');
            const apellidos = button.getAttribute('data-apellidos');
            const correo = button.getAttribute('data-correo');
            const fecha = button.getAttribute('data-fecha');
            const rol = button.getAttribute('data-rol');
            const contrasena = button.getAttribute('data-contrasena');

            document.getElementById('editNombre').value = nombre;
            document.getElementById('editApellidos').value = apellidos;
            document.getElementById('editCorreo').value = correo;
            document.getElementById('editFechaNacimiento').value = fecha;
            document.getElementById('editCedula').value = cedula;
            document.getElementById('editCedula').disabled = true;
            document.getElementById('editRol').value = rol;
            document.getElementById('editContrasena').value = contrasena;

            document.getElementById('editUserForm').dataset.cedula = cedula;
        }

        if (event.target.closest('.delete')) {
            const button = event.target.closest('.delete');
            const cedula = button.getAttribute('data-cedula');
            document.querySelector('#deleteUserForm').dataset.cedula = cedula;
        }
    });

    document.getElementById('editUserForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const cedula = document.getElementById('editUserForm').dataset.cedula;
        const nombre = document.getElementById('editNombre').value;
        const apellidos = document.getElementById('editApellidos').value;
        const correo = document.getElementById('editCorreo').value;
        const fechaNacimiento = document.getElementById('editFechaNacimiento').value;
        const rol = document.getElementById('editRol').value;
        const contrasena = document.getElementById('editContrasena').value;

        console.log('Editando usuario con cédula:', cedula);

        const updateData = { nombre, apellidos, email: correo, fechaNacimiento, idRol: parseInt(rol) };
        if (contrasena) {
            updateData.password = contrasena;
        }

        const { data, error } = await supabase
            .from('Usuario')
            .update(updateData)
            .eq('cedula', cedula);

        if (error) {
            console.error('Error updating data:', error);
            return;
        }

        console.log('Datos actualizados:', data);
        $('#editItemModal').modal('hide');
        fetchUsers();
    });

    document.getElementById('showPassword').addEventListener('change', function() {
        const passwordField = document.getElementById('editContrasena');
        if (this.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    fetchUsers();
});
