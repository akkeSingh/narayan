# -*- coding: utf-8 -*-
#################################################################################
#
# Copyright (c) 2019-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>:wink:
# See LICENSE file for full copyright and licensing details.
#################################################################################

{
    "name"                 :  "Website: Product Slot Pricing",
    "summary"              :  "Show various product offers on product page.",
    "category"             :  "Website",
    "version"              :  "1.1.0",
    "sequence"             :  1,
    "author"               :  "Webkul Software Pvt. Ltd.",
    "license"              :  "Other proprietary",
    "website"              :  " ",
    "description"          :  """ """,
    "live_test_url"        :  "http://odoodemo.webkul.com/?module=product_price_slots&version=12.0",
    "depends"              :  ['website_sale'],
    "data"                 :  ['views/website_template_view.xml'],
    "images"               :  ['static/description/Banner.png'],
    "application"          :  True,
    "installable"          :  True,
    "auto_install"         :  False,
    "price"                :  59,
    "currency"             :  "EUR",
    "pre_init_hook"        :  "pre_init_check",
}
