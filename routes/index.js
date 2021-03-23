// $ npm install firebase-admin --save
var admin = require("firebase-admin");
// var serviceAccount = require("../firebase.json");
var serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://abhiapp-33dbc-default-rtdb.firebaseio.com"
});
// serviceAccount = require('./serviceAccount.json');
// const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// adminConfig.credential = admin.credential.cert(serviceAccount);
// admin.initializeApp(adminConfig);
const db = admin.database();
const {
    Router
} = require('express');
const router = Router();


router.get('/', (req, res) => {
    res.render('index')
});


router.get('/signup', (req, res) => {
    res.render("signup")
});


router.get("/home", (req, res) => {
    res.render("home")
});


router.get('/toggleadmin/:id/:token', (req, res) => {
    var uid = req.params.id;
    var token = req.params.token;

    admin
        .auth()
        .setCustomUserClaims(uid, {
            admin: true
        })
        .then(() => {
            console.log("sucesss");
            let url = "/admin/" + token;
            res.redirect(url);
        });

})



router.get('/toggleuser/:id', (req, res) => {
    var uid = req.params.id;

    admin
        .auth()
        .setCustomUserClaims(uid, {
            admin: false
        })
        .then(() => {
            console.log("sucesss");
            res.redirect('/user')
        });

})



router.get('/admin/:token', (req, res) => {
    var idToken = req.params.token;
    var arr = [];
    // idToken comes from the client app
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            console.log(true);
            admin
                .auth()
                .listUsers(1000)
                .then((listUsersResult) => {
                    listUsersResult.users.forEach((userRecord) => {
                        arr.push(userRecord.toJSON());
                        console.log(userRecord.toJSON())
                    });
                })
                .catch((error) => {
                    console.log('Error listing users:', error);
                });
        })
        .catch((error) => {
            res.end("You are not authorised to view this panel, become admin first!");
        });


    setTimeout(function() {
        console.log(arr);
        res.render('admin', {
            datas: arr
        });
        arr = [];
    }, 2000)


});


router.get('/user', (req, res, next) => {
    res.render("user")
});


module.exports = router;