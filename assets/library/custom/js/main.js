$(document).ready(function(){

  // Initiate the wowjs
  new WOW().init();

  // preload
  var preloader = document.getElementById("preloader-section");
  if (preloader) {
    window.addEventListener("load", function(){
      preloader.style.display = "none";
    });
  }  

  // header on scroll
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 300 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
    });
  }

  // quick links on click
  $('.scrollto').bind('click', function(event) {
    var $anchor = $(this);
    var nav = $($anchor.attr('href'));
    if (nav.length) {
      $('html, body').stop().animate({				
        scrollTop: $($anchor.attr('href')).offset().top				
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
    }
  });

  // images lightbox popup
  var $gallery = new SimpleLightbox('.soln-gallery a', {});
  var $gallery = new SimpleLightbox('.testi-gallery a', {});

  // testimonials carousel
  $(".testimonial-carousell").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    dots: true,
    loop: true,
  });
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    dots: false,
    loop: true,
    nav : true,
    navText : [
      '<i class="fa fa-arrow-left"></i>',
      '<i class="fa fa-arrow-right"></i>'
      
    ],
    responsive: {
      0:{
          items:1
      },
      768:{
          items:2
      }
    }
  });

  // info counter
  $('.counterUp').counterUp({
    delay: 10,
    time: 2000
  });

  // scroll to top  
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    $('.scroll-top').click(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return false;
    });
  }

});

$(".close-toast").click(function(){
  $("#toaster").toast("hide");
});

function showErrMsg(id, msg){
  $(id).html(msg);
};

function resetMsg(value){
	$(value).next().html('');
}

function btnLoader(status){
  if(status){
    $(".client-enquiry").attr("disabled", true);
    $(".client-enquiry span").removeClass("visually-hidden");
  }else{
    $(".client-enquiry").removeAttr("disabled");
    $(".client-enquiry span").addClass("visually-hidden");
  }  
}

function showToast(type, msg){
  $(".toast-head").html(type);
  $(".toast-msg").html(msg);
  $("#toaster").toast("show");
};

function resetClientEnquiry(){
  $('#client_name').val("");
  $('#client_email').val("");
  $('#client_phone').val("");
  $("#client_category").val("Architecture");
  $('#client_message').val("");  
};

function contactValidation(obj){
  var validation = false;
  if(obj.name == ''){
    var id = '#client_name_span';
    var msg = 'Client name should not empty!';
    showErrMsg(id, msg);
    var validation = true;
  }
  if(obj.name != '' && obj.name.length <= 2){
    var id = '#client_name_span';
    var msg = 'Client name should be more than 2 characters!';
    showErrMsg(id, msg);
    var validation = true;
  }
  if(
    obj.email == '' || 
    obj.email.indexOf("@", 0) < 0 || 
    obj.email.indexOf(".", 0) < 0
  ){
    var id = '#client_email_span';
    var msg = 'Please enter a valid Client Email!';
    showErrMsg(id, msg);
    var validation = true;
  }
  if(obj.phone == '' || obj.phone.length != 10){
    var id = '#client_phone_span';
    var msg = 'Please enter a valid Phone number!';
    showErrMsg(id, msg);
    var validation = true;
  }
  if(obj.message == ''){
    var id = '#client_message_span';
    var msg = 'Please enter your message!';
    showErrMsg(id, msg);
    var validation = true;
  }
  return validation;
};

function createTable(obj){
  var table = `
    <table style='width:100%;border: 1px solid black;border-radius: 10px;'>
      <tr>
        <th style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;'>Name</th>
        <th style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;'>Email</th>
        <th style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;'>Phone number</th>
        <th style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;'>Category</th>
      </tr>
      <tr>
        <td style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;text-align:center;'>
        `+ obj.name +`
        </td>
        <td style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;text-align:center;'>
        `+ obj.email +`
        </td>
        <td style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;text-align:center;'>
        `+ obj.phone +`
        </td>
        <td style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;text-align:center;'>
        `+ obj.category +`
        </td>
      </tr>
      <tr>
        <th style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;'>Message</th>
        <td colspan="3" style='border: 1px solid black;border-radius: 10px; padding: 5px 8px;'>
        `+ obj.message +`
        </th>
      </tr>
    </table>
  `;
  return table;
};

async function clientEnquiry(){
  var name = $('#client_name').val();
  var email = $('#client_email').val();
  var phone = $('#client_phone').val();
  var category = $("#client_category").val();
  var message = $('#client_message').val();
  var obj = {
    name: name,
    email: email, 
    phone: phone,
    category: category,
    message: message
  };
  // validation
  var validation = contactValidation(obj);

  if(validation == false){
    btnLoader(true);
    var body = createTable(obj);
    await elasticEmail(obj, body, function(err, res){
      if(res == "OK"){
        showToast("Success", "Your details forwarded to our admin!");
        resetClientEnquiry();
      }else{
        console.log("res err: ", err);
        showToast("Error", "Not able to send your details!");
      }
    });
    btnLoader(false);
  }  
};

async function elasticEmail(obj, body, cb) {
  let host = "smtp.elasticemail.com";
  let uname = "cyrickcreation@gmail.com";
  let pass = "4BF6E510CBE3B05A5C3C7E8A34BA744C8A17";
  
  let toEmail = uname;
  let subject = "Cyrick Enquiry!";
  
  await Email.send({
    Host: host,
    Username: uname,
    Password: pass,
    To: toEmail,
    Subject: subject,
    From: uname,
    Body: body,
  })
  .then(function(message){
    console.log("email success res: ", message);
    return cb(null, message);
  })
  .catch(function(err){
    console.log("email err: ", err);
    return cb(err);
  });
};
