import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }
  const books = result.data.allBooks;
  console.log("what is books", books);
  console.log("result from books comp", result);
  const uniqueGenres = [...new Set(books.flatMap((book) => book.genres))];
  console.log("unique genre are", uniqueGenres);

  const filteredBooks =
    selectedGenre && selectedGenre !== "all"
      ? books.filter((book) => book.genres.includes(selectedGenre))
      : books;

  return (
    <div>
      <h2>books</h2>
      selected genre is currently --- {selectedGenre}
      <h4>pick your genre</h4>
      <div>
        {uniqueGenres.map((target) => (
          <button onClick={() => setSelectedGenre(target)} key={target}>
            {target}
          </button>
        ))}
        <button onClick={() => setSelectedGenre("all")}>all genres</button>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
``;
