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
      addBook: async (root, args) => {
        const authorList = await Author.find({})
        console.log('list of authors', authorList);
        const authorExist = await Author.findOne({ name: args.author })
        console.log('does author exist',authorExist);
        if (authorExist === null) {
          console.log('what are args received --- ', args);
          const newAuthor = new Author({ name: args.author, born: null })
          console.log('new author detected adding this new author', newAuthor);
          await newAuthor.save()
          const newBook = new Book({ ...args, author: newAuthor.id })
          console.log('what newBook created for new Author', newBook);
        const savedBook = await newBook.save()
        return savedBook.populate("author")
        }

        console.log('who is author', args.author);
        console.log('does author exist', authorExist);
        const newBook = new Book({ ...args, author: authorExist.id })
        console.log('newBook', newBook);
        const savedBook = await newBook.save()
        return savedBook.populate("author")
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
// Mutation: {
//   addPerson: async (root, args) => {
//       const person = new Person({ ...args })


//       try {
//         await person.save()
//       } catch (error) {
//         throw new GraphQLError('Saving person failed', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.name,
//             error
//           }
//         })
//       }

//       return person
//   },
//     editNumber: async (root, args) => {
//       const person = await Person.findOne({ name: args.name })
//       person.phone = args.phone


//       try {
//         await person.save()
//       } catch (error) {
//         throw new GraphQLError('Saving number failed', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.name,
//             error
//           }
//         })
//       }

//       return person
//     }
// }




const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
