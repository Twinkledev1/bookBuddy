import db from "#db/client";
import { createBook, getRandomBook } from "#db/queries/books";
import { createReservationItem } from "#db/queries/reservationItem";
import { createReservation } from "#db/queries/reservation";
import { createUser } from "#db/queries/users";

async function seed() {
  const booksFetch = async () => {
    const res = await fetch(
      "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books"
    );
    const bookData = res.json();
    return bookData;
  };

  // ------------------ Seed Users ------------------
  const users = await createUser("firstname", "lastname", "email", "password");

  // ------------------------seed books -----------------------

  const books = await booksFetch();
  for (const { title, author, description, coverimage, available } of books) {
    await createBook(title, author, description, coverimage, available);
  }

  // --------------------seed reservation-----------------

  const checkInDate = new Date();
  const reservation = await createReservation(checkInDate, users.id);

  for (let i = 0; i < 5; i++) {
    const randomBook = await getRandomBook();

    await createReservationItem(reservation.id, randomBook.id);
  }
}

await db.connect();
await seed();
await db.end();

console.log("🌱 Database seeded.");
