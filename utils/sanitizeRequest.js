const sanitizeHtml = require('sanitize-html');
const express = require('express')

const sanitizeRequest = (req, res, next)=> {
    if(req.body){
        for(let i of Object.keys(req.body)){
            req.body[i] = sanitizeHtml(req.body[i]);
            
        }
    }
       
    next();
}

module.exports = sanitizeRequest;