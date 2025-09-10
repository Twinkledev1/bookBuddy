import db from "#db/client";
import bcrypt from "bcrypt";

/**
 * @method POST
//  * @route /users
 */
export const createUser = async (firstName, lastName, email, password) => {
  const sql = `
    INSERT INTO
    users (first_name, last_name, email, password)
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(sql, [
    firstName,
    lastName,
    email,
    hashedPassword,
  ]);

  return rows[0];
};

/**
 * @method GET
 * @route /users/:id
 * @param {number} password
 */
export const getUserById = async (id) => {
  const sql = `
    SELECT
      *
    FROM
      users
    WHERE
      id = $1
  `;
  const { rows } = await db.query(sql, [id]);

  return rows[0];
};

/**
 * @method GET
 * @param {string} email
 * @param {string} password
 * @returns
 */
// export const getUserByCredentials = async (email, password) => {
//   const sql = `
//     SELECT
//       *
//     FROM
//       users
//     WHERE
//       email = $1
//   `;
//   const { rows } = await db.query(sql, [email]);
//   const user = rows[0];
//   if (!user) return;

//   // const isValid = await bcrypt.compare(password, user.password);
//   // if (!isValid) return null;
//   return user;
// };
