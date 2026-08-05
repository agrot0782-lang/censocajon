// 🔥 VACIAR CAMA

function vaciarCama(key){

    // 🔥 CONFIRMACION
    let confirmar = confirm(
        "¿Seguro que deseas vaciar esta cama?"
    );

    if(!confirmar) return;

    // 🔥 LIMPIAR CAMA
    db.ref("censo_cajon/" + key)
    .update({

        id:"",
        nombre:"",
        apellidos:"",
        sexo:"",
        zona:"",
        celular:"",
        posicion:"",
        estado:"VACIA"

    })

    .then(()=>{

        console.log("✅ Cama vaciada");

    })

    .catch(error => {

        console.error(
            "❌ Error al vaciar cama:",
            error
        );

    });

}

function eliminarRegistro(key){

    Swal.fire({
        title: "¿Eliminar trabajador?",
        text: "El registro será eliminado permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc2626"
    }).then((result)=>{

        if(!result.isConfirmed) return;

        db.ref("censo_cajon/" + key)
        .remove()

        .then(()=>{

            Swal.fire({
                icon:"success",
                title:"Registro eliminado",
                timer:1200,
                showConfirmButton:false
            });

        })

        .catch(error=>{

            Swal.fire({
                icon:"error",
                title:"Error",
                text:error.message
            });

        });

    });

}
