import db from '#db/client';

/**
 * @method GET
 * @route /reservations
 */
export const getReservations = async () => {
  const sql = `
    SELECT
      *
    FROM
      reservations
  `;
  const { rows } = await db.query(sql);

  return rows;
};

/**
 * @param {number} id
 * @method GET
 * @route /reservations/:id
 */
export const getReservationById = async (id) => {
  const sql = `
    SELECT
      *
    FROM
      reservations
    WHERE
      id = $1
  `;
  const { rows } = await db.query(sql, [id]);

  return rows[0];
};

export const getReservationsByUserId = async (userId) => {
  const sql = `
    SELECT
      *
    FROM
      reservations
    WHERE
      user_id = $1
  `;
  const { rows } = await db.query(sql, [userId]);

  return rows;
};

/**
 * Seeding function.
 * @param {Date} checkInDate
 * @param {number} userId
 * @method POST
 */
export const createReservation = async (checkInDate, userId) => {
  const sql = `
    INSERT INTO
      reservations (check_in, user_id)
    VALUES
      ($1, $2)
    RETURNING
      *
  `;
  const { rows } = await db.query(sql, [checkInDate, userId]);

  return rows[0];
};