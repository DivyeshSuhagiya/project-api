const PRODUCT = require("../model/product");
const jwt = require("jsonwebtoken");

exports.product = {
  add: async (req, res) => {
    try {
      const { productName, price, category, shopName, mobile, discount } = req.body;

      if (!(productName && price && category && shopName && mobile && discount)) {
        res.status(400).send("All input is required");
      }

      var token = req.headers.authorization?.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_KEY, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            message: "Auth token not found",
            error: err,
            isSuccess: false,
          });
        } else {
          const product = await PRODUCT.create({productName,price,category,shopName,mobile,discount,
            userId: decoded.user_Id,
          });

          if(product){
            res.status(200).json({
              message: "Product uploaded successfully!!",
              data: product,
            });
          }
        }
      });
    } catch (err) {
      res.json(err);
    }
  },

  get: async (req, res) => {
    try {
      var token = req.headers.authorization?.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_KEY, async function (err, decoded) {
        if (err) {
          return res.json({
            message: "Auth token not found",
            error: err,
            isSuccess: false,
          });
        } else {
          const product = await PRODUCT.find({ userId: decoded.user_Id });
          res.json({
            message: "Your data finded",
            data: product,
          });
        }
      });
    } catch (err) {
      res.json(err);
    }
  },
  update: async (req, res) => {
    try {
      const { productName, price, category, shopName, mobile, discount } = req.body;

      if (!(productName && price && category && shopName && mobile && discount)) {
        res.status(400).send("All input is required");
      }

      var token = req.headers.authorization?.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_KEY, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            message: "Auth token not found",
            error: err,
            isSuccess: false,
          });
        } else {
          let PRO = PRODUCT.find({userId : decoded.user_Id});
          const product = await PRO.findOneAndUpdate({_id : req.query.id} , {productName,price,category,shopName,mobile,discount,
            userId: decoded.user_Id,
          });

          if(product){
            res.json({
              message: "Product updated successfully!!",
              data: product,
            });
          }
          else{
            res.status(400).json({
              message: "This product is not found!!"
            });
          }
        }
      });
    } catch (err) {
      res.json(err);
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
          let PRO = PRODUCT.find({userId : decoded.user_Id});
          const product = await PRO.findOneAndDelete({_id : req.query.id});

          if(product){
            res.status(200).json({
              message: "Product deleted successfully!!"
            });
          }
          else{
            res.status(200).json({
              message: "This product is not found!!"
            });
          }
        }
      });
    } catch (err) {
      res.json(err);
    }
  },

};
