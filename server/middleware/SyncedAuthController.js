/*
    Synced
    Copyright (C) 2024  Atheesh Thirumalairajan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* Import Required Libraries */
const jwt = require('jsonwebtoken');

const SyncedAuthController = class {
    constructor(app, rtcUserController) {
        this.app = app;
        this.rtcUserController = rtcUserController;
    }

    /* Define Required Auth Middleware */
    static verifyToken = (authToken, callback) => {
        jwt.verify(authToken, process.env.JWT_SECRET, callback);
    }

    /* Define Express Auth Middleware */
    static isOnboarded = (req, res, next) => {
        this.verifyToken(req.cookies.authToken, (err, data) => {
            /* Return if Error */
            if (err) return next(err);

            /* Set req.token */
            req.token = data;
            next();
        });
    }

    init = () => {
        this.app.get("/auth/verify", (req, res) => {
            /* Auto Renew the JWT token if user exists in the user controller */
            if (!req.cookies.authToken) return res.status(400).json({ status: false, message: "Authentication Token does not exist" })

            /* Verify JWT */
            SyncedAuthController.verifyToken(req.cookies.authToken, (err, data) => {
                if (err)
                    return res.status(401).json({ status: false, message: "Authentication Token Verification Failed" });

                if (this.rtcUserController.getUser(data.userId))
                    res.status(200).json({ status: true, userData: { ...data.username } });

                else
                    res.status(401).json({ status: false, message: "User Expired" });
            });
        });

        this.app.post("/auth/login", (req, res) => {
            if (req.body.username && req.body.anonymous) {
                /* Use Anonymous Authorization, Create New User */
                const newUserId = this.rtcUserController.createUser(req.body.username);

                /* Sign The JWT */
                const authToken = jwt.sign(
                    { userId: newUserId, username: req.body.username, anonymous: true },
                    process.env.JWT_SECRET,
                    { expiresIn: '1800s' }
                );

                /* Set httpOnly Cookies */
                res.cookie('authToken', authToken, { httpOnly: true, maxAge: (1000 * 60 * 30) })
                return res.status(200).send({ message: 'Authentication Successful', status: true });
            } else if (req.body.username && req.body.password) {
                /* Use Database Authentication */
            } else {
                /* Invalid API Call */
                return res.status(400).json({ message: "Username or Password Undefined" })
            }
        });
    }
};

module.exports = SyncedAuthController;