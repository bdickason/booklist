(function() {
  $(function() {
    /* General Site Stuffs */    var Shelf, shelves;
    $('.loadingDiv').hide().ajaxStart(function() {
      return $(this).show();
    }).ajaxStop(function() {
      return $(this).hide();
    });
    jQuery.ajaxSetup({
      async: true
    });
    shelves = [];
    /* Lists */
    shelves = [];
    $('.leftArrow').bind('click', function() {
      var currentShelf;
      currentShelf = shelves[($(this).closest('li').children('.shelfItems').attr('data-index')) - 1];
      return currentShelf.changePosition('left');
    });
    $('.rightArrow').bind('click', function() {
      var currentShelf;
      currentShelf = shelves[($(this).closest('li').children('.shelfItems').attr('data-index')) - 1];
      return currentShelf.changePosition('right');
    });
    $('.shelfItems').each(function(index) {
      var id;
      id = $(this).attr('id');
      return $(this).load('/lists/' + id, function(response, status, xhr) {
        if (status !== 'error') {
          shelves.push(new Shelf({
            'id': id,
            'bookWidth': 150
          }));
          return $(this).attr('data-index', shelves.length);
        }
      });
    });
    /* Shelf - A slide-able shelf object :) */
    return Shelf = (function() {
      function Shelf(config) {
        this.currentPosition = 0;
        this.id = config.id || '';
        this.bookWidth = config.bookWidth || 150;
        this.books = $('#' + this.id + ' .shelfItems').find('.book');
        this.numberOfBooks = this.books.length;
        this.books.css({
          'float': 'left'
        });
        $('#bookHolder_' + this.id).css('width', this.bookWidth * this.numberOfBooks);
        $('#' + this.id + ' .shelfItems').wrapInner('<div id="bookHolder_' + this.id + '"></div>');
      }
      Shelf.prototype.changePosition = function(direction) {
        switch (direction) {
          case 'left':
            if (this.currentPosition === 0) {
              this.currentPosition = this.numberOfBooks - 1;
            } else {
              this.currentPosition--;
            }
            break;
          case 'right':
            if (this.currentPosition > (this.numberOfBooks - 2)) {
              this.currentPosition = 0;
            } else {
              this.currentPosition++;
            }
        }
        return this.moveBook();
      };
      Shelf.prototype.moveBook = function() {
        return $('#bookHolder_' + this.id).animate({
          'marginLeft': this.bookWidth * (-this.currentPosition)
        });
      };
      return Shelf;
    })();
  });
}).call(this);
