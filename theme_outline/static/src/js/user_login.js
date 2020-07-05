odoo.define('theme_outline.user_login', function(require) {
    'use strict';
    var publicWidget = require('web.public.widget');
    // override core events and add to compare functionality
    publicWidget.registry.userLogin = publicWidget.Widget.extend({
        selector: '.th_signin',
        read_events: {
            "click .th_user_account_icon": "_onClickUserLogin",
        },
        start: function() {
            var self = this;
            this._super.apply(this,arguments);
            this.$modal = $('#user_login_modal');
        },
        _onClickUserLogin: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var self = this;
            var $target = $(ev.currentTarget);

            this.$modal.modal('show').find(".modal-content").find(".data_loader").show();
            // this.$modal.find(".modal-body");
            var url = "/web/login/"
            $.get(url, {}, function(data) {
                if(data) {
                    self.$modal.find('.modal-body').html($(data).find(".oe_website_login_container"));
                    self.$modal.find('.modal-content').find(".data_loader").hide();
                } else {
                    console.log("data", data);
                }
            });
        },
    });
    publicWidget.registry.userLoginModal = publicWidget.Widget.extend({
        selector: '#user_login_modal',
        read_events: {
            "click .oe_login_buttons button[type='submit']": "_onSubmitForm",
            "click a[href^='/web/signup']": "_onClickUrl",
            "click a[href^='/web/login']": "_onClickUrl",
            "click a[href^='/web/reset_password']": "_onClickUrl",
        },
        start: function() {
            this._super.apply(this,arguments);
            this.$modal = this.$el;
        },
        _onSubmitForm:function(ev){
            this.preFetchTask(ev);
            var $currentTarget = $(ev.currentTarget);
            this.$modal.find('.modal-content').find(".data_loader").show();
            var $form = $currentTarget.closest("form");
            if ($form.length!=0)
                $.ajax({
                    type: 'POST',
                    url: $form.attr("action"),
                    data: $form.serialize(), 
                }).then(this.appendResponseFunc());
        },
        _onClickUrl:function(ev){
            var self = this;
            this.preFetchTask(ev);
            var currentTarget = $(ev.currentTarget);
            var href = currentTarget.attr("href");
            $.get(href, {}).then(this.appendResponseFunc());
        },
        appendResponseFunc:function(){
            var self = this;
            return (response) =>{
                if(response){
                    console.log("response",response);
                    var $response = $(response);
                    var $login_container = $response.find(".oe_website_login_container");
                    if ($login_container.length != 0){
                        self.$modal.find('.modal-body').html($login_container);
                        self.$modal.find('.modal-content').find(".data_loader").hide();
                    }
                    else
                        location.reload();
                }else{
                    console.log("response", response);
                }
            }
        },
        preFetchTask:function(ev){
            ev.stopPropagation();
            ev.preventDefault();
            this.$modal.find('.modal-content').find(".data_loader").show();
        }
    });
    
});