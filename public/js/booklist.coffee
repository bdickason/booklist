$ ->
  
  ### General Site Stuffs ###
  
  # Hide loading div until we're actually loading!
  $('.loadingDiv').hide().ajaxStart ->
    $(this).show()
  .ajaxStop ->
    $(this).hide()
  
  jQuery.ajaxSetup {async:true}
  
  ### Lists ###

  shelves = []  

  # Move the current shelf line left
  $('.leftArrow').bind 'click', ->
    currentShelf = shelves[($(this).closest('li').children('.shelfItems').attr 'data-index')-1]
    currentShelf.changePosition('left')

  # Move the current shelf line right
  $('.rightArrow').bind 'click', ->
    currentShelf = shelves[($(this).closest('li').children('.shelfItems').attr 'data-index')-1]
    currentShelf.changePosition('right')


  # Grab list partial
  $('.shelfItems').each (index) ->
    id = $(this).attr('id')
  
    $(this).load '/lists/' + id, (response, status, xhr) ->
      if status != 'error'
        
        # Load a bunch 'o shelves
        shelves.push new Shelf { 'id': id, 'bookWidth': 150 }
        
        # hack to keep track of which array is which (avoids a for each)
        $(this).attr 'data-index', shelves.length 
      
#        speed = 3000
#        slideShowInterval = setInterval(changePosition, speed);    
    
  ### Shelf - A slide-able shelf object :) ###
  class Shelf
    constructor: (config) ->
      @currentPosition = 0  # Will always start in position 0
      @id = config.id or ''
      @bookWidth = config.bookWidth or 150
      @books = $('#' + @id + ' .shelfItems').find '.book'
      @numberOfBooks = @books.length
      
      @books.css { 'float': 'left' }
      $('#bookHolder_' + @id).css 'width', @bookWidth * @numberOfBooks
      $('#' + @id + ' .shelfItems').wrapInner '<div id="bookHolder_' + @id + '"></div>'

    changePosition: (direction) ->
      switch direction
        when 'left'
          if @currentPosition == 0
            @currentPosition = @numberOfBooks - 1
          else
            @currentPosition--
        when 'right'          
          if @currentPosition > (@numberOfBooks - 2)
            @currentPosition = 0
          else
            @currentPosition++

      @moveBook()

    moveBook: ->
      $('#bookHolder_' + @id).animate { 'marginLeft': @bookWidth*(-@currentPosition) }
    
    
      
    
      

  
        
        
        