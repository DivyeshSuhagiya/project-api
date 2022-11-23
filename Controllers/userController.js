const USER = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user = {
  getUser: async (req, res) => {
    try {
      var token = req.headers.authorization?.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_KEY, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            message: "Auth token not found",
            error: err,
            isSuccess: false,
          });
        } else {
          const user = await USER.findOne({_id: decoded.user_Id,});
          if(user){
            res.status(200).json({
              message: "User find successfully",
              data : user
            });
          }
          else{
            res.status(200).json({
              message: "User is not found!!"
            });
          }
        }
      });
    } catch (error) {
      res.json({data: error});
    }
  },
  delete: async (req, res) => {
    try {
      var token = req.headers.authorization?.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_KEY, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            message: "Auth token not found",
            error: err,
            isSuccess: false,
          });
        } else {
          const user = await USER.findOne({_id: decoded.user_Id,});
          if(user){
            await USER.findByIdAndRemove({_id: decoded.user_Id,});
            res.status(200).json({
              message: "User deleted successfully"
            });
          }
          else{
            res.status(200).json({
              message: "User is not found"
            });
          }
        }
      });
    } catch (error) {
      return res.status(200).send(error);
    }
  },
  login: async (req, res) => {
    try {
      let userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (!userInfo) {
        res.status(400).send("Email not found!");
      }
      if (!bcrypt.compareSync(req.body.password, userInfo.password)) {
        res.status(400).send("Authentication failed. Wrong password.");
      }

      var token = jwt.sign({user_Id : userInfo._id}, process.env.TOKEN_KEY, {
        expiresIn: "24h",
      });
      return res.status(400).send({
        message: "You are logged in successfully!",
        email : req.body.email,
        token : token
      });
    } catch (error) {
      return res.status(400).send(error, req, res);
    }
  },
  register: async function (req, res) {
    try {
      let { userName, email, mobile, gender, password, confirmPassword } = req.body;
      if (!(userName && email && mobile && gender && password && confirmPassword)) {
        res.status(400).send("All input is required");
      }

      const userInfo = await USER.findOne({ email });
      if (userInfo) {
        res.status(400).send("Email already exist!");
      }

      if (password !== confirmPassword) {
        res.status(400).send("Password and Confirm Password must be same");
      }
      bcrypt.hash(confirmPassword, 10).then(async (hash) => {
          password = hash;
          const user = await USER.create({ userName, email, mobile, gender, password });

          res.status(200).json({
            message: "User created successfully",
            data: user,
          });
        })
        .catch((err) => {
          return res.status(400).json(err);
        });
      
    } catch (error) {
      return res.status(400).json(error, req, res);
    }
  },
};
