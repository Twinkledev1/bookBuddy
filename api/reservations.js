import express from 'express';

import { createReservationItem } from '#db/queries/reservationItem';
import {
  createReservation,
  getReservationById,
  getReservationsByUserId,
} from '#db/queries/reservation';
import requireBody from '#middleware/requireBody';
import requireUser from '#middleware/requireUser';

const router = express.Router();

router.use(requireUser);

/**
 * @method GET
 * @route /reservations
 */
router.get('/', async (req, res) => {
  const reservations = await getReservationsByUserId(req.user.id);

  return res.send(reservations);
});

/**
 * @method POST
 * @route /reservations
 */
router.post('/', requireBody(['bookId']), async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  const checkInDate = new Date();
  const newReservation = await createReservation(checkInDate, userId);

  await createReservationItem(newReservation.id, bookId);

  return res.status(201).send(newReservation);
});

/**
 * @method GET
 * @route /reservations/:id
 */
router.get('/:id', async (req, res) => {
  const reservation = await getReservationById(req.params.id);
  if (!reservation) return res.status(400).send('Reservation not found.');
  if (reservation.userId !== req.user.id)
    return res.status(403).send('Forbidden');

  return res.send(reservation);
});

// add multiple books to the reservation
router.post('/:id/books', requireBody(['bookId']), async (req, res) => {
  const { bookId } = req.body;
  const reservation = await getReservationById(req.params.id);
  if (!reservation) return res.status(400).send('Reservation not found.');

  if (reservation.user_id !== req.user.id)
    return res.status(403).send('Forbidden');

  const itemBook = await createReservationItem(req.params.id, bookId);

  return res.status(201).send(itemBook);
});

export default router;