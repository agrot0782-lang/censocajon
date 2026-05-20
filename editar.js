// ✏️ EDITAR
function editarTrabajador(key){

    let trabajador = lista.find(p => p.key == key);

    if(!trabajador){

        Swal.fire({
            icon:'error',
            title:'Error',
            text:'Trabajador no encontrado'
        });

        return;
    }

    Swal.fire({

        title:'Editar trabajador',

        width:800,

       html:`

   

    <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
    ">


                <input id="swal-id"
                    class="swal2-input texto-mayus"
                    placeholder="ID"
                    value="${trabajador.id || ''}">

                <input id="swal-nombre"
                    class="swal2-input texto-mayus"
                    placeholder="Nombre"
                    value="${trabajador.nombre || ''}">

                <input id="swal-apellidos"
                    class="swal2-input texto-mayus"
                    placeholder="Apellidos"
                    value="${trabajador.apellidos || ''}">
<select id="swal-sexo"
    class="swal-select">
                    class="swal2-input">

                    <option value="MASCULINO"
                        ${trabajador.sexo === 'MASCULINO' ? 'selected' : ''}>
                        MASCULINO
                    </option>

                    <option value="FEMENINO"
                        ${trabajador.sexo === 'FEMENINO' ? 'selected' : ''}>
                        FEMENINO
                    </option>

                </select>

                <input id="swal-traila"
                    class="swal2-input texto-mayus"
                    placeholder="Traila"
                    value="${trabajador.traila || ''}">

                <input id="swal-cama"
                    class="swal2-input texto-mayus"
                    placeholder="Cama"
                    value="${trabajador.cama || ''}">

              <select id="swal-estado"
    class="swal-select">

                    <option value="OCUPADO"
                        ${trabajador.estado === 'OCUPADO' ? 'selected' : ''}>
                        OCUPADO
                    </option>

                    <option value="VACIA"
                        ${trabajador.estado === 'VACIA' ? 'selected' : ''}>
                        VACIA
                    </option>

                </select>

            </div>

        `,

        showCancelButton:true,
        confirmButtonText:'Guardar',
        cancelButtonText:'Cancelar',
        confirmButtonColor:'#3085d6',

        didOpen:()=>{

            document.querySelectorAll('.texto-mayus').forEach(input=>{

                input.addEventListener('input', function(){

                    this.value = this.value.toUpperCase();

                });

            });

        },

        preConfirm:()=>{

            return {

                nuevoID:
                    document.getElementById('swal-id').value.toUpperCase(),

                nuevoNombre:
                    document.getElementById('swal-nombre').value.toUpperCase(),

                nuevosApellidos:
                    document.getElementById('swal-apellidos').value.toUpperCase(),

                nuevoSexo:
                    document.getElementById('swal-sexo').value.toUpperCase(),

                nuevaTraila:
                    document.getElementById('swal-traila').value.toUpperCase(),

                nuevaCama:
                    document.getElementById('swal-cama').value.toUpperCase(),

                nuevoEstado:
                    document.getElementById('swal-estado').value.toUpperCase()

            };

        }

    }).then((result)=>{

        if(!result.isConfirmed){
            return;
        }

        let {
            nuevoID,
            nuevoNombre,
            nuevosApellidos,
            nuevoSexo,
            nuevaTraila,
            nuevaCama,
            nuevoEstado
        } = result.value;

        // 🔥 VALIDAR SI EL ID YA ESTA OCUPADO
        db.ref("censo_cajon")
        .orderByChild("id")
        .equalTo(texto(nuevoID))
        .once("value", snapshot => {

            let encontrado = null;

            snapshot.forEach(child => {

                let d = child.val();

                if(
                    child.key !== key &&
                    d.estado === ESTADOS.OCUPADO
                ){

                    encontrado = {
                        key: child.key,
                        traila: d.traila,
                        cama: d.cama
                    };

                }

            });

            // 🔥 SI YA TIENE CAMA
            if(encontrado){

                Swal.fire({

                    title:'Trabajador ya asignado',

                    text:
                    `Actualmente está en Traila ${encontrado.traila} Cama ${encontrado.cama}`,

                    icon:'warning',

                    showCancelButton:true,

                    confirmButtonText:'Mover trabajador',
                    cancelButtonText:'Cancelar'

                }).then((moveResult)=>{

                    if(!moveResult.isConfirmed){
                        return;
                    }

                    moverTrabajador();

                });

            }
            else{

                moverTrabajador();

            }

            // 🔥 FUNCION INTERNA
            function moverTrabajador(){

                let nuevaKey = nuevaTraila + "_" + nuevaCama;

                // 🔥 VALIDAR NUEVA CAMA
                db.ref("censo_cajon/" + nuevaKey)
                .once("value", snap => {

                    let cama = snap.val();

                    // 🚫 SI LA CAMA ESTA OCUPADA
                    if(
                        cama &&
                        cama.estado === ESTADOS.OCUPADO &&
                        texto(cama.id) !== texto(nuevoID)
                    ){

                        Swal.fire({
                            icon:'warning',
                            title:'Cama ocupada',
                            text:'Esa cama ya está ocupada'
                        });

                        return;
                    }

                    // 🔥 VACIAR CAMA ANTERIOR
                    if(encontrado){

                        db.ref("censo_cajon/" + encontrado.key).update({

                            id:"",
                            nombre:"",
                            apellidos:"",
                            sexo:"",
                            estado:ESTADOS.VACIA

                        });

                    }

                    // 🔥 SI CAMBIO DE CAMA
                    if(nuevaKey !== key){

                        db.ref("censo_cajon/" + key).update({

                            id:"",
                            nombre:"",
                            apellidos:"",
                            sexo:"",
                            estado:ESTADOS.VACIA

                        });

                    }

                    // 🔥 GUARDAR NUEVA ASIGNACION
                    db.ref("censo_cajon/" + nuevaKey).set({

                        id: texto(nuevoID),
                        nombre: texto(nuevoNombre),
                        apellidos: texto(nuevosApellidos),
                        traila: nuevaTraila,
                        cama: nuevaCama,
                        sexo: texto(nuevoSexo),
                        estado: texto(nuevoEstado)

                    });

                    Swal.fire({
                        icon:'success',
                        title:'Actualizado',
                        text:'Trabajador actualizado correctamente',
                        confirmButtonColor:'#3085d6'
                    });

                });

            }

        });

    });

}