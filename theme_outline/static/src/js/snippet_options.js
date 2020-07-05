odoo.define('theme_outline.snippet_options', function(require) {
    'use strict';
    var options = require('web_editor.snippets.options');
    var publicWidget = require('web.public.widget');


    options.registry.js_get_mega_menu_category = options.Class.extend({
        start: function () {
            console.log("js_get_mega_menu_category");
            var self = this;
            var def = this._rpc({
                model: 'product.public.category',
                method: 'search_read',
                args: [[], ['name', 'id','parent_id']],
            }).then(function (categories) {
                var $menu = self.$el.find('[data-category-id="0"]').parent();
                categories = categories.filter(category =>  category.parent_id==false)
                _.each(categories, function (category) {
                    $menu.append($('<we-button/>', {
                        'data-category-id': category.id,
                        'data-no-preview': 'true',
                        text: category.name,
                    }));
                });
            });
            this._findLinks();
            return $.when(this._super.apply(this, arguments), def);
        },
        categoryId: function (previewMode, value, $opt) {
            value = parseInt(value);
            console.log("this.$target",this.$target);
            this.$target.attr('data-category-id', value).data('categoryId', value);
            this.$target.parent().find("span.category_id").text(value);
            this.trigger_up('content_changed', {
                editableMode: true,
                $target: this.$target,
            });
        },
        _findLinks: function () {
            this.$submenus = this.$target.find('.nav-link');
            var $el = this.$target;
        },
        _setActive: function () {
            this.megaMenu = this.megaMenu ? this.megaMenu : new publicWidget.registry.ThemeMegaMenu();
            this.megaMenu._resetMegaMenu(this.$target);
            this._refreshPublicWidgets();
            this._super.apply(this, arguments);
            this.$el.find('[data-category-id]').removeClass('active').filter('[data-category-id=' + this.$target.attr('data-category-id') + ']').addClass('active');
        },
    });
    
});