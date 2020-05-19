function borrarItemCarrito (a) {
  $("#"+a).hide();
}

    $(".carrito").click(function() {

             var id = $(this).attr("data-id");
             var owner = $(this).attr("data-session");
             var p = $(this).attr("data-p");
             var t = $(this).attr("data-t");
             var shop = document.getElementById("shop");
             var total = $(".products").text();
             var sumar = $("#total").text();
             var suma = parseFloat(sumar) + parseFloat(p);

             let dos_decimales = suma.toFixed(2);
             
             $("#total").text(dos_decimales);

             $(".carrito").attr("disabled", "disabled");

             total++;

             $(".products").text(total);

             var min = 1;
             var max = 999;
             var num = Math.floor(Math.random() * max + min);
           
            $.ajax({
                        type:  'post',
                        url: "/addcarrito/"+id+"/",
                        data:{owner}, 
                        success:function(msj2){

                          if(msj2 === "carErr"){

                          $(".carrito").removeAttr("disabled");
                          alert("Error al intentar añadir el producto al carrito");

                          }else{

                          $(".carrito").removeAttr("disabled");

                              let miNodo = document.createElement('li');
                              miNodo.classList.add('list-group-item', 'justify-content-between','lh-condensed');
                              miNodo.setAttribute('id',msj2); 
                              // Body
                              let miNodo1 = document.createElement('div');
                              miNodo1.classList.add('d-flex');
                              // Titulo
                              let miNodo3 = document.createElement('div');
                              miNodo3 .setAttribute("style", "width: 100%;");
                              // Imagen
                              let miNodo2 = document.createElement('h6');
                              miNodo2.classList.add('my-0');
                              miNodo2.textContent = p+"€";
                              // Precio
                              let miNodo6 = document.createElement('small');
                              miNodo6.classList.add('text-muted');
                              miNodo6.textContent = t;

                              let miNodo5 = document.createElement('p');
                              let miNodo4 = document.createElement('button');
                              miNodo4.classList.add('btn','btn-link','mx-2','delete','warning','float-right');
                              miNodo4.setAttribute('data-id',msj2); 
                              miNodo4.setAttribute('data-t',t); 
                              miNodo4.setAttribute('data-p',p); 
                              miNodo4.setAttribute('data-id',msj2); 
                              miNodo4.innerHTML = "<i class='far fa-trash-alt'></i>";


                              miNodo.appendChild(miNodo1);
                              miNodo.appendChild(miNodo2);
                              miNodo.appendChild(miNodo3);
                              miNodo.appendChild(miNodo4);
                              miNodo.appendChild(miNodo6);
                              miNodo.appendChild(miNodo5);
                              shop.appendChild(miNodo);

                          }

                        }

            });

            // Insertamos

    });

    $(document).on('click', '.delete',function (e) {

            var id = $(this).attr("data-id");
            var p = $(this).attr("data-p");
            $(".delete").attr("disabled", "disabled");

            var sumar = $("#total").text();  

            var suma =  parseFloat(sumar) - parseFloat(p);   
            
            let number = suma

            let dos_decimales = number.toFixed(2);
       
             
            // Igual a 5.57  
            $("#total").text(dos_decimales);
     

            $.ajax({
                        type:  'post',
                        url: "/deletecarrito",
                        data:{id}, 
                        success:function(msj2){

                          if(msj2 == true){

                          $(".delete").removeAttr("disabled");
                          $("#"+id).hide(); 

                          var total = $(".products").text();

                          var total = parseFloat(total) - 1;

                          $(".products").text(total);

                          }

                        }
            });       
    });