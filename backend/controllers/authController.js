import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'yourHardcodedSecretKey';
const JWT_EXPIRES_IN = '1d';

let users = [];

export const initializeUsers = async () => {
  // Hash password for in-memory user at server start
  users = [
    { id: 1, username: 'admin', password: await bcrypt.hash('password', 10) },
  ];
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // set to true if using HTTPS
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({ message: 'Login successful' });
};
export const logout = (req, res) => {
  res.clearCookie('token');      // clear JWT token cookie
  res.clearCookie('connect.sid'); // just in case, clear session cookie if used
  
  return res.json({ message: 'Logged out' });  // send response immediately
};


export const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const user = jwt.verify(token, JWT_SECRET); // use same key as in login
    res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
};

