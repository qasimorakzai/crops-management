import express from 'express';
const app = express();
export default function handler(req, res) {
    res.status(200).json({ message: 'Hello from Vercel' });
  }
  

