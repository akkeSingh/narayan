from odoo import http
from odoo.http import request
from odoo import fields
from odoo.addons.website_sale.controllers.main import WebsiteSale

# class ProductPriceSlot(WebsiteSale):
#     @http.route(["/product/price/slot/<model('product.product'):product_id>"], type='json', auth="public", website=True)
#     def load_product_price_slot(self, product_id, **kwargs):
#         pricelist = self._get_pricelist_context()[1]
        
#         total_offers = pricelist.item_ids.filtered(lambda item: self.filter_pricelist_item(item,product_id))
#         sorted_offers = total_offers and total_offers.sorted(lambda item:item.min_quantity)
        
#         relevent_offers = sorted_offers and sorted_offers[0]
        
#         price = pricelist.get_product_price(product=product_id,quantity=relevent_offers and relevent_offers.min_quantity or 2 ,partner=request.env.user.partner_id)
        
#         for item in  sorted_offers:
#             current_price = pricelist.get_product_price(product=product_id,quantity=item.min_quantity,partner=request.env.user.partner_id) 
#             if price == current_price:
#                 continue
#             else: 
#                 price = current_price
#                 relevent_offers += item    
        
#         return request.env.ref("product_price_slots.product_price_offer_template").render({"product_id":product_id,'relevent_offers':relevent_offers,"pricelist":pricelist,}, engine='ir.qweb')

#     def filter_pricelist_item(self, item, product_id):
#         product_tmpl_id = product_id.product_tmpl_id
#         if item.applied_on == '3_global':
#             state = True
#         elif item.applied_on == '2_product_category' and (item.categ_id.id in self.get_all_child_category(product_tmpl_id)):
#             state = True
#         elif item.applied_on == '1_product' and (item.product_tmpl_id == product_tmpl_id):
#             state = True
#         elif item.applied_on == '0_product_variant' and (item.product_id == product_id):
#             state = True
#         else:
#             state = False
#         return state and self.is_valid_pli_item(item)
               
#     def is_valid_pli_item(self, pricelist_item):    
#         start_date = fields.Date.from_string(pricelist_item.date_start) if pricelist_item.date_start else False
#         end_date = fields.Date.from_string(pricelist_item.date_end) if pricelist_item.date_end else False
#         today_date = fields.Date.from_string(fields.Date.today())
#         if start_date and end_date and start_date <= today_date <= end_date:
#            status = True 
#         elif not start_date and not end_date:
#            status = True 
#         elif start_date and not end_date and start_date <= today_date:
#            status = True 
#         elif not start_date and end_date and today_date <= end_date :
#            status = True 
#         else:
#            status = False
#         return pricelist_item.min_quantity>1 and status 

#     def get_all_child_category(self, product):
#         categ_ids = {}
#         if product:
#             categ = product.categ_id
#             while categ:
#                 categ_ids[categ.id] = True
#                 categ = categ.parent_id
#         categ_ids = list(categ_ids)
#         return categ_ids

    