# -*- coding: utf-8 -*-

from odoo import models,fields,api

class ThemeProductTemplate(models.Model):
    _inherit = "product.template"

    def _product_average_rating(self):
        for product in self:
            total, rating = 0, 0.0
            for r in product.rating_ids:
                if r.rating:
                    rating += r.rating
                    total += 1
            product.total_start_rating_count = total
            product.product_avg_rating = rating/total if total and rating else 0.0

    product_avg_rating          = fields.Float("Average Rating", default=_product_average_rating ,readonly="True",store="True" )
    sales_count                 = fields.Float(compute='_compute_sales_count', string='Sold',store="True")
    start_rating_count          = fields.Integer()
    
    product_label_id=fields.Many2one("product.label","Sale Label")
    # product_brand_id = fields.Many2one(
    #     'theme.product.brand',
    #     string='Brand',
    #     help='Select a brand for this product'
    # )
    # score = fields.Float(string="Product Score",default=1.0)

    def get_style_classes(self):
        classes = " ".join(x.html_class for x in self.website_style_ids if x.html_class)
        return classes