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
    /* Lists */
    return $('.shelfItems').each(function(index) {
      var id;
      console.log('test');
      id = $(this).attr('id');
      return $(this).load('/lists/' + id, function(response, status, xhr) {
        var bookWidth, books, changePosition, currentPosition, moveBook, numberOfBooks, slideShowInterval, speed;
        if (status !== 'error') {
          /* PAGING */
          console.log($('#' + id + ' .shelfItems'));
          currentPosition = 0;
          bookWidth = 150;
          changePosition = function() {
            if (currentPosition === (numberOfBooks - 1)) {
              currentPosition = 0;
            } else {
              currentPosition++;
            }
            return moveBook();
          };
          $('#bookHolder_' + id).css('width', bookWidth * numberOfBooks);
          moveBook = function() {
            var tmp;
            tmp = bookWidth * (-currentPosition);
            return $('#bookHolder_' + id).animate({
              'marginLeft': bookWidth * (-currentPosition)
            });
          };
          books = $('.book');
          numberOfBooks = books.length;
          $('#' + id + ' .shelfItems').wrapInner('<div id="bookHolder_' + id + '"></div>');
          books.css({
            'float': 'left'
          });
          speed = 3000;
          slideShowInterval = setInterval(changePosition, speed);
          return console.log($('bookHolder'));
        }
      });
    });
  });
}).call(this);
