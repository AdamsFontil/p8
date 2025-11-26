const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')


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
      addBook: async (root, args) => {
        const authorExist = await Author.findOne({ name: args.author })
        if (authorExist === null) {
          const newAuthor = new Author({ name: args.author, born: null })
          await newAuthor.save()
          const newBook = new Book({ ...args, author: newAuthor.id })
          const savedBook = await newBook.save()
          return savedBook.populate("author")
        }
        const newBook = new Book({ ...args, author: authorExist.id })
        const savedBook = await newBook.save()
        return savedBook.populate("author")
      },
      editAuthor: async (root, args) => {
        const authorExist = await Author.findOne({ name: args.name })
        if (authorExist === null) return null
        authorExist.born = args.setBornTo
        const updatedAuthor = await authorExist.save()
        return updatedAuthor
      }
  },

  Author: {
      bookCount: async (root) => {
      const match = await Book.find({ author: root._id})
      console.log('what is root', root);
      console.log('root name', root.name);
      // const match = books.filter(book => book.author === root.name).length
      console.log('match', match);
      return match.length

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
