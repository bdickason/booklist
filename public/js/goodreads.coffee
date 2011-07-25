$ ->
  
  ### General Site Stuffs ###
  $('.loadingDiv').hide().ajaxStart ->
    $(this).show()
  .ajaxStop ->
    $(this).hide()
    
  jQuery.ajaxSetup {async:true}
  
  
  ### GOODREADS ###
  
  # Grab list partial
  $('.shelfItems').each (index) ->
    console.log this
    id = $(this).attr('id')
    $(this).load('/lists/' + id)
    
    # $().get '/goodreads/list' + id, (data) ->
    #  $(this).closest('li').html(data)
    
    

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