$ ->
  
  ### General Site Stuffs ###
  
  # Hide loading div until we're actually loading!
  $('.loadingDiv').hide().ajaxStart ->
    $(this).show()
  .ajaxStop ->
    $(this).hide()
  
  jQuery.ajaxSetup {async:true}
  
  
  ### Lists ###
  
  # Grab list partial
  $('.shelfItems').each (index) ->
    console.log 'test'
    id = $(this).attr('id')
    $(this).load '/lists/' + id, (response, status, xhr) ->
      # console.log $(this).filter('.shelfItems')
      if status != 'error'
        ### PAGING ###
        console.log $('#' + id + ' .shelfItems')
        currentPosition = 0
        bookWidth = 150
        changePosition = () ->
          if currentPosition == (numberOfBooks - 1)
            currentPosition = 0
          else
            currentPosition++
          moveBook()

        $('#bookHolder_' + id).css 'width', bookWidth * numberOfBooks

        moveBook = ()  ->
          tmp = bookWidth*(-currentPosition)
          $('#bookHolder_' + id).animate { 'marginLeft': bookWidth*(-currentPosition) }
          
        books = $('.book')
        numberOfBooks = books.length
        $('#' + id + ' .shelfItems').wrapInner '<div id="bookHolder_' + id + '"></div>'
        books.css { 'float': 'left' }
        speed = 3000
        slideShowInterval = setInterval(changePosition, speed);

        
        console.log $('bookHolder')
        

  
        
        
        