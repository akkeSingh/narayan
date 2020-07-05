odoo.define("theme_outline.header_js", function(require) {
    "use strict";
    var core = require('web.core');
    var _t = core._t;
    var ajax = require('web.ajax');
    var overlay = require('theme_outline.core_js')['overlay'];
    var remove_overlay = require('theme_outline.core_js')['remove_overlay'];
    var publicWidget = require('web.public.widget');
    publicWidget.registry.affixMenu = publicWidget.registry.affixMenu.extend({
        start: function() {
            if (this.editableMode) {
                return false;
            }
            this.th_navbar = this.$target.find("nav.navbar");
            this.th_header_top = this.$target.find(".th_header_before_overlay");
               
            $(window).on('resize.affixMenu scroll.affixMenu', _.throttle(this._onWindowUpdate.bind(this), 200));
            setTimeout(this._onWindowUpdate.bind(this), 0); // setTimeout to allow override with advanced stuff... see themes
            this._set_header();
            this.currentScroll = 0;
        },
        _onWindowUpdate: function() {
            var wOffset = $(window).scrollTop();
            var hOffset = this.$target.scrollTop();
            var self = this;
            if (wOffset > (hOffset + 100)) {
                this.$target.addClass('shadoow');
                this.th_navbar.addClass("slideUp");
                if (wOffset>this.currentScroll){
                    this.currentScroll = wOffset
                }else{
                    this.th_navbar.removeClass("slideUp");
                    this.$target.removeClass('shadoow');
                    this.currentScroll = wOffset;
                }
            } else {
                this.th_navbar.removeClass("slideUp");
                this.$target.removeClass('shadoow');
            }
        },
        _set_header:function(){
            this.$target.addClass('affixed');
            var main_nav = $('#oe_main_menu_navbar')
            main_nav.length !=0  ? this.$target.css("top",`${main_nav.offsetHeight-1}px`): this.$target.css("top","0px");
            var top_margin = `${this.$target.height()}px`;
            $("#wrapwrap > main").css("margin-top",top_margin);
        },
    });
    publicWidget.registry.navbarCollapseButton = publicWidget.Widget.extend({
        selector: '.te_bar_icon',
        read_events: {
            'click .navbar-toggler': '_onClickNavbarToggler',
        },
        start:function(){
            this.$menuSlider = $("#th_mobile_menu_slider");
            this.$menu = $("#top_menu_collapse");
            this.$menu.addClass("show");
            this.flag=true;
            this._isolateMenu();
        },
        _onClickNavbarToggler:function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            this._isolateMenu();
            overlay();
            var self = this;
            $("#wrapwrap").on('click', '#th_mobile_menu_slider .navbar-close,.overlay ', function(e) {
                var open_menu = self.$menuSlider.find(".o_mega_menu.show");
                if(open_menu.length===0){
                    remove_overlay();
                    self.$menuSlider.removeClass("slide_right");
                    self._replaceMenu();
                }
            })
            this.$menuSlider.addClass("slide_right").find("#top_menu").removeClass("text-right").find(".nav-item").addClass("w-100");
        },
        _isolateMenu:function(){
            if(window.innerWidth < 768 && this.flag){
                this.$menu.detach().appendTo(this.$menuSlider);
                this.flag=false;
            } 
        },
        _replaceMenu:function(){
            if(window.innerWidth > 768)
                this.$menu.detach().appendTo(this.$header.find(".container"));
        }
    });
    publicWidget.registry.searchPopover = publicWidget.Widget.extend({
        selector: '.th_header_search',
        read_events: {
            'mouseenter': '_onMouseEnter',
            'mouseleave': '_onMouseLeave',
        },
        _onMouseEnter:function(ev){
            var currentTarget = $(ev.currentTarget);
            this.$target.addClass("active");
        },
        _onMouseLeave:function(ev){
            var currentTarget = $(ev.currentTarget);
            this.$target.removeClass("active");
        }
    });
    publicWidget.registry.websiteSaleCartLink = publicWidget.Widget.extend({
        selector: '.th_header_cart_icon',
        read_events: {
            'click': '_onClickCartIcon',
            'click .js_delete_product': '_onClickDeleteProduct',
        },
        start: function() {
            var def = this._super.apply(this, arguments);
            if (this.editableMode) {
                return def;
            }
            this.main_nav = $('#oe_main_menu_navbar');
            return def;
        },
        _onClickCartIcon: function(ev) {
            var self = this;
            ev.preventDefault();
            ev.stopPropagation();
            var $slider = $("#th_mycart_slider");
            $slider.addClass("slide_left");
            $slider.find(".text_comp").hide();
            $slider.find(".text_cart").show();
            overlay();
            $("#wrapwrap").on('click','.overlay, #th_mycart_slider .close_icon',function(){
                remove_overlay();
                $slider.removeClass("slide_left");
            });
            if (this.main_nav.length !=0)
                $slider.css("top",this.main_nav.height() + "px");
           
            $.get("/shop/cart", {type: 'popover', }).then(function(data) {
                $slider.find(".dynamic_cart_content").html(data)
                $slider.on('click', '.js_delete_product', self._onClickDeleteProduct)
            });
        },
        _onClickDeleteProduct: function(ev) {
            var $th_cart_icon = $(".th_cart_btn");
            var $target = $(this).closest('.cart_line');
            var $input = $(this).closest('.cart_line').find('.js_quantity');
            $target.slideUp();
            ajax.jsonRpc("/shop/cart/update_json", 'call', {
                'line_id': parseInt($input.data('line-id'), 10),
                'product_id': parseInt($input.data('product-id'), 10),
                'set_qty': 0,
            }).then(function(data) {
                if (!data.cart_quantity)
                    $(".th_header_cart_icon .my_cart_quantity").html("0").hide().fadeIn(600);
                else
                    $(".th_header_cart_icon .my_cart_quantity").html(data.cart_quantity).hide().fadeIn(600);
                $.get("/shop/cart", {
                        'type': 'popover'
                    })
                    .then(function(data) {
                        $("#th_mycart_slider .dynamic_cart_content").html(data);
                        $("#th_mycart_slider .js_delete_product").bind('click', this._onClickDeleteProduct);
                    });
                let path = window.location.pathname;
                if (path.includes('/shop/cart')) {
                    window.location.href = path;
                }
            });
        },
    });

    $(document).ready(function() {
        // mobile menu
        $("header").on('click', '.navbar-toggler', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
});
