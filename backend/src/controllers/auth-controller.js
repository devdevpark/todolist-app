import { register as registerService, login as loginService } from '../services/auth-service.js';

export async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await registerService(username, password);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const data = await loginService(username, password);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
