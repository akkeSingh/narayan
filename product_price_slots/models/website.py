# -*- coding: utf-8 -*-
#################################################################################
#
# Copyright (c) 2018-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>:wink:
# See LICENSE file for full copyright and licensing details.
#################################################################################

from odoo import api, fields, models, _

class Website(models.Model):
    _inherit = 'website'
    @api.model
    def check_partner_country_eligiblity_for_pricelist(self, partner, pricelist):
        partner = partner or self.env.user.partner_id
        partner_country = partner.country_id
        if pricelist and pricelist.country_group_ids and partner_country:
            for country_group in pricelist.country_group_ids:
                return partner_country.id in country_group.country_ids.ids
        return True 

   