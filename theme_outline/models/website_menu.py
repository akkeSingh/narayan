from odoo import api, fields, models
from odoo.tools.translate import html_translate

class website_menu(models.Model):
    _inherit = "website.menu"
    
    show_on_hover   = fields.Boolean(string="Show On Hover")