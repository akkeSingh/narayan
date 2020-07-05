from odoo import fields, models

class ThemePaymentIcon(models.Model):
    _inherit = 'payment.icon'

    show_in_theme_footer = fields.Boolean('Show In Theme Footer')