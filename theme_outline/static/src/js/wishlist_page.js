odoo.define('theme_outline.wishlist_js', function (require) {
    "use strict";
    var wSaleUtils = require('website_sale.utils');
    var publicWidget = require('web.public.widget');
    var website_sale_wishlist = require('website_sale_wishlist.wishlist')
    var ProductWishlist = publicWidget.registry.ProductWishlist
    publicWidget.registry.ProductWishlist = ProductWishlist.extend({
        _removeWish: function (e, deferred_redirect){
            var oe_product = $(e.currentTarget).parents('.oe_product');
            var wish = oe_product.data('wish-id');
            var product = oe_product.data('product-id');
            var self = this;
            this._rpc({
                route: '/shop/wishlist/remove/' + wish,
            }).then(function () {
                $(oe_product).hide();
            });

            this.wishlistProductIDs = _.without(this.wishlistProductIDs, product);
            if (this.wishlistProductIDs.length === 0) {
                deferred_redirect = deferred_redirect ? deferred_redirect : $.Deferred();
                deferred_redirect.then(function () {
                    self._redirectNoWish();
                });
            }
            this._updateWishlistView();
        },
        _addOrMoveWish: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var oe_product = $(e.currentTarget).parents('.oe_product');
            var product = oe_product.data('product-id');
            wSaleUtils.animateClone($('.th_header_wish_icon'), oe_product, 10, 10);
            if ($('#b2b_wish').is(':checked')) {
                return this._addToCart(product, oe_product.find('qty').val() || 1);
            } else {
                var adding_deffered = this._addToCart(product, oe_product.find('qty').val() || 1);
                this._removeWish(e, adding_deffered);
                return adding_deffered;
            }
        },
    });
});
