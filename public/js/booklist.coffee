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
    $(this).load('/lists/' + id)

  ### PAGING ###

  currentPosition = 0
  bookWidth = 150
  books = $('.book')
  numberOfBooks = books.length
  console.log 'got here!'
  $('.book').wrapAll '<div id="bookHolder"></div>'
  $('.book').css { 'float': 'left' }
  speed = 3000
  slideShowInterval = setInterval(changePosition, speed);

  $('bookHolder').css 'width', bookWidth * numberOfBooks

  changePosition = () ->
    console.log 'tst'
    if currentPosition == (numberOfBooks - 1)
      currentPosition = 0
    else
      currentPosition++
    moveBook()

  moveBook = ()  ->
    console.log 'tst'
    $('bookHolder').animate { 'marginLeft': bookWidth*(-currentPosition) }
  
    

  ### PAGING ###
  
  ###
  $.fn.infiniteCarousel = ->
    repeat = (str, num) ->
      new (Array num+1).join(str)
    
    this.each ->
      $wrapper = $('> div', this).css 'overflow', 'hidden'
      $slider = $wrapper.find '> ul'
      $items = $slider.find '> li'
      $single = $items.filter ':first'
      
      singleWidth = $single.outerWidth()
      visible = Math.ceil $wrapper.innerWidth() / singleWidth
      currentPage = 1
      pages = Math.ceil $items.length / visible
      
      # 1. Pad so that 'visible' number will always be seen, otherwise create empty items
      if ($items.length % visible) != 0
        $slider.append repeat '<li class="empty" />', visible - ($items.length % visible)
        $items = slider.find '> li'
      
      # 2. Top and tail the list with 'visible' number of items, top has the last section
      $items.filter ':first'.before $items.slice(- visible).clone().addClass 'cloned'
      $items.filter ':last'.after $items.slice(0, visible).clone().addClass 'cloned'
      $items = $slider.find '> li'  # reselect
      
      # 3. Set the left position to the last 'real' item
      $wrapper.scrollLeft singleWidth * visible
      
      # 4. Paging function
      gotoPage = (page) ->
        dir = page < currentPage ? -1 : 1
        n = Math.abs currentPage - page
        left = singleWidth * dir * visible * n
        
        $wrapper.filter ':not(:animated)'.animate {scrollLeft: '+=' + left}, 500, ->
          if page == 0
            $wrapper.scrollLeft singleWidth * visible * pages
            page = pages
          else if page > pages
            $wrapper.scrollLeft singleWidth * visible
            page = 1
          currentPage = page
        
        false
      
      $wrapper.after '<a class="arrow back">&lt;</a><a class="arrow forward">&gt;</a>'
        
      # 5. Bind to the forward and back buttons
      $('a.back', this).click ->
        gotoPage currentPage - 1

      $('a.forward', this).click ->
        gotoPage currentPage + 1
        
      # create a public interface to move to a specific page
      $(this).bind 'goto', (event, page) ->
        gotoPage page
        
  $(document).ready ->
    $('.infiniteCarousel').infiniteCarousel()
    
    ###