import express from 'express';
//const express = require('express');
import prisma from './src/db.js';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', async (req, res) => { 
    await prisma.$connect();
    const users = await prisma.user.findMany();   
    res.json({ message: 'Hello from the API!', users });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
