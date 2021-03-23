// {
//   "rules": {
//     "adminContent": {
//       ".read": "auth.token.admin === true",
//       ".write": "auth.token.admin === true",
//     }
//   }
// }

function login() {
  var userName = document.querySelector("#usermail").value;
  var userPassword = document.querySelector("#password").value;

  if (userName && userPassword === "") {
  } else {
    firebase
      .auth()
      .signInWithEmailAndPassword(userName, userPassword)
      .then((success) => {
        swal({
          type: "successfull",
          title: "Succesfully signed in",
        }).then((value) => {
          setTimeout(function () {
            window.location.replace("./home");
          }, 1000);
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        swal({
          type: "error",
          title: "Error",
          text: "Error",
        });
      });
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    //   User is signed in.
    let user = firebase.auth().currentUser;
    let uid;
    // get token and update the changes/status
    getToken();
    if (user != null) {
      uid = user.uid;
    }
    let firebaseRefKey = firebase.database().ref().child(uid);
    firebaseRefKey.on("value", (dataSnapShot) => {
      document.getElementById(
        "username"
      ).innerHTML = dataSnapShot.val().userName;
      document.getElementById(
        "goldenMsg"
      ).innerHTML = dataSnapShot.val().goldenMsg;
    });
  } else {
    //   No user is signed in.
  }
});

function signup() {
  var userName = document.querySelector("#username").value;
  var userEmail = document.querySelector("#usermail").value;
  var userPassword = document.querySelector("#password").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPassword)
    .then((success) => {
      var user = firebase.auth().currentUser;
      var uid;
      if (user != null) {
        uid = user.uid;
      }
      var firebaseRef = firebase.database().ref();
      var userData = {
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
      };
      firebaseRef.child(uid).set(userData);
      swal(
        "Your Account Created",
        "Your account was created successfully, you can log in now."
      ).then((value) => {
        setTimeout(function () {
          window.location.replace("./");
        }, 1000);
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      swal({
        type: "error",
        title: "Error",
        text: "Error",
      });
    });
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      swal({
        type: "successfull",
        title: "Signed Out",
      }).then((value) => {
        setTimeout(function () {
          window.location.replace("/");
        }, 1000);
      });
    })
    .catch(function (error) {
      // An error happened.
      let errorMessage = error.message;
      swal({
        type: "error",
        title: "Error",
        text: "Error",
      });
    });
}

function toogleadmin() {
  let user = firebase.auth().currentUser;
  let uid;

  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(function (token) {
      if (user != null) {
        uid = user.uid;
      }

      window.location.href = "./toggleadmin/" + uid + "/" + token;
    });
}

function toogleuser() {
  let user = firebase.auth().currentUser;
  let uid;
  if (user != null) {
    uid = user.uid;
  }

  window.location.href = "./toggleuser/" + uid;
}


function sendmsg(zx) {
  console.log(zx);
  // window.location.href = "./" + zx;

  // let user = firebase.auth().currentUser;
  let uid = zx;
  var firebaseRefo = firebase.database().ref();
  var msg = "Here is a golden message for you! that is your uid is  " + uid;
  var userData = {
    // userName: username,
    // userPassword: userpassword,
    // userEmail: usermail,
    goldenMsg: msg,
  };
  firebaseRefo.child(uid).update(userData);
  swal({
    type: "successfull",
    title: "Update successfull",
    text: "Profile updated.",
  });
}


function getToken() {
  var el = document.querySelector("#role");
  var adel = document.querySelector("#admin");
  var usel = document.querySelector("#user");
  var ad = document.querySelector("#ladmin");
  var us = document.querySelector("#luser");

  firebase
    .auth()
    .currentUser.getIdTokenResult()
    .then((idTokenResult) => {
      // Confirm the user is an Admin.
      if (!!idTokenResult.claims.admin) {
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            // Send token to your backend via HTTPS
            el.innerHTML = "Admin";
            adel.style.display = "none";
            usel.style.display = "block";
            ad.style.display = "block";
            ad.href = "/admin/" + idToken;
            us.style.display = "none";
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        el.innerHTML = "User";
        adel.style.display = "block";
        usel.style.display = "none";
        ad.style.display = "none";
        us.style.display = "block";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
