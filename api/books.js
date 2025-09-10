import express from 'express';

import { createBook, getBookById, getBooks } from '#db/queries/books';
import {
  getReservationByBookId,
  getReservationsByItem,
} from '#db/queries/reservationItem';
import requireBody from '../middleware/requireBody.js';
import requireUser from '../middleware/requireUser.js';

const router = express.Router();

/**
 * @method
 * @route /books
 */

router.route('/').get(async (req, res) => {
  const books = await getBooks();

  return res.status(200).send(books);
});

router
  .route('/')
  .post(
    requireBody(['title', 'author', 'description', 'coverImage']),
    async (req, res) => {
      const { title, author, description, coverImage } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).send('Unauthorized.');

      const books = await createBook(
        title,
        author,
        description,
        coverImage,
        userId
      );
      res.status(201).send(books);
    }
  );

router.param('id', async (req, res, next, id) => {
  const books = await getBookById(id);
  if (!books) return res.status(403).send('Book not found.');

  req.books = books;

  next();
});

router.route('/:id').get((req, res) => {
  return res.status(201).send(req.books);
});

router.route('/:id/reservations').get(requireUser, async (req, res) => {
  if (!req.params.id) return res.status(401).send('Invalid Book ID...');

  const reservations = await getReservationsByItem(req.user.id, req.params.id);

  if (req.user.id !== reservations.user_id)
    return res.status(403).send('You are not authorized to be here!');

  const bookReservations = await getReservationByBookId(req.params.id);

  return res.send(bookReservations);
});

export default router;