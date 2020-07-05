odoo.define('theme_outline.shop_page', function(require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var WebsiteSaleLayout = publicWidget.registry.WebsiteSaleLayout
    var ajax = require('web.ajax');
    var wSaleUtils = require('website_sale.utils');
    // var owl_carousel = core_js['owl_carousel'];
    var core_js = require('theme_outline.core_js');
    var overlay = core_js['overlay'];
    var remove_overlay = core_js['remove_overlay'];
    var WebsiteSale = publicWidget.registry.WebsiteSale;
    // var WebsiteSaleOptions = publicWidget.registry.WebsiteSaleOptions
    
    //  Products Layout Views..........................................
    publicWidget.registry.WebsiteSaleLayout = WebsiteSaleLayout.extend({
        disabledInEditableMode: false,
        events: {
            'click .shop_view_icon': '_onChangeShopProductLayout',
        },
        _onChangeShopProductLayout: function(ev) {
            var $target = $(ev.currentTarget);
            var switchToLayout = $target.data('class');
            if (!this.editableMode) {
                this._rpc({
                    route: '/shop/save_shop_layout_mode',
                    params: {
                        'layout_mode': switchToLayout ? switchToLayout : 'grid_view',
                    },
                });
            }
            $target.parent().find(".shop_view_icon").removeClass("active");
            $target.addClass("active")
            var $grid = $('#products_grid');
            $grid.removeClass('grid_view').removeClass('list_view').removeClass('large_grid_view').removeClass('th_list_view');
            $grid.addClass(switchToLayout);
        },
    });
    publicWidget.registry.productGridHeader = publicWidget.Widget.extend({
        selector: '.products_grid_header',
        events: {
            'click .remove_attribute_filter': '_onClickRemoveFilter',
        },
        start: function() {
            $('#products_grid .remove_attribute_filter').hover(function() {
                $(this).parents(".active-filter").addClass("active");
            }, function() {
                $(this).parents(".active-filter").removeClass("active");
            });
        },
        _onClickRemoveFilter:function(ev){
            var $target = $(ev.currentTarget);
            var attr = $target.data("attr");
            if (attr) {
                $target.parents(".active-filter").addClass("disabled");
                var href = this._removeSubString(attr, window.location.href);
                var attr_categ = $target.data("categ");
                if (attr_categ) {
                    href = this._removeSubString(attr, href)
                }
                window.location = href;
            }
        },
        _removeSubString:function(subStr, sourceURL){
            var new_str = "&" + subStr;
            var href = sourceURL.indexOf(new_str) != -1 ? sourceURL.replace(new_str, '') : sourceURL.replace(subStr, '')
            return href
        },
    });
    publicWidget.registry.categoryFilters = publicWidget.Widget.extend({
        selector: '.outline_categ_filters',
        events: {
            'click .dropdown-toggle': '_onClick',
        },
        init: function() {
            this._super.apply(this, arguments);
            this.$products_grid_before = $("#products_grid_before");
            this.$parent = $(".shop_page");
            this.$products_grid_header = $(".products_grid_header");
            this.mode = this.$parent.data('filter-mode');
        },
        start: function() {
            var mode = this.mode;
            if (mode == "side_bar" || window.window.innerWidth < 992) {
                this.$products_grid_before.removeClass("col-lg-3").addClass("slide_left slider");
                this.$products_grid_header.css("position", "relative");
                this.$products_grid_before.detach().appendTo(this.$parent);
                var self = this;
                $("#wrapwrap").on('click', '#products_grid_before .navbar-close,.overlay', function() {
                    self._remove_overlay();
                });
            } else if (mode == "dropdown") {
                console.log("dropdown");
                this.$products_grid_before.removeClass("col-lg-3").addClass("shutter_down shutter");
                this.$products_grid_header.css("position", "relative");
                this.$products_grid_header.append("<div class='product_filter_div w-100' style='display:none'/>");
                this.$product_filter_div = this.$products_grid_header.find(".product_filter_div");

                this.$products_grid_before.detach().appendTo(this.$product_filter_div);
                this.$product_filter_div.slideUp(1);
                var self = this;
                $("#wrapwrap").on('click', '#wrap', function() {
                    self.$product_filter_div.slideUp("slow");
                    $(this).find('.outline_categ_filters').removeClass("active");
                });
            } else {
                this.$products_grid_before.addClass("default");

                this.$products_grid_before.css("height",`${window.innerHeight/1.5}px`);
                var Scrollbar = window.Scrollbar;
                Scrollbar.init(document.querySelector('#products_grid_before'));
                this.$el.addClass("d-none");
            }
            this.$products_grid_before.removeClass("d-none");
            return this._super.apply(this, arguments);
        },
        _onClick: function(ev) {
            ev.stopPropagation();
            if (this.mode == "side_bar" ||  window.innerWidth < 1200) {
                this.$products_grid_before.addClass("slide_right").removeClass("slide_left");
                this._overlay();
            }
            else if (this.mode == "dropdown") {
                this.$product_filter_div.slideToggle("slow");
                $(ev.currentTarget).toggleClass("active");
            }
            else {}
        },
        _overlay: function(ev) {
            overlay();
        },
        _remove_overlay: function() {
            this.$products_grid_before.removeClass("slide_right").addClass("slide_left");
            remove_overlay();
        }
    });

     publicWidget.registry.LazyLoading = publicWidget.Widget.extend({
        selector: '#lazy_loader',
        events: {
            'click .btn-primary': '_onClick',
        },
        init: function() {
            this._super.apply(this, arguments);
            this.flag = true;
            this.page = 2;
            this.href = window.location.href;
        },
        start: function() {
            if (this.href.indexOf("#") > -1) {
                var pound_attr = this.href.substring(this.href.indexOf("#"), this.href.length);
                this.href = this.href.replace(pound_attr, "")
            }
            this.href = this.href.split("?");
            var mode = this.$el.data("mode");
            if (mode == "scroll") {
                $(window).on('scroll', _.throttle(this._onScroll.bind(this), 200));
            }
        },
        inViewPort: function() {
            var element = $("#products_grid .oe_product:last-child");
            var elementTop = element.offset().top;
            var elementBottom = elementTop + element.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            return elementBottom > viewportTop && elementTop < viewportBottom;
        },
        _onScroll: function() {
            if(this.inViewPort()){
                if (this.flag) {
                    this.flag = false;
                    this.$el.find(".data_loader").show();
                    this._appendProductsData();
                }
            }
        },
        _onClick: function(ev) {
            if (this.flag) {
                this.flag = false;
                this.$el.find(".data_loader").show();
                this.$el.find(".btn-primary").hide();
                this._appendProductsData();
            }
        },
        _appendProductsData: function() {
            var self = this;
            this.final_href = this.href.length > 1 ? `${ this.href[0] }/page/${ this.page }?${ this.href[ this.href.length - 1 ] }&view=lazy-load` : `${ this.href[0] }/page/${ this.page }?view=lazy-load`;
            $.get(this.final_href, function(data) {
                self.$el.find(".data_loader").hide();
                if (data) {
                    $("#products_grid .oe_product:last").after(data);
                    $("#lazy_loader .btn-primary").show();
                    self.page += 1;
                    self.flag = true;
                } else {
                    self.flag = false;
                    $("#lazy_loader").html("<h6 class='end_text'>You\'ve reached the end.</h6>");
                    $("#lazy_loader").css("background-image", "none");
                    $("#lazy_loader").css("display", "unset");
                }
            });
        }
    });
    publicWidget.registry.productQuickViews = publicWidget.Widget.extend({
        selector: '#products_grid',
        events: {
            'click .product_quick_view': '_onClickQuickView',
            // 'click .alternatives_quick_view,.accessories_quick_view': '_onClickAlternativeOrAccessoriesView',
        },
        init: function() {
            this._super.apply(this, arguments);
        },
        _onClickQuickView:function(ev){
            var $target = $(ev.currentTarget);
            var product_tmpl_id = parseInt($target.attr('product-template-id'));
            var $modal = $('#product_item_view_modal');
            $modal.modal('show').addClass("quick_view_modal").find(".modal-content").find(".data_loader").show();
            $modal.find(".modal-body").empty();
            var url = "/product/quick/view/" + product_tmpl_id
            if (product_tmpl_id) {
                $.get(url, {}, function(data) {
                    if (data) {
                        $modal.find('.modal-body').replaceWith(data)
                        $modal.find('.carousel-indicators').addClass("vertical").addClass("invisible");
                        let $tigger = $modal.find('.tigger')
                        $tigger.trigger('click');
                        $modal.find('#o-carousel-product').addClass("animated");
                        $modal.find('.modal-content').find(".data_loader").hide();
                    } else {
                        console.log("data", data);
                    }
                });
            }
        },
        
    });
    publicWidget.registry.modalProductQuickViews = publicWidget.Widget.extend(new publicWidget.registry.productQuickViews,{
        selector:"#product_item_view_modal",
    });
    publicWidget.registry.PriceFilter = publicWidget.Widget.extend({
        selector: '.price_filter_div',
        events: {
            'change .range-slider': '_onChangePriceRange',
        },
        init: function() {
            this._super.apply(this, arguments);
        },
        start: function() {
            var $price_range = this.$el.find('input.range-slider');
            this.$min_price = this.$el.find('.theme-min-price');
            this.$max_price = this.$el.find('.theme-max-price');
            var custom_min_price = parseInt(this.$el.find("input.custom_min_price").val())
            var custom_max_price = parseInt(this.$el.find("input.custom_max_price").val())
            var price_range_step = parseInt(this.$el.find("input.price_range_step").val())
            var width = this.$el.width();
            this.$el.find('.range-slider').jRange({
                from: custom_min_price || 0,
                to: custom_max_price || 10000,
                showScale: false,
                isRange: false,
                theme: 'slider_color',
                step: price_range_step || 100,
                width: width ? width - 15 : 300 - 15,
            });
        },
        _onChangePriceRange: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.$min_price.val(parseInt($(ev.currentTarget).attr('value').split(',')[0]));
            this.$max_price.val(parseInt($(ev.currentTarget).attr('value').split(',')[1]));
        }
    });
    publicWidget.registry.WebsiteSale = WebsiteSale.extend({
        events: _.extend(WebsiteSale.prototype.events, {
            'click .apply_filters': '_onClickApplyFilters',
            'click .clear_filters': '_onClickClearFilters',
            'click .product_filter_div': '_onClickFiterDiv',

        }),
        _onProductReady: function() {
            var $productCustomVariantValues = $('<input>', {
                name: 'product_custom_attribute_values',
                type: "hidden",
                value: JSON.stringify(this.rootProduct.product_custom_attribute_values)
            });
            this.$form.append($productCustomVariantValues);
            var $productNoVariantAttributeValues = $('<input>', {
                name: 'no_variant_attribute_values',
                type: "hidden",
                value: JSON.stringify(this.rootProduct.no_variant_attribute_values)
            });
            this.$form.append($productNoVariantAttributeValues);
            if (this.isBuyNow) {
                this.$form.append($('<input>', {name: 'express', type: "hidden", value: true}));
            }
            var product_id = parseInt(this.$form.find("input[name='product_id']").val(), 10) || 0;
            console.log("Product Is",product_id);
            if (product_id) {
                var self = this;
                ajax.jsonRpc("/shop/cart/update_json", 'call', {
                    'product_id': product_id,
                    'add_qty': 1,
                    'display': false,
                }).then(function(value) {
                    var $q = $(".my_cart_quantity");
                    $q.html(value.cart_quantity);
                    var $modal = self.$form.parents("#product_item_view_modal");
                    if ($modal.length) {
                        $modal.css("opacity", "0");
                        $(".modal-backdrop").css("opacity", "0");
                        setTimeout(function() {
                            $modal.css("opacity", "");
                            $(".modal-backdrop").css("opacity", "");
                        }, 2000)
                    }
                    var oe_product = self.$form.parents('.oe_product');
                    if (!oe_product.length)
                        oe_product = $('#product_detail');
                    wSaleUtils.animateClone($('#my_cart'), oe_product, 5, 5);
                    wSaleUtils.updateCartNavBar(value);
                });
            }
        },
        _onChangeAttribute: function (ev) {
            var $target = $(ev.currentTarget);
            ev.stopPropagation();
            ev.preventDefault();
            if ($target.is(":checked"))
                $target.parent().addClass("active");
            else
                $target.parent().removeClass("active");
        },
        _onClickApplyFilters:function(ev){
            if (!ev.isDefaultPrevented()) {
                ev.preventDefault();
            }
            $("#wsale_products_attributes_collapse").find("form").submit();
        },
        _onClickClearFilters:function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            window.location = window.location.origin + window.location.pathname
        },
        _onClickFiterDiv:function(ev) {
            ev.stopPropagation();
        }
    });

})
