# -*- coding: utf-8 -*-

from odoo import models, fields, api

class ThemeMegaMenus(models.Model):
    _inherit="website.menu"

    enable_menu_hover               = fields.Boolean(string="Menu On Hover")
    # mega_menu_icon                  = fields.Binary("Mega Menu Icon")