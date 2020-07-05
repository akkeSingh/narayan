# -*- coding: utf-8 -*-


from odoo import models,api,fields, tools
from odoo.http import request
from odoo.addons.http_routing.models.ir_http import slug
from odoo.addons.website.controllers.main import QueryURL
import math

class WebsiteInherit(models.Model):
    _inherit = "website"
    
    def get_reference(self):
        keep = QueryURL('/shop')
        return keep,slug

    facebook_sharing = fields.Boolean(string='Facebook')
    twitter_sharing = fields.Boolean(string='Twitter')
    linkedin_sharing = fields.Boolean(string='Linkedin')
    mail_sharing = fields.Boolean(string='Mail')

    def get_rating_values(self,val):
        val_integer = math.floor(val)
        val_decimal = round(val - val_integer,3)
        if val_decimal> .75:
            val_integer +=1
            val_decimal = 0
        if val_decimal>=.25 and val_decimal<=.75:
            val_decimal = 0.5
        else:
            val_decimal = 0
        empty_star = 5 - (val_integer+math.ceil(val_decimal))
        return val_integer,val_decimal,empty_star


    def get_theme_new_products(self):
        domain = [('featured_product_type','=','new'),('tabs_product_type','=',False),('publish_status','=',True)]
        feature = self.env['theme.features'].sudo().search(domain)
        return feature.products

    
    def get_theme_featured_products(self):
        domain = [('featured_product_type','=','featured'),('tabs_product_type','=',False),('publish_status','=',True)]
        feature = self.env['theme.features'].sudo().search(domain)
        return feature.products
    
    def get_theme_rated_products(self):
        domain = [('featured_product_type','=','rated'),('tabs_product_type','=',False),('publish_status','=',True)]
        feature = self.env['theme.features'].sudo().search(domain)
        return feature.products

    # ....................TAB PRODUCTS SNIPPET FUNCTIONS.........................
    
    def get_theme_all_products(self):
        domain = [('tabs_product_type','=','all'),('publish_status','=',True)]
        feature = self.env['theme.features'].sudo().search(domain)
        return feature.products

    
    def get_theme_latest_products(self):
        domain = [('tabs_product_type','=','latest'),('publish_status','=',True)]
        feature = self.env['theme.features'].sudo().search(domain)
        return feature.products
    
    def get_theme_sale_products(self):
        domain = [('tabs_product_type','=','sale'),('publish_status','=',True)]
        feature = self.env['theme.features'].sudo().search(domain)
        return feature.products




    def get_compute_currency_and_context(self):
        pricelist_context = dict(request.env.context)
        pricelist = False
        if not pricelist_context.get('pricelist'):
            pricelist = request.website.get_current_pricelist()
            pricelist_context['pricelist'] = pricelist.id
        else:
            pricelist = request.env['product.pricelist'].browse(pricelist_context['pricelist'])
        from_currency = request.env.user.company_id.currency_id
        to_currency = pricelist.currency_id
        compute_currency = lambda price: from_currency.compute(price, to_currency)

        return [compute_currency, pricelist_context, pricelist]

    # to render main parent product.public.category website specific
    def category_check(self):
        return self.env['product.public.category'].sudo().search([('website_published','=',True),('parent_id', '=', False),('website_id', 'in', (False,self.id))])
    