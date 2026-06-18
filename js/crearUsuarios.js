console.log("crearUsuarios.js cargado");

window.crearUsuarios = function(){

    db.ref("usuarios").set({

        admin:{

            nombre:"NOE",

            password:"122486",

            rol:"ADMIN"

        },

        Mauricio:{

            nombre:"MAURICIO",

            password:"170626",

            rol:"SUPERVISOR"

        },

        Alejandra:{

            nombre:"ALEJANDRA",

            password:"010126",

            rol:"SUPERVISOR"

        },

        Lilia:{

            nombre:"LILIA",

            password:"121226",

            rol:"SUPERVISOR"

        }

    })

    .then(()=>{

        Swal.fire({

            icon:"success",

            title:"✅ Usuarios creados",

            text:"La base de usuarios fue creada correctamente"

        });

    })

    .catch(error=>{

        console.error(error);

        Swal.fire({

            icon:"error",

            title:"Error",

            text:error.message

        });

    });

};