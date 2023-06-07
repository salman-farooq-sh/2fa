
# Two-Factor/Multi-Factor Authentication: A Complete Front-End and Back-End Guide Using the MERN Stack and Google Authenticator

Two-Factor Authentication (2FA), also called Multi-Factor Authentication (MFA), is an open-source standard that greatly enhances user security while being pretty straightforward to implement. Many of the world’s top websites employ this simple yet powerful security measure when logging-in their users.

## How does it work?

In addition to the usual ID and password pair, you are required to provide an additional secret code, usually 6-digits, to login which you obtain from an authenticator application (e.g. [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2) or [this Chrome extension](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai)) installed in your phone or web browser which you have registered with the platform or website you are logging into by simply scanning a QR code. After the initial registration step, the authenticator app doesn’t even need to be online to give you the required secret OTP. Magic! Right?

As it is with all things in computer science, it turns out it is not magic, rather it is only some solid logic. At the heart of 2FA/MFA, the kind we are going to implement, are two cryptographic algorithms. The first algorithm when simplified takes as input three things:

1. The current approximate time on the clock
2. A user specific secret key
3. And an OTP usually consisting of 6 digits

Its output is a simple yes or no specifying the validity of the input triplet. The second algorithm is similar to the first one except that instead of taking an OTP as the third input, it spits one out.

Thus, by having a server and a client which share the clock and a secret, the client’s claim of possessing the secret previously shared by the server can be verified without actually sharing the secret. This secret can then be used for user authentication.

## Prerequisites for this tutorial

Before starting, make sure you have a recent version of the following installed and set up:

1. [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/)
2. [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
3. [Postman](https://www.postman.com/downloads/) with [this collection](https://github.com/SalmanFarooqShiekh/2fa/blob/main/backend/postman/Express-2FA.postman_collection.json) imported
4. [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2) (or a [similar](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai) app)

## So let’s start!

Begin by creating a new empty directory called 2fa which will hold the code for both our Express backend and React frontend. We will start with the backend and test it with Postman as we go. Create another directory called backend inside 2fa and run this in it:

```
npm init -y
```

This will initialize the project by creating a brand new package.json file in the project root with default values. Next, install the packages we will be using:

```
npm install bcrypt cors express jsonwebtoken mongoose otplib passport passport-jwt passport-local qrcode
```

All these packages will be installed in the project’s newly created node_modules folder which you can inspect with your file explorer if you are curious. Now create and open a file called index.js in the project root which will be the entry point for our code and put this in it:

```
const express = require("express");

const PORT = 9001;
const app = express();

app.get(
  "/hello", (req, res) => {
    res.json('hello world!')
  }
);

app.listen(PORT, () =>
  console.log(`Express started on http://localhost:${PORT}`)
);
```

And then run it with:

```
node index.js
```

This will create and start a basic Express server which you can test by going to [http://localhost:9001/hello](http://localhost:9001/hello) in your browser. While this is nice, we will soon want more control over making requests to our server and for this purpose we will start using Postman from the get-go:
