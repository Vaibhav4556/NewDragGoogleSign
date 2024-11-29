const express = require("express");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const jwt_decode = require('jwt-decode')
const { OAuth2Client } = require("google-auth-library");
bodyParser = require("body-parser");

const client = new OAuth2Client("174883911723-ofusqjjou2ip1dcntihss8alb2k3h38e.apps.googleusercontent.com");
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3003;

mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://Vaibhav4556:vaibhav8336@cluster0.9ngzy3n.mongodb.net/user123 "
  )
  .then(() => console.log("Connected!"))
  .catch(() => console.log("connection error"));

const userSchema = new mongoose.Schema({
  email: String,
  phone:String,
  userName:String,
  profession:String,
  password: String,
  cpassword: String,
});

const ListItemSchema = new mongoose.Schema({
  listId: {
    type: String,
    required: true,
    enum: ["listOne", "listTwo", "listThree"], // List identifiers
  },
  item: {
    type: String,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);

const ListItem = new mongoose.model("ListItem", ListItemSchema);

app.post("/register", express.json(), function (req, res) {
  // res.send('This is register page')
  const { email, password,phone,profession,userName } = req.body;
  User.findOne({ email: email} || {phone:phone}, (err, user) => {
    if (user) {
      res.send({ message: "user already registered" });
    } else {
      const user = new User({
        email,
        password,
        phone,
        userName,
        profession
      });

      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, function (err, hash) {
        user.password = hash;
        console.log(hash);
        user.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.status(200).send({ message: "user registerd successfully" });
          }
        });
      });
    }
  });

  // res.send(req.body)
});

//Login page

app.post("/login", express.json(), function (req, res) {
  // res.send('This is register page')
  const { email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (!user) {
      // console.log("email not foundr");
      res.send({ message: "Email not found" });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.send({ message: err });
        }
        else if(!result){
          res.send({message:"Incorrect Password"})
        }
        else {

          
          var token = jwt.sign({ user}, "asdfgmnbvc");
         
          res.send({ message: "Login successfull", token });
         
          //  console.log(token);
           
        }
      });
    }
  });
});


app.get("/content",  (req, res) => {
   
    // res.send('This is register page')
    const token = req.header("Token");
    

    try {
      jwt.verify(token, 'asdfgmnbvc', function (err, decrypt) {
      
                    res.send({
          statusCode: 200, message: {
            email: decrypt.user.email,
            phone : decrypt.user.phone,
            userName : decrypt.user.userName,
            profession : decrypt.user.profession

          }
        });
      });
    }
    catch {
      res.send({ statusCode: 404, message: "Error getting content" });
    }
   
  });


  app.get("/edit",  (req, res) => {
    
    // res.send('This is register page')
    const token = req.header("Token");
    console.log(token);

    try {
     
      const decoded = jwt.decode(token)
      console.log(decoded);
    }
    catch {
      res.send({ statusCode: 404, message: "Error getting content" });
    }
   
  });





app.get("/", function (req, res) {
  res.send({message : "Hello World"});
});

app.post("/google", async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: "174883911723-ofusqjjou2ip1dcntihss8alb2k3h38e.apps.googleusercontent.com", 
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Find or create user logic
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    // Generate JWT for the session
    const token = jwt.sign({ id: user._id }, "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", {
      expiresIn: "1d",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new item
app.post("/api/items", async (req, res) => {
  const { listId, item } = req.body;

  if (!listId || !item) {
    return res.status(400).json({ message: "listId and item are required" });
  }

  try {
    const newItem = new ListItem({ listId, item });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
});

// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await ListItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
});

// Delete an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ListItem.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
});

// Edit an item
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ message: "Item text is required" });
  }

  try {
    const updatedItem = await ListItem.findByIdAndUpdate(
      id,
      { item },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error editing item", error });
  }
});


app.put("/api/items/:id", async (req, res) => {
  try {
    const { listId } = req.body;

    // Find the item by ID and update its listId
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { listId },
      { new: true } // Return the updated item
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating listId:", error);
    res.status(500).json({ error: "Failed to update listId" });
  }
});





app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
