'use strict';

$(document).ready(function() {
  $('body').on('click', '.top', function() {
    $('nav.menu').toggleClass('menu_show');
  });

  $('form').hide();
  $('.show-form').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();


    let showSingleForm = '.' + $(this).val();
    console.log($(e.target).parent());
    $(this).hide();
    if(showSingleForm === '.'){
      $('form').show()
    } else {
      $(`${showSingleForm}`).show();

    }
  });


});
