# -*- coding: utf-8 -*-
from odoo import fields, models, api
# from odoo.http import request
import logging
_logger = logging.getLogger(__name__)

class OdooThemeBaseUtils(models.AbstractModel):
    _inherit = 'theme.utils'

    def _theme_post_copy(self, mod):
        self.disable_view('website_theme_install.customize_modal')

class ThemeWarningWizard(models.TransientModel):
    _name           = 'theme.wizard.message'
    _description    = 'Wizard that show warnings'
    msg             = fields.Char(string='message', readonly=True)

    def _on_publish_click(self):
        active_record = self.env[self._context['active_model']].browse([self._context['active_id']])
        feature = self.env[self._context['active_model']].browse([self._context['feature_id']])
        self.published_feature_name=active_record.name
        active_record.publish_status=True
        feature.publish_status=False
        return True