import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  const existing = await UserModel.findByEmail(email);
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ name, email, password: hashedPassword });

  res.status(201).json({ success: true, message: 'Registered successfully', data: user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  if (!user.is_active) {
    res.status(403).json({ success: false, message: 'Account is disabled' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful',
    data: { user: userWithoutPassword, token },
  });
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, data: user });
};
