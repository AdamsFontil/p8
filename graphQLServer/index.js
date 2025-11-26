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
    allBooks: (root, args) => {
      console.log('args are', args);

      let filteredBooks = Book;

      if (args.author) {
        console.log('filtering by author:', args.author);
        filteredBooks = filteredBooks.filter(book => book.author === args.author);
      }

      if (args.genre) {
        console.log('filtering by genre:', args.genre);
        filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
      }

      console.log('final matches:', filteredBooks);
      return filteredBooks;
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
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
