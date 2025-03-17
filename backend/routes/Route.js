const { Router } = require("express");

const route = Router();

route.get("/api/test" ,(req,res)=>{
    res.send("Hello from test route");
})