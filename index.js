import express from 'express';
//const express = require('express');
import prisma from './src/db.js';
import { disconnect } from 'cluster';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', async (req, res) => { 
    await prisma.$connect();
    const users = await prisma.user.findMany();   
    res.json({ message: 'Hello from the API!', users });
    await prisma.$disconnect();
});

app.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        products: true
      }
    });

    const total = await prisma.user.count();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      data: users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    res.status(201).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, userId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        userId
      }
    });

    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, userId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        userId
      }
    });

    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: true
      }
    });

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
