
const mongoose = require("mongoose");
// schema
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body : String,
	created : {type: Date, default: Date.now},
})

// blogs : collections
module.exports = mongoose.model("Blogs", blogSchema);