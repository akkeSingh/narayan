# -*- coding: utf-8 -*-

{
    "name"                 :    "Website Theme Outline",
    "summary"              :    "Odoo Website Theme: Outline",
    "version"              :    "1.0.0",
    "sequence"             :    1,
    "author"               :    "",
    "license"              :    "Other proprietary",
    "website"              :    "",
    "live_test_url"        :    "",
    "description"          :     """ Odoo Theme Base""",

    "depends"               :   [
                                    "website_sale",
                                    "website_sale_wishlist",
                                    "website_blog",
                                    "website_sale_comparison",
                                    "website_sale_stock",
                                    "auth_oauth",
                                    "auth_signup",
                                    "mass_mailing",
                                    'sale',
                                    "website_google_map",
                                ],
    "data"                 :    [
                                    'security/ir.model.access.csv',
                                    # "views_backend/product_brands_views.xml",
                                    "views_backend/product_label_views.xml",
                                    "views_backend/product_pricelist_item.xml",
                                    "views_backend/res_config_settings_views.xml",
                                    "views_backend/mega_menu_views.xml",

                                    "views/assets_frontend.xml",
                                    "views/lazy_load_templates.xml",
                                    "views/website_shop_templates.xml",
                                    "views/website_product_templates.xml",
                                    "views/website_wishlist_templates.xml",
                                    "views/website_extra_page_templates.xml",
                                    "views/login_signup_temlates.xml",
                                    "views/snippets.xml",
                                    "views/mega_menu_templates.xml",
                                    
                                    

                                    "views/header_templates.xml",
                                    "views/footer_templates.xml",
                                ],
    "demo"                 :    [
                                    # 'data/demo_config.xml',
                                    # 'data/demo_public_categories.xml',
                                    # 'data/demo_products.xml',
                                ],
    "images"               :    [
                                    'static/description/Banner.png',
                                    'static/description/banner_screenshot.png',
                                ],

    "qweb"                 :  ['static/src/xml/*.xml'],
    "category"             : "Theme/Corporate",
    "installable"          :  True,
    "auto_install"         :  False,
    "price"                :  0,
    "currency"             :  "EUR",
}
