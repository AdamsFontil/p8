const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
    type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!
  }

    type Mutation {
      editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
    }
`

// const resolvers2 = {
//   Query: {
//     personCount: async () => Person.collection.countDocuments(),
//     allPersons: async (root, args) => {
//       // filters missing
//       return Person.find({})
//     },
//     findPerson: async (root, args) => Person.findOne({ name: args.name }),
//   },
//   Person: {
//     address: (root) => {
//       return {
//         street: root.street,
//         city: root.city,
//       }
//     },
//   },
//   Mutation: {
//     addPerson: async (root, args) => {
//       const person = new Person({ ...args })
//       return person.save()
//     },
//     editNumber: async (root, args) => {
//       const person = await Person.findOne({ name: args.name })
//       person.phone = args.phone
//       return person.save()
//     },
//   },
// }



const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => { return Author.find({})},
allBooks: async (root, args) => {
  console.log('args given', args);
  const filter = {};

  if (args.author) {
    const author = await Author.findOne({ name: args.author });
    if (!author) return [];
    filter.author = author._id;
  }

  if (args.genre) {
    filter.genres = args.genre;
  }

  return Book.find(filter).populate("author");
}
  },
    Mutation: {
      addBook: (root, args) => {
        console.log('what are args', args);
        const authorExist = authors.some(author => author.name === args.author)
        if (!authorExist) {
          const newAuthor = { name: args.author, id: uuid() }
          console.log('new author detected adding this new author', newAuthor);
          authors = authors.concat(newAuthor)
        }
        console.log('who is author', args.author);
        console.log('does author exist', authorExist);
        const newBook = { ...args, id: uuid() }
        console.log('newBook', newBook);
        console.log('authors list should change', authors);
        books = books.concat(newBook)
        return newBook
      },
      editAuthor: (root, args) => {
        const author = authors.find(a => a.name === args.name)
        if (!author) return null
        const updatedAuthor = { ...author, born: args.setBornTo }
        authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
        console.log('returned this---', updatedAuthor);
        return updatedAuthor
      }
  },

  Author: {
      bookCount: (root) => {
        const match = books.filter(book => book.author === root.name).length
        return match

    }
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   {
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// /*
//  * Suomi:
//  * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
//  * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
//  *
//  * English:
//  * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
//  * However, for simplicity, we will store the author's name in connection with the book
//  *
//  * Spanish:
//  * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
//  * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
// */

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

// /*
//   you can remove the placeholder query once your first one has been implemented
// */
