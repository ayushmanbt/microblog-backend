//requiring files
const express = require("express");
const blogsRouter = express.Router();

const { body } = require("express-validator");
const validationMiddleware = require("../middlewares/validationMiddleware");

const Blog = require("../models/Blog");

//routes

//get all blog posts paginated, default values page=0 count=5
blogsRouter.get(
    "/all",
    async(req,res) => {
       
        try {
            let {page, count} = req.query;
            if(!page){
                page = 0
            } if (!count){
                count = 5
            }
            page = Number(page);
            count = Number(count);
            const blogs = await Blog.find().limit(count).skip(page * count).sort({createdAt: -1})
            let totalPages = Math.ceil( await Blog.count({}) / count);
            return res.json({
                message: "Success",
                blogs,
                page,
                count,
                totalPages
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)

//get one blog post by id
blogsRouter.get(
    "/byid/:id",
    async(req,res) => {
       
        try {
            let {id} = req.params;
            
            const blog = await Blog.findById(id)
            
            if(!blog){
                return res.json({
                    message: 'Could not find your blog by id'
                })
            }

            return res.json({
                message: "Success",
                blog
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)

//get one blog post by slug
blogsRouter.get(
    "/byslug/:slug",
    async(req,res) => {
        try {
            let {slug} = req.params;
            
            const blog = await Blog.find({slug})
            
            if(!blog || blog.length == 0){
                return res.json({
                    message: 'Could not find your blog by slug'
                })
            }

            return res.json({
                message: "Success",
                blog: blog[0]
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)


//create a blog
blogsRouter.post(
    "/create",
    body("title").notEmpty(),
    body("content").notEmpty(),
    body("slug").notEmpty(),
    validationMiddleware,
    async(req, res) => {
        try {
            const {title, content, slug} = req.body
            const exsisteingBlog = await Blog.find({
                $or: [
                    {'title': title},
                    {'slug': slug}
                ]
            })
            console.log(exsisteingBlog);

            if(exsisteingBlog.length > 0){
                return res.status(400).json({
                    message: "Found a blog with same title or slug"
                })
            }

            let blog = new Blog({
                title,
                content,
                slug
            })

            await blog.save();

            return res.json({
                message: "Blog created successfully",
                blog
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)



// editing a blog post by id
blogsRouter.post(
    "/editbyid",
    body("_id").notEmpty(),
    validationMiddleware,
    async(req, res) => {
        try {
            const {_id} = req.body
            const exsisteingBlog = await Blog.findById(_id);

            if(!exsisteingBlog) {
                return res.status(404).json({
                    message: "Did not find a blog with same id"
                })
            }


            Object.keys(req.body).forEach(key => {
                exsisteingBlog[key] = req.body[key]
            })

            await exsisteingBlog.save();

            return res.json({
                message: "Blog updated successfully",
                exsisteingBlog
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)



// deleting a blog post by slug
blogsRouter.post(
    "/deletebyslug",
    body("slug").notEmpty(),
    validationMiddleware,
    async(req, res) => {
        try {
            const {slug} = req.body
            const exsisteingBlog = await Blog.find({slug});

            if(exsisteingBlog.length == 0) {
                return res.json({
                    message: "Did not find a blog with that slug"
                })
            }

            const blog = await Blog.deleteOne({
                slug
            }, {
                new: true
            });
            return res.json({
                message: "Blog deleted successfully",
                blog
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)



// deleting a blog post by id
blogsRouter.post(
    "/deletebyid",
    body("_id").notEmpty(),
    validationMiddleware,
    async(req, res) => {
        try {
            const {_id} = req.body
            const exsisteingBlog = await Blog.findById(_id);

            if(exsisteingBlog.length == 0) {
                return res.json({
                    message: "Did not find a blog with that slug"
                })
            }

            const blog = await Blog.findByIdAndDelete(_id, {
                new: true
            });
            return res.json({
                message: "Blog deleted successfully",
                blog
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                error: String(error)
            })
        }
    }
)


//exporting the router
module.exports = blogsRouter