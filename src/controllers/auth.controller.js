import Account from "../models/account.js";

export const auth = (req, res) => {
  const user = req.body.name;
  const pass = req.body.password;

  const usuarios = Account.findOne(
    { name: user, password: pass },
    (err, data) => {
      if (err) {
        console.log("ERROR AL AUNTENTICAR AL USUARIO");
        res.redirect("/");
      } else if (!data) {
        console.log("LA CUENTA NO EXISTE");
        res.render("login", {
          sendAlert: true,
        });
      } else {
        req.session.loggedin = true;

        res.render("inicio");
      }
    }
  );
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
