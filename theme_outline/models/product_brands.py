from odoo import api, fields, models


class ThemeProductBrand(models.Model):
    _name = 'theme.product.brand'
    _inherit = ['website.published.multi.mixin']
    _order = 'name'
    _description= 'Product Brand'

    name = fields.Char('Brand Name', required=True,translate=True)
    description = fields.Text('Description', translate=True)
    website_id = fields.Many2one("website", string="Website")
    partner_id = fields.Many2one(
        'res.partner',
        string='Partner',
        help='Select a partner for this brand if any.',
        ondelete='restrict'
    )
    logo = fields.Binary('Logo File')
    product_ids = fields.One2many(
        'product.template',
        'product_brand_id',
        string='Brand Products',
    )    
    products_count = fields.Integer(
        string='Number of products',
        compute='_get_products_count',
    )
    brand_weight = fields.Integer(
        string='Brand Weight')
    
   
    @api.depends('product_ids')
    def _get_products_count(self):
        for brand in self:
            brand.products_count = len(brand.product_ids)