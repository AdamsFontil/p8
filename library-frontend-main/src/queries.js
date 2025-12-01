import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query AllBooks($author: String, $genre: String) {
allBooks(author: $author, genre: $genre) {
    title
    published
    author {
      name
      id
      born
      bookCount
    }
    genres
    id
  }
}
`


export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    id
    born
    bookCount
  }
}
`

export const NEW_BOOK = gql`
mutation Mutation($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(title: $title, published: $published, author: $author, genres: $genres) {
    title
    published
    author
    id
    genres
  }
}

`


export const UPDATE_BIRTHYEAR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    id
    born
    bookCount
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
