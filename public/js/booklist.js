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
    $('#left').bind('click', function() {
      return console.log = $(this).closest('li').children('.shelfItems');
    });
    $('.shelfItems').each(function(index) {
      var id;
      id = $(this).attr('id');
      return $(this).load('/lists/' + id, function(response, status, xhr) {
        console.log($(this));
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
      var moveBook;
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
      Shelf.changePosition = function() {
        if (this.currentPosition > (this.numberOfBooks - 1)) {
          this.currentPosition = 0;
        } else {
          this.currentPosition++;
        }
        return this.moveBook();
      };
      moveBook = function() {
        return $('#bookHolder_' + id).animate({
          'marginLeft': this.bookWidth * (-this.currentPosition)
        });
      };
      return Shelf;
    })();
  });
}).call(this);
