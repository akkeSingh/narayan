/* Copyright (c) 2019-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : https://store.webkul.com/license.html/ */

odoo.define('firebase_auth.sdk', function (require) {
    "use strict";
    var ajax = require('web.ajax');

    $(document).ready(function () {
        // Your web app's Firebase configuration
        console.log("firebase",firebase);

        var provider = new firebase.auth.GoogleAuthProvider();
        // var firebaseConfig = {
        //     apiKey: "AIzaSyBMLLc4lOasOhP68CKMBcdp3wREx_FQpxs",
        //     authDomain: "authsignup-5c714.firebaseapp.com",
        //     databaseURL: "https://authsignup-5c714.firebaseio.com",
        //     projectId: "authsignup-5c714",
        //     storageBucket: "authsignup-5c714.appspot.com",
        //     messagingSenderId: "456284851138",
        //     appId: "1:456284851138:web:c67a3b6a89eb231b14e45b",
        //     measurementId: "G-53WRC4YDX4"
        // };
        // // Initialize Firebase
        // firebase.initializeApp(firebaseConfig);
        // firebase.analytics();

    });
    
});