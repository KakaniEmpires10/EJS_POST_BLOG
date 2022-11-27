//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require ('lodash');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/jurnalDB");
// const posts = [];

let titleSchema = {
  name: String,
  header: String
};

let Title = mongoose.model ('title', titleSchema);

let home = new Title({
  name: "home",
  header: "This is just a simple journal web, build to test my expertise on nodeJS webapp development... and yeah, hope you enjoyed it and hope this is usefull to everyone in anyplace and anytime"
});
let about = new Title({
  name: "about",
  header: "This is just a simple journal web, build to test my expertise on nodeJS webapp development... and yeah, hope you enjoyed it and hope this is usefull to everyone in anyplace and anytime"
})
let contact = new Title({
  name: "contact",
  header: "This is just a simple journal web, build to test my expertise on nodeJS webapp development... and yeah, hope you enjoyed it and hope this is usefull to everyone in anyplace and anytime"
})

let postSchema = {
  title : String,
  content : String
};

let Post = mongoose.model ('post', postSchema);

app.get('/', (req, res) => {
  Title.findOne({name: 'home'}, function (err, hcontent) {
    if (!hcontent) {
      home.save();
    } else {
      Post.find({}, function (err, posts) {
        if (err) {
          console.log(err);
        } else {
          res.render('home', {hcontent: hcontent.header, newPosts: posts});
        }
      });
    }
  });

})

app.get('/post/:postId', (req, res) => {
  // console.log(req.params.id);
  // const reqPostId = _.lowerCase (req.params.postId);
  const reqPostId = (req.params.postId);

  Post.findOne({_id: reqPostId}, (err, post) => {
    if (!err) {
      res.render('post', {pTitle: post.title, pBody: post.content});
    }
  });

  // posts.forEach(post => {
    
  //   const postId = _.lowerCase(post.title);

  //   if (postId === reqPostId) {
  //     res.render('post',{pTitle: post.title, pBody: post.body});
  //   } 
  // });
})

app.get('/about', (req, res) => {
  Title.findOne({name: 'about'}, function (err, bcontent) {
    if (!bcontent) {
      about.save();
    } else {
      res.render('about', {bcontent: bcontent.header});
    }
  })

})

app.get('/contact', (req, res) => {
  Title.findOne({name: 'contact'}, function (err, ccontent) {
    if (!ccontent) {
      contact.save();
    } else {
      res.render('contact', {ccontent: ccontent.header});
    }
  })

})

app.get('/compose', (req, res) => {
  res.render('compose');
})

app.post('/compose', (req, res) => {

  let post = new Post ({
    title : req.body.postTitle,
    content : req.body.postText
  })

  post.save();

  // let post = {
  //   title: req.body.postTitle,
  //   body: req.body.postText
  // }

  // posts.push(post);

  res.redirect('/');
})

let port = process.env.PORT;
if (port == null || port == " ") {
  port = 3000;
}

app.listen(port, function() {
  console.log(`Server started on ${port}`);
});
