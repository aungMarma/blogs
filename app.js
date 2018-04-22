const express    	 = require("express"),
	  app        	 = express(),
	  bodyParser 	 = require("body-parser"),
	  mongoose       = require("mongoose"),
	  methodOverride = require("method-override"),
	  sanitizer      = require("express-sanitizer");  // GET RID OF SCRIPT/JS

// conncet to blog database
mongoose.connect("mongodb://localhost/blog");

// set ejs view engine, serve public files, parse body of post request
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());   // after bodyParser, body needs to be sanitized!!!!
app.use(methodOverride("_method"));

// schema
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body : String,
	created : {type: Date, default: Date.now},
})

// blogs : collections
const Blog = mongoose.model("Blogs", blogSchema);

// RESTFUL ROUTES:  
app.get("/", function(req, res){
	res.redirect("/blogs");
})

app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, result){
		if(err){
			console.log("Error while finding all");
			console.log(err);
		}else{
			// res.send(result);
			res.render("index", {blogs: result});
		}
	})
})

app.get("/blogs/new", function(req, res){
	res.render("new");
})

app.post("/blogs", function(req, res){
	// sanitize body of blog
	let blog = req.body.blog;
	blog.body = req.sanitize(blog.body);
	Blog.create(blog, function(err, createdBlog){
		if(err){
			console.log("Error while creating with user's post")
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	})
})

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, found){
		if(err){
			console.log("Error while finding by Id");
			console.log(err);
		}else{
			// res.send(result);
			res.render("show", {blog: found});
		}
	})
})

// edit: get the form to edit, update: post the edited form
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, found){
		if(err){
			console.log("Error while finding by Id to edit");
			console.log(err);
		}else{
			// res.send(result);
			res.render("edit", {blog: found});
		}
	})
})

app.put("/blogs/:id", function(req, res){
	let blog = req.body.blog;
	blog.body = req.sanitize(blog.body);
	Blog.findById(req.params.id, function(err, found){
		if(err){
			console.log("Error while finding by Id to update");
			console.log(err);
		}else{
			// update and save
			found.title = blog.title;
			found.image = blog.image;
			found.body = blog.body;
			found.save(function(err, updated){
				if(err){
					console.log("Error while saving updated");
					console.log(err);
				}else{
					// res.send(result);
					res.redirect("/blogs/" + req.params.id);
				}
			})
		}
	})

	// Blog.findByIdAndUpdate(req.params.id, blog, function(err, updated){
	// 	if(err){
	// 		console.log("Error while finding/updating");
	// 		console.log(err);
	// 	}else{
	// 		found.save(function(err, updated){
	// 			if(err){
	// 				console.log("Error while saving updated");
	// 				console.log(err);
	// 			}else{
	// 				res.redirect("/blogs/" + req.params.id);
	// 			}
	// 		})
	// 	}
	// })
})

app.delete("/blogs/:id", function(req, res){
	Blog.deleteOne({ _id: req.params.id }, function (err) {
		if(err){
			console.log("Error while deleting");
			console.log(err)
		}else{
			res.redirect("/blogs");
		}
	});
})

// listen to server
const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("BlogApp server has started at", port);
})