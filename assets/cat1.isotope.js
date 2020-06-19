
var filters = {};   // store filter for each group
var filterValue;    // store combined filters as one string
var qsRegex;        // quick search regex

// INIT Isotope
var $grid = $('.grid').isotope({
  // options
  itemSelector: '.card',
  layoutMode: 'fitRows',
  fitWidth: 'true',
  getSortData: {
    title: '.card-title', // text from querySelector
    year: '.year'
  },
  sortBy: [ 'year', 'title' ],
  sortAscending: {
    title: true,
    year: false
  },
  filter: function() {
    var $this = $(this);
    var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
    var buttonResult = filterValue ? $this.is( filterValue ) : true;
    return searchResult && buttonResult;
  }
});

var iso = $grid.data('isotope');
var $filterCount = $('.filter-count');

// SORT items on button click
$('.sort-by-button-group').on( 'click', 'button', function() {
  var sortByValue = $(this).attr('data-sort-by');
  // make an array of values as maybe multiple fields to sort on!
  sortByValues = sortByValue.split(',');
  // Run sort cards...
  $grid.isotope({ sortBy: sortByValues });
  updateFilterCount();
});


// FILTER: combine filters into one eg '.red.small'. https://isotope.metafizzy.co/filtering.html
$('.filters').on( 'click', 'button', function() {
  var $this = $(this);
  // get group key
  var $buttonGroup = $this.parents('.filter-button-group');
  var filterGroup = $buttonGroup.attr('data-filter-group');
  // set filter for group
  filters[ filterGroup ] = $this.attr('data-filter');
  // combine filters
  filterValue = concatValues( filters );
  //console.log('Filter: ' + filterValue)
  // Isotope arrange cards...
  $grid.isotope();
  updateFilterCount();
});

// use value of search field to filter
var $quicksearch = $('.quicksearch').keyup( debounce( function() {
  qsRegex = new RegExp( $quicksearch.val(), 'gi' );
  //console.log('Search: '  + qsRegex);
  // Isotope arrange cards...
  $grid.isotope();
  updateFilterCount();
}) );


// RESET
var $allButtons = $('.filters').find('button[data-filter="*"]');  // aka filter=*
var $buttons = $('.filters button');

$('.button-reset').on( 'click', function() {
    // reset filters
    console.log('Filters: ' + JSON.stringify(filters))
    //console.log('Filtervalue: ' + Filtervalue)  JSON.stringify(obj)
    filters = {};
    filterValue = '';
    console.log('Filters reset to: ' + JSON.stringify(filters))
    //console.log('Filtervalue: ' + Filtervalue)
    // reset isotope by specifying filter: '*'
    $grid.isotope({ filter: '*' });    // works BUT then cant filter again


    // change class on buttons (so active = primary)
    $buttons.removeClass('btn-primary');    // ok
    $allButtons.addClass('btn-primary');    // ok
    updateFilterCount();
  });


// change class on buttons (so active = primary)
$('.filter-button-group').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'button', function() {
    $buttonGroup.find('.btn-primary').removeClass('btn-primary');
    $( this ).addClass('btn-primary');
  });
});


// FILTER COUNT
function updateFilterCount() {
  $filterCount.text( iso.filteredItems.length + ' items' );
}
updateFilterCount();


// resize on click - toggle big class
/*
$grid.on( 'click', '.card', function() {
  $( this ).toggleClass('big');
  $grid.isotope('layout');
  });
*/

// open links on click and stop propegation so doesnt resize (ie run above function too)
$grid.on( 'click', 'a', function(e) {
  e.stopPropagation();
  });



// flatten object by concatting values
function concatValues( obj ) {
  var value = '';
  for ( var prop in obj ) {
    value += obj[ prop ];
  }
  return value;
}

// debounce so filtering doesn't happen every millisecond
function debounce( fn, threshold ) {
  var timeout;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout( timeout );
    var args = arguments;
    var _this = this;
    function delayed() {
      fn.apply( _this, args );
    }
    timeout = setTimeout( delayed, threshold );
  };
}
