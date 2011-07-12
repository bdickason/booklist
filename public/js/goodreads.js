(function() {
  $(function() {
    /* General Site Stuffs */    $('.loadingDiv').hide().ajaxStart(function() {
      return $(this).show();
    }).ajaxStop(function() {
      return $(this).hide();
    });
    jQuery.ajaxSetup({
      async: true
    });
    /* GOODREADS */
    return $('article a').each(function(index) {
      var id;
      id = $(this).attr('id');
      return $(this).closest('li').load('/goodreads/list/' + id);
    });
  });
}).call(this);
