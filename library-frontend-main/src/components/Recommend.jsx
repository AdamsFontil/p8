import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

// eslint-disable-next-line react/prop-types
const Recommend = ({ show }) => {
  console.log("what is show anyway", show);
  const favoriteGenre = "patterns";

  const result = useQuery(ALL_BOOKS);

  // eslint-disable-next-line react/prop-types
  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }
  const books = result.data.allBooks;

  const filteredBooks = favoriteGenre
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : books;

  console.log("filtred books", filteredBooks);

  return (
    <div>
      <h2>Recommendations</h2>

      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
