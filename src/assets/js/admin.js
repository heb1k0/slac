function borrarItemCarrito (a) {
  $("#"+a).hide();
}

  function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
  }

  $(document).on('click', '.checking',function (e) {

    var id = $(this).attr("data-id");
    var idc = $(this).attr('id')

    function update(id,idc,value){

      var value = value;
      $.ajax({
        type:  'POST',
        url: "/back/admin/push/carito/",
        data: {id,idc,value},
        success:function(msj2){

          console.log(msj2)

          if(msj2){
             return true
          }else{
             return false
          }

        }
      });
    }
    
  if( $(this).is(':checked') ){
      // Hacer algo si el checkbox ha sido seleccionado

      if(update(id,idc,true)){

        $("#"+id).prop("checked", true);

      }else{

        $("#"+id).prop("checked", false);

      }


  } else {
      // Hacer algo si el checkbox ha sido deseleccionado
      if(update(id,idc,false)){

        $("#"+id).prop("checked", true);

      }else{

        $("#"+id).prop("checked", false);

      }
  }
});


//IMG profile

$(document).ready(function(e){
  $("#uploadForm").on('submit', function(e){
      e.preventDefault();
      var file = $("#file").val();
      if(file === ""){

        $("#file").addClass("alert-danger animate__animated animate__shakeX");

      }else{

        $("#file").removeClass("alert-danger");
      
      var id = $(this).attr("data-id");

      $.ajax({
          type: 'POST',
          url: '/api/upload-logo/'+id+'/',
          data: new FormData(this),
          contentType: false,
          cache: false,
          processData:false,
          beforeSend: function(){
              $('.submitBtn').attr("disabled","disabled");
              $('#uploadForm').css("opacity",".5");
          },
          success: function(msg){
              $('.statusMsg').html('');
              if(msg){
                  $('#uploadForm')[0].reset();
                  $('.statusMsg').html('<span style="font-size:18px;color:#34A853">Form data submitted successfully.</span>');
                  $('#myImg').attr("src","../../../asset/img/logo/"+msg);
              }else{
                  $('.statusMsg').html('<span style="font-size:18px;color:#EA4335">Some problem occurred, please try again.</span>');
              }
              $('#fupForm').css("opacity","");
              $(".submitBtn").removeAttr("disabled");
          }
      });
    }
  });
  
  //file type validation
  $("#file").change(function() {
      var file = this.files[0];
      var imagefile = file.type;
      var match= ["image/jpeg","image/png","image/jpg"];
      if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))){
          alert('Please select a valid image file (JPEG/JPG/PNG).');
          $("#file").val('');
          return false;
      }
  });
});




$(document).on('click', '.status',function (e) {
  
  var id = $(this).attr("data-id");
  $(".status").attr("disabled", "disabled");

  $.ajax({
    type:  'get',
    url: "/admin/status/"+id+"/",
    success:function(msj2){

        console.log(msj2);

        if(msj2 === false){
            $("#"+id).addClass('alert-warning');
            $("#"+id).removeClass('alert-info');
            $("#b"+id).addClass('btn-warning');
            $("#b"+id).removeClass('btn-info');
            $("#b"+id).text('Pedido pendiente');
            $(".status").removeAttr("disabled");
        }else if(msj2 === true){
            $("#"+id).addClass('alert-info');
            $("#"+id).removeClass('alert-warning');
            $("#b"+id).addClass('btn-info');
            $("#b"+id).removeClass('btn-warning');
            $("#b"+id).text('En proceso');
            $(".status").removeAttr("disabled");
        }else{
            alert("Error interno")
            $(".status").removeAttr("disabled");
        }

    }
  });       
    
  event.preventDefault();   
});
// Editar perfil
function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

$("#editProfile").submit(function( event ) {
  var $form = $(this);
  var id = $(this).data("id");
  var msj= getFormData($form);    
  $.ajax({
    type:  'post',
    url: "/api/edit-profile/"+id+"/",
    data: {msj},
    success:function(msj2){
          console.log(msj)
    }
  });   
  event.preventDefault();
});


$(document).on('click', '.delete-item',function (e) {
  
  var id = $(this).attr("data-id");

  $.ajax({
    type:  'post',
    url: "/back/admin/delete-item/",
    data: {id},
    success:function(msj2){
          $("#menu"+id).hide();
    }
  });       
    
  event.preventDefault();   
});

$(document).on('click', '.novisto',function (e) {
  
  var id = $(this).attr("data-id");

  $.ajax({
    type:  'post',
    url: "/api/back/admin/visto/",
    data: {id},
    success:function(msj2){

        console.log(msj2)

        if(msj2){
          $("#card"+id).removeClass("novisto");
          $("#card"+id).removeClass("shadow-left-lg");
          $("#navbarDropdownAlerts").removeClass("green");
          $("#not"+id).hide();
        }else{
          console.log(msj2)
        }

    }
  });   
    
  event.preventDefault();   
});



$(document).on('click', '.completado',function (e) {
  
    var id = $(this).attr("data-id");
    $(".completado").attr("disabled", "disabled");
  
    Swal.fire({
      title: 'Confirmar pedido',
      text: "¿Estas seguro de que el pedido esta completo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        $.ajax({
          type:  'POST',
          url: "/back/admin/complete/",
          data: {id:id},
          success:function(msj2){

            console.log(msj2)
      
              if(msj2 === true){
                 $("#card"+id).hide();
              }
      
          }
        });       
        
      }
    })
  
      
    event.preventDefault();   
  });

