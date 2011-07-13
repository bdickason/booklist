$ ->
  
  ### General Site Stuffs ###
  $('.loadingDiv').hide().ajaxStart ->
    $(this).show()
  .ajaxStop ->
    $(this).hide()
    
  jQuery.ajaxSetup {async:true}
  
  
  ### GOODREADS ###
  
  # Grab list partial
#  $('article a').each (index) ->
#    id = $(this).attr('id')
#    $(this).closest('li').load('/goodreads/list/' + id)
    
    # $().get '/goodreads/list' + id, (data) ->
    #  $(this).closest('li').html(data)