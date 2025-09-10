import express from 'express';

import { createUser, getUserByCredentials } from '#db/queries/users';
import requireBody from '#middleware/requireBody';
import { createToken } from '#utils/jwt';

const router = express.Router();

/**
 * @method POST
 * @route /users/register
 */
router.post(
  '/register',
  requireBody(['firstName', 'lastName', 'email', 'password']),
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const user = await createUser(firstName, lastName, email, password);
    const token = createToken({ id: user.id });

    return res.status(201).send(token);
  }
);

/**
 * @method POST
 * @route /users/login
 */
router.post('/login', requireBody(['email', 'password']), async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByCredentials(email, password);
  if (!user) return res.status(401).send('Invalid Username / Password...');

  const token = createToken({ id: user.id });

  return res.status(200).send(token);
});

export default router;