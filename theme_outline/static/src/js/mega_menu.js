odoo.define('theme_outline.mega_menu', function(require) {
    'use strict';
    var publicWidget = require('web.public.widget');
    var remove_overlay = require('theme_outline.core_js')['remove_overlay'];


    publicWidget.registry.ThemeMegaMenu = publicWidget.Widget.extend({
        selector : ".js_get_dynamic_menu",
        read_events: {
            'mouseenter .nav-tabs .nav-link': '_onMouseEnter',
        },
        init:function(){
            this._super.apply(this, arguments);
        },
        start: function () {
            // if($("body").hasClass("editor_enable")){
            //     console.log("editor_enable");
            this._resetMegaMenu();
            // }

        },
        _resetMegaMenu:function($target=false){
            $target = $target ? $target : this.$target;
            var template        = $target.parent().find('span.menu_template').text() || false;
            var category_id     = $target.parent().find('span.category_id').text() || 0;
            $target.parent().find('input.menu_template').val(template);
            $target.removeAttr('contenteditable'); // Prevent user edition
            console.log(category_id)
            if(template && category_id!=0){
                $.get("/menu/dynamic", {
                    template    :   template,
                    category_id :   category_id,
                },function(data) {
                    $target.html(data);
                    $target.attr('contenteditable', 'false');
                });
            }
        },
        destroy: function (){
            this._super.apply(this, arguments);
        },
        _onMouseEnter:function(ev){
            $(ev.currentTarget).tab("show");
        },
    });

    publicWidget.registry.Themkjsdksjdldmdd = publicWidget.Widget.extend({
        selector:"#th_mobile_menu_slider",
        read_events:{
            "mouseenter .outline_mega_menu.show_on_hover":"_onMouseEnter",
            "mouseleave .outline_mega_menu.show_on_hover":"_onMouseLeave",
            "click .outline_mega_menu": "_onMenuClick",
            "click .navbar-close":      "_onClickClose",
            "click .overlay":       "_onClickClose",
        },
        start:function(){
            this._super.apply(this,arguments);
            this.editor_mode = $("body").hasClass("editor_enable");
            this.mobile_mode = $(window).innerWidth() < 768;

        },
        _onMouseEnter:function(ev){
            if(!this.editor_mode && !this.mobile_mode){
                var currentTarget = $(ev.currentTarget);
                var dropdownMenu = currentTarget.find('.dropdown-menu.o_mega_menu');
                currentTarget.addClass('show');
                dropdownMenu.find(">section").show();
                dropdownMenu.stop(true, true).delay(300).slideDown(200);
            }
        },
        _onMouseLeave:function(ev){
            if(!this.editor_mode && !this.mobile_mode){
                var currentTarget = $(ev.currentTarget);
                var dropdownMenu = currentTarget.find('.dropdown-menu.o_mega_menu');
                currentTarget.removeClass('show');
                dropdownMenu.stop(true, true).delay(200).slideUp("show");
            }
        },
        _onMenuClick:function(ev){
            var currentTarget = $(ev.currentTarget);
            if(this.mobile_mode){
                ev.stopPropagation();
                // ev.preventDefault();
                var dropdownMenu = currentTarget.find('.dropdown-menu.o_mega_menu');
                currentTarget.addClass('show');
                dropdownMenu.addClass("show")
                dropdownMenu.find(">section").show();
                if (currentTarget.parents("#top_menu_collapse").hasClass("slide_right")) {
                    dropdownMenu.find("a:not('.dropdown-close')").click(function(e) {
                        e.stopPropagation();
                    });
                }
                
            }
        },
        _onClickClose:function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            var dropdownMenuOpen = $("#th_mobile_menu_slider").find('.o_mega_menu.show');
            console.log("dropdownMenuOpen",dropdownMenuOpen);
            if (dropdownMenuOpen.length>0){
                dropdownMenuOpen.removeClass("show");
            }else{
                remove_overlay();
                $("#th_mobile_menu_slider").removeClass("slide_right");
            }
        }
    });
    
    // $(window).load(function() {
    //     //Top menu hover dropdown
    //     if ($(window).innerWidth() > 1200) {
    //         $("#top_menu > .dropdown").each(function() {
    //             if (!$(this).closest(".o_extra_menu_items").length) {
    //                 $(this).closest("a").click(function() {
    //                     return false;
    //                 });
    //                 $(this).hover(
    //                     function() {
    //                         $('> .dropdown-menu', this).stop(true, true).fadeIn("slow");
    //                         $(this).toggleClass('open');
    //                     },
    //                     function() {
    //                         $('> .dropdown-menu', this).stop(true, true).fadeOut("fast");
    //                         $(this).toggleClass('open');
    //                     }
    //                 );
    //             }
    //         })
    //     }
});
