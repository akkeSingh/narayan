from odoo import models, fields, api

class product_label(models.Model):
    _name="product.label" 
    _description = "Product Label"  
    
    name=fields.Char("Name",required=True,translate=True)
    style = fields.Selection([
            ('style_1','Style 1'),
            ('style_2','Style 2'),
            ('style_3','Style 3'),
            ('style_4','Style 4'),    
            ],"Styles",default="style_1")