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
      console.log $(this)
      if status != 'error'
        book_sliders {'id': }
        
        ### PAGING ###
        currentPosition = 0
        bookWidth = 150
        changePosition = () ->
          if currentPosition > (numberOfBooks - 1)
            currentPosition = 0
          else
            currentPosition++
          # console.log id + ' Position: ' + @currentPosition + 'Number: ' + @numberOfBooks
          moveBook()

        $('#bookHolder_' + id).css 'width', bookWidth * numberOfBooks

        moveBook = ()  ->
          $('#bookHolder_' + id).animate { 'marginLeft': bookWidth*(-currentPosition) }
          
        books = $('.book')
        numberOfBooks = books.length
        $('#' + id + ' .shelfItems').wrapInner '<div id="bookHolder_' + id + '"></div>'
        books.css { 'float': 'left' }
        speed = 3000
        slideShowInterval = setInterval(changePosition, speed);
        

  
        
        
        