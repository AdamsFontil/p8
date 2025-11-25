import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allPersons  {
      name
      phone
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
