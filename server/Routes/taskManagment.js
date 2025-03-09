const express = require('express');
const Router = express.Router();
const userSchema = require('../model/user');
const taskSchema = require('../model/task');
const authentication = require('../controller/Authentication');

// add new tasks
Router.post('/tasks',authentication,async(req,res)=>{ // done
  try{
    const userId = req.user?.userId;
    const title = req.body.title;
    const desc = req.body.desc;
    console.log(userId,title,desc);
    const user = await userSchema.findById(userId);
    if(!user){
      return res.status(404).json({error: true, msg: "something went wrong"});
    }
    const newTask = new taskSchema({
      userId: user._id,
      title: title,
      description: desc
    })
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  }catch(err){
    res.status(500).json({ error: true, msg: "Internal server error" });
  }
})

// fetch all tasks
Router.get("/tasks",authentication,async(req,res)=>{ // done
  try{
    const userId = req.user.userId;
    const user = await userSchema.findById(userId);
    if(!user){
      return res.status(404).json({error: "something went wrong"});
    }
    else{
      console.log(user._id,"user._id}");
      const userTasks = await taskSchema.find({userId: user._id});
      if(userTasks.length === 0){
        res.status(200).json([]);
      }
      else{
        res.status(200).json(userTasks);
      }
    }
  }catch(err){
    res.status(500).json({ error:false, msg: "Internal server error" });
  }
})

// get specific task
Router.get("/tasks/:id",authentication,async(req,res)=>{ // done
  try{
    const id = req.params.id;
    const task = await taskSchema.findById(id);
    if(!task){
      res.status(404).json({msg:"something went wrong"});
    }
    else{
      res.status(200).json(task);
    }
  }catch(err){
    res.status(500).json("Internal server error");
  }
})

// update a task
Router.put("/tasks/:id",authentication,async(req,res)=>{ // done
  try{
    const {title, desc} = req.body;
    const id = req.params.id;
    const task = await taskSchema.findById(id);
    task.title = title;
    task.description = desc;
    await task.updateOne(task);
    res.status(201).json(task);
  }catch(err){
    res.status(500).json("Internal server error");
  }
})

// delete a task
Router.delete("/tasks/:id",authentication,async(req,res)=>{ // done
  try{
    const id = req.params.id;
    const task = await taskSchema.findById(id);
    await task.deleteOne();
    res.status(200).json({msg: "task is deleted successfully"});
  }catch(err){
    res.status(500).json({error: true, msg: "Internal server error"});
  }
})

module.exports = Router;