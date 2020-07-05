# -*- coding: utf-8 -*-

from odoo import api, fields, models


class ThemeResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    filter_min_price = fields.Integer(
        "Filter Min Price", config_parameter='theme_outline.filter_min_price', default=0, required="True")
    filter_max_price = fields.Integer(
        "Filter Max Price", config_parameter='theme_outline.filter_max_price', default=100000, required="True")
    filter_price_step = fields.Integer(
        "Filter Price Step",  config_parameter='theme_outline.filter_price_step', default=100, required="True")
    enable_price_filter = fields.Boolean(
        "Enable Price Filter", config_parameter='theme_outline.enable_price_filter')


    enable_lazy_loading = fields.Boolean('Enable Lazy Loading', default = False, config_parameter='theme_outline.enable_lazy_loading')
    lazy_loading_options = fields.Selection([('button','Button Click'),('scroll',"On Scroll")], config_parameter = 'theme_outline.lazy_loading_options', default = 'button')

    product_filter_view_mode = fields.Selection([ ('default', 'Default'),('side_bar', 'Left Side bar'), ('dropdown', 'Dropdown')],
                                            "Product Filters View Option", config_parameter='theme_outline.product_filter_view_mode', default="dropdown")
    enable_product_quick_view = fields.Boolean(
        "Product Quick View", config_parameter='theme_outline.enable_product_quick_view')

    products_rating_mode = fields.Selection(
        [('show', 'Show all the Ratings'),
            ('hide', 'Show Only that have value greater then 0'),
            ('hidden', 'Do not show Ratings at all.'),
         ],
        "Show/Hide Product Ratings", config_parameter='theme_outline.products_rating_mode', default="show")
    
    # product_alternatives_view = fields.Boolean(
    #     "Product Alternates View", config_parameter='theme_outline.product_alternatives_view')
    # product_accessories_view = fields.Boolean(
    #     "Product Accessories View", config_parameter='theme_outline.product_accessories_view')

    facebook_sharing = fields.Boolean(string='Facebook', related='website_id.facebook_sharing',readonly=False)
    twitter_sharing = fields.Boolean(string='Twitter', related='website_id.twitter_sharing',readonly=False)
    linkedin_sharing = fields.Boolean(string='Linkedin', related='website_id.linkedin_sharing',readonly=False)
    mail_sharing = fields.Boolean(string='Mail', related='website_id.mail_sharing',readonly=False)

    def set_values(self):
        super(ThemeResConfigSettings, self).set_values()
