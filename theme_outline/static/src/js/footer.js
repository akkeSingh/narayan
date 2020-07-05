odoo.define("theme_outline.footer", function(require) {
    "use strict";
    var ajax = require('web.ajax');
    var core = require('web.core');
    var _t = core._t;

    var publicWidget = require('web.public.widget');

    $(document).ready(function(){
        var text_color="#434b53";
        var white = "#ffffff";
        var facebook="#3B5998";
        var twitter="#1DA1F2";
        var google="#DB4437";
        var linkedin="#0077B5";
        var youtube="#c4302b";
        var instagram="#3f729b";
        var github= "#211F1F";
        var odoo = "#875A7B"
        $(".fa-facebook-square").parent().hover(function(e){
            $(this).css('color',facebook);
        },function(){
            $(this).css('color',"");
        });

        $(".fa-twitter").parent().hover(function(e){
            $(this).css('color',twitter);
        },function(){
            $(this).css('color',"");
        });

        $(".fa-google-plus").parent().hover(function(e){
            $(this).css('color',google);
        },function(){
            $(this).css('color',"");
        });

        $(".fa-linkedin").parent().hover(function(e){
            $(this).css('color',linkedin);
        },function(){
            $(this).css('color',"");
        });
        $(".fa-youtube-play").parent().hover(function(e){
            $(this).css('color',youtube);
        },function(){
            $(this).css('color',"");
        });
        $(".fa-github").parent().hover(function(e){
            $(this).css('color',github);
        },function(){
            $(this).css('color',"");
        });
        $(".fa-instagram").parent().hover(function(e){
            $(this).css('color',instagram);
        },function(){
            $(this).css('color',"");
        });
        $(".o_custom_icon").parent().hover(function(e){
            $(this).css('color',odoo);
        },function(){
            $(this).css('color',"");
        });

    });

});
