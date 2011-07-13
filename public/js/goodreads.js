(function() {
  $(function() {
    /* General Site Stuffs */    $('.loadingDiv').hide().ajaxStart(function() {
      return $(this).show();
    }).ajaxStop(function() {
      return $(this).hide();
    });
    return jQuery.ajaxSetup({
      async: true
    });
    /* GOODREADS */
  });
}).call(this);
