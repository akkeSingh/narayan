odoo.define("theme_outline.product_page_js", function(require) {
    "use strict";
    var publicWidget = require('web.public.widget');
    var owl_carousel = require('theme_outline.core_js')['owl_carousel'];

    $(document).ready(function() {
        //......Replacing the rating.............................
        var $source_rating = $("#wrap .o_shop_discussion_rating");
        var $target_rating = $("#wrap .o_shop_outline_discussion_rating")
        var $source_detail = $("#product_full_spec");
        var $target_detail = $("#outline_p_full_spec");
        if ($source_rating.length>0){
            $target_rating.replaceWith($source_rating);
            $("#p_review_tab").removeClass("d-none");
        }
        if($source_detail.length>0){
            $source_detail.removeClass("d-none");
            $target_detail.replaceWith($source_detail);
            $("#p_detail_tab").removeClass("d-none");
        }
        $('#product_details .rating_count a').on('click', function (e) {
          $('#outline_product_tabs .nav-tabs a[href="#wk_product_review"]').tab('show');
        });
    });
    publicWidget.registry.WebsiteSale = publicWidget.registry.WebsiteSale.extend({
        read_events: _.extend({
            "click .carousel-indicators li": "_activeCarouselImage",
            "click .tigger" : "_tiggerVariantChange",
        }, publicWidget.registry.WebsiteSale.prototype.read_events),
        start:function(){
    		var def = this._super.apply(this, arguments);
            if (this.editableMode) {
    		    return def;
    		}
            this._alternativeProductsOwlCarousel();
            this._replace_quantity();
            return def;
        },
        _updateProductImage: function ($productContainer, productId, productTemplateId, new_carousel){
            this._super.apply(this, arguments);
            this.$carouselIndicators = $productContainer.find("#o-carousel-product .carousel-indicators");
            this.$carousel = $productContainer.find("#o-carousel-product");
            var $li = this.$carouselIndicators.find("li");
            var totalWidth = ($li.width()+22)*$li.length;
            var $el = $("#product_item_view_modal .modal-content");
            var count=0;
            $productContainer.find("#o-carousel-product .carousel-item").each(function(){
                $(this).attr("data-slide-to",count);
                count+=1;
            })
            this.$carousel.addClass("animated");
            if(this.$el.hasClass("modal-content")){
                this.$carouselIndicators.addClass("vertical");
                var width = 400-30;
                var left =  ($el.width()/2)-(width/2)-30
                var item_count = parseInt(width/($li.width()+22))
                this.$carouselIndicators.css({"width":width+'px',"left":left+'px',});
                if( totalWidth>width){
                    this.$carouselIndicators.addClass("owl-carousel owl-theme").removeClass("position-static")
                    .attr({"data-tabitems":item_count,"data-desktopitems":item_count,"data-loop":false,"data-nav":  true, "data-smartspeed":300, });
                    owl_carousel(this.$carouselIndicators,true);
                }
            }else{
                var item_count = parseInt(this.$carouselIndicators.width()/($li.width()+22))
                if( totalWidth>this.$carouselIndicators.width()){
                    this.$carouselIndicators.addClass("owl-carousel owl-theme").removeClass("position-static")
                    .attr({"data-tabitems":item_count,"data-desktopitems":item_count,"data-mobileitems":4,"data-smallitems":3,"data-loop":false,"data-nav":  true,"data-smartspeed":300, });
                    owl_carousel(this.$carouselIndicators,true);
                }
            }
        },
        _tiggerVariantChange:function(ev){
            this.triggerVariantChange(this.$el);
        },
        _activeCarouselImage:function(ev){
            var $active_indicators = this.$carouselIndicators.find(".owl-item.active");
            if(this.$carouselIndicators.hasClass("owl-carousel")){
                this.$carouselIndicators.find("li").removeClass("owl_active");
                $(ev.currentTarget).addClass("owl_active");
            }
            this.$carousel.carousel($(ev.currentTarget).data("slide-to"));
            setTimeout(function() {
                $active_indicators.addClass("active");
            },300);
        },
        _onChangeCombination:function(ev, $parent, combination){
            this._super.apply(this, arguments);
            var target = $('#product_details > .product_price')
            var source = $('#product_details .js_product .product_price ')
            target.html(source.html());
        },
        _alternativeProductsOwlCarousel:function(ev){
            var $target = this.$target.find(".alternative_products .column");
            var items = parseInt($target.data("items"),10);
            $target.each(function(){
                if($(this).find(".owl-carousel").length!=0){
                    var $owl_carousel = $(this).find(".owl-carousel");
                    $owl_carousel.attr({"data-items":4,"data-mobile-items":items-items/2,"data-tab-items":items,"data-desktop-items":items,"data-loop":false,"data-nav":true});
                    owl_carousel($owl_carousel);
                    var nav = $owl_carousel.find(".owl-nav");
                    if($owl_carousel.find(".owl-nav").hasClass("disabled")){
                        $(this).find(".owl-next,.owl-prev").addClass("disabled");
                    }else{
                        nav.hide();
                        $(this).find(".owl-next").click(function() {
                            $owl_carousel.trigger('next.owl.carousel');
                            $(this).parent().find(".owl-prev").removeClass("disabled");
                            $owl_carousel.find(".owl-next.disabled").length!=0?$(this).addClass("disabled"):$(this).removeClass("disabled");
                        });
                        $(this).find(".owl-prev").click(function() {
                            $owl_carousel.trigger('prev.owl.carousel');
                            $(this).parent().find(".owl-next").removeClass("disabled");
                            $owl_carousel.find(".owl-prev.disabled").length!=0?$(this).addClass("disabled"):$(this).removeClass("disabled");
                        }).addClass("disabled");
                    }
                }
            })
        },
        _replace_quantity:function(ev){
            var $qty = $("#product_details .js_product .css_quantity");
            var $add_to_cart_btn = $("#product_details .js_product .add_to_cart_btn");
            $qty.detach().appendTo($add_to_cart_btn);
        }
    });
});
