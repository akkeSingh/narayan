# -*- coding: utf-8 -*-


from odoo import fields, http, tools
from odoo.http import request,Controller
from odoo.addons.auth_signup.controllers.main import AuthSignupHome
from odoo.addons.website_sale.controllers.main import WebsiteSale as WS
from odoo.addons.portal.controllers.portal import CustomerPortal as CP
from odoo.addons.portal.controllers.mail import PortalChatter as PC
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.http_routing.models.ir_http import slug
import logging
_logger = logging.getLogger(__name__)

# import itertools
# import os
# import base64

class ThemeWebsiteSale(WS):
    @http.route()
    def save_shop_layout_mode(self, layout_mode):
        assert layout_mode in ('grid_view', 'large_grid_view', 'th_list_view', 'list_view'), "Invalid shop layout mode"
        request.session['website_sale_shop_layout_mode'] = layout_mode

    def _get_theme_compute_currency(self):
        from_currency = self._get_pricelist_context()[1].currency_id
        to_currency = request.env.user.company_id.currency_id
        return lambda price: from_currency._convert(price, to_currency, (request.env.user).company_id, fields.Date.today())
    def _compute_currency(self):
            to_currency = self._get_pricelist_context()[1].currency_id
            from_currency = request.env.user.company_id.currency_id
            return lambda price: from_currency._convert(price, to_currency, (request.env.user).company_id, fields.Date.today())
   
    def _get_search_domain(self, search, category, attrib_values):
        domain = super(ThemeWebsiteSale, self)._get_search_domain(search=search, category=category, attrib_values=attrib_values)
        if bool(request.env['ir.config_parameter'].sudo().get_param('theme_outline.enable_price_filter')):
            args = request.httprequest.args
            min_price = args.get('min_price') and int(
                float(args.get('min_price'))) or False
            max_price = args.get('max_price') and int(
                float(args.get('max_price'))) or False
            if (min_price == 0 or min_price) and max_price:
                min_price = self._get_theme_compute_currency()(min_price)
                max_price = self._get_theme_compute_currency()(max_price)
                domain += [('list_price', '>=', min_price),
                           ("list_price", '<=', max_price)]
        return domain

    @http.route()
    def shop(self, page=0, category=None, search='', ppg=12, **post):
        render = super(ThemeWebsiteSale, self).shop(
            page=page, category=category, search=search, ppg=ppg, **post)
        layout_mode = render.qcontext.get('layout_mode')
        if layout_mode=='list' or layout_mode == 'grid':
            layout_mode = layout_mode=='list' and 'list_view' or 'grid_view'

        min_price = max_price = False
        keep = render.qcontext.get("keep", False)

        if keep:
            keep.args.update({
                'ppg': ppg,
                'min_price': post.get("min_price", False),
                'max_price': post.get("max_price", False)
            })
        render.qcontext.update({
            'ppg': ppg,
            'order': post.get("order", 'id'),
            "min_price": post.get("min_price", False),
            "max_price": post.get("max_price", False),
            "website_sale_shop_layout_mode":layout_mode,
            "compute_currency":self._compute_currency(),
            "layout_mode":layout_mode,
        })

        if post.get("view") == "lazy-load":
            pager = render.qcontext.get("pager")
            if page <= pager.get("page_count"):
                products = render.qcontext.get("products")
                view = request.render("theme_outline.lazy_product_items", render.qcontext)
                return view
            else:
                return False
        return render

    @http.route(['/product/quick/view/<model("product.template"):product>'], type='http', auth="public", website=True)
    def product_quick_view(self, product, **kwargs):
        render = super(ThemeWebsiteSale, self).product(product, category='', search='', **kwargs)
        if product.is_product_variant:
            render.qcontext["combination"] = product._get_first_possible_combination()
            render.qcontext["product"] =    product.product_tmpl_id
        render.template = "theme_outline.product_quick_view_template"
        return render

class ThemePortalChatter(PC):
    @http.route()
    def portal_chatter_post(self, res_model, res_id, message, **kw):
        result = super(ThemePortalChatter, self).portal_chatter_post(res_model, res_id, message, **kw)
        if res_model == 'product.template' and kw.get('rating_value') and message:
            product = request.env['product.template'].sudo().browse(int(res_id))
            if product.exists():
                rating_value = float(kw.get('rating_value', 0))
                if product.product_avg_rating and rating_value:
                    increment = (rating_value - product.product_avg_rating) / (product.total_start_rating_count + 1)
                    product.product_avg_rating += increment
                    product.total_start_rating_count += 1
                else:
                    total = 0
                    rating = 0
                    for r_id in product.rating_ids:
                        if r_id.rating:
                            rating += r_id.rating
                            total += 1
                    product.total_start_rating_count = total
                    product.product_avg_rating = rating / total if total and rating else 0.0
        return result

class ThemeCustomerPortal(CP):
    @http.route("/wk_image", type='json', auth="public", method='POST')
    def edit_image(self, **kw):
        res_user = request.env['res.users'].search(
            [('id', '=', request.env.user.id)])
        if kw.get('action') == 'edit':
            res_user.image = kw.get('data').split(',')[1].strip()
        else:
            for path in tools.config['addons_path'].split(','):
                try:
                    res_user.image = base64.b64encode(open(os.path.join(path, 'theme_', 'static', 'src', 'img', 'unknown.png'), 'rb') .read()).decode("utf-8")
                except Exception as e:
                    _logger.info(
                        "..........Exception.......%r..................", str(e))
        

class WebsiteMenuDynamic(http.Controller):
    @http.route(['/menu/dynamic'], type='http', auth='public', website=True)
    def render_mega_menu_qweb(self, template, category_id, domain=None, limit=None, order='published_date desc'):
        render = ""   
        try:
            category = request.env['product.public.category'].search(
                [("id", '=', category_id)])
            param = {
                'keep': QueryURL('/shop/category/'),
                'slug': slug,
                'category': category,
            }
            render = request.render(template, param)
        except Exception as e:
            _logger.info("\n.....Exception .%r,.............", str(e))
        return render
