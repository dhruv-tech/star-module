$(document).ready(function() {
    if ($(window).width() > 767) {
        dashGridStyle.setHeights();
    }
});

$(window).resize(function() {
    if ($(window).width() > 767) {
        sidebarStyle.forceShow();
        dashGridStyle.setHeights();
    }
});
$('.sidebar-toggle').click(function(){
    sidebarStyle.toggle();
});

const dashGridStyle = {
    setHeights: function(){
        let primaryHeight = $('#infocards-products .card').outerHeight(true);
        $('#infocards-directory').css(`height`,`${primaryHeight}px`);

        let heightAjustment = ($('#infocards-inventory').outerHeight(true) - $('#infocards-inventory').height()) + ($('#infocards-categories').outerHeight(true) - $('#infocards-categories').height());
        heightAjustment = (heightAjustment/2);
        $('#infocards-inventory').css(`height`,`${(primaryHeight/2) - heightAjustment + 2}px`);
        $('#infocards-categories').css(`height`,`${(primaryHeight/2) - heightAjustment + 2}px`);

    }
}

const sidebarStyle = {
    forceShow: function(){
        $( "#sidebar" ).show("slow");
    },
    toggle: function(){
        $("#sidebar").animate({width:'toggle'},300);
    }
}

$('.search-option').click(function(){
    $('.search-select').html($(this).html());
    $('.search-select').attr('correspondence',$(this).attr('correspondence'));
})


let activePage = $('title').html().replace(' - Star Module Demo','');
$(`#${activePage}`).addClass("active");