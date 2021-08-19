// Filter for the projects section
var $projects = $('.project-cards').isotope({
    itemSelector: '.project-panel',
    layoutMode: 'fitRows',
    percentPosition: true,
    fitRows: {
        gutter: '.project-gutter-sizer'
    }
});

$('#filter-btns').on('click', '.filter-btn', function() {
    var $filterBtn = $(this);
    var filterVal = $filterBtn.attr('project-category');
    $projects.isotope({ filter: filterVal });

    $('li.active').removeClass('active');
    $filterBtn.addClass('active');
});