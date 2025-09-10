import db from "#db/client";

/**
 * @method GET
 * @route /books
 * @returns All books.
 */
export const getBooks = async () => {
  const sql = `SELECT * FROM books`;
  const { rows } = await db.query(sql);
  return rows;
};

/**
 * @param {number} id
 * @method GET
 * @route /books/:id
 * @returns A single book with the given ID.
 */
export const getBookById = async (id) => {
  const sql = `
    SELECT
      *
    FROM
      books
    WHERE
      id = $1
  `;
  const { rows } = await db.query(sql, [id]);

  return rows[0];
};

/**
 * :)
 * @returns A random book.
 */
export const getRandomBook = async () => {
  const sql = `
    SELECT
      *
    FROM
      books
    ORDER BY
      RANDOM()
    LIMIT
      1
  `;
  const { rows } = await db.query(sql);

  return rows[0];
};

/**
 * Seeding function.
 * @param {string} title
 * @param {string} author
 * @param {string} description
 * @param {string} coverImage
 * @method POST
 * @returns The newly-created book.
 */
export const createBook = async (title, author, description, coverImage) => {
  const sql = `
    INSERT INTO
      books (title, author, description, cover_image)
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      *
  `;
  const { rows } = await db.query(sql, [
    title,
    author,
    description,
    coverImage,
  ]);

  return rows[0];
};
