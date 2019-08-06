const { ApolloServer, gql } = require("apollo-server");
const lodash = require("lodash");
const uuid = require("node-uuid");

let todos = [
    // {
    //     id: uuid.v4(),
    //     todoDescription: "First todo"
    // },
    // {
    //     id: uuid.v4(),
    //     todoDescription: "Second todo"
    // }
];

var users = [
  {
    id: 1,
    name: "John_Snow"
  },
  {
    id: 2,
    name: "Perter_Parker"
  },
  {
    id: 3,
    name: "Tony_Stark"
  }
];

const typeDefs = gql`
  type Query {
    users: [User]
    todos: [Todos]
    user(id: Int): User
    todo(id: String): Todos
  }

  type User {
    id: Int
    name: String
    todos: [Todos]
  }

  type Todos {
    id: String
    todoDescription: String
    flag: Boolean
    user: User
  }

  type Mutation {
      addTodo(
        todoDescription: String!
        userId: Int!
      ): Todos
      removeTodo(id: String!): [Todos]
      editTodo(
        id: String!
        todoDescription: String!
        flag: Boolean!
      ): Todos
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    users: () => users
  },
  User: {
    todos: parentValue => {
      return todos.filter(e => e.userId === parentValue.id);
    }
  },
  Todos: {
    user: parentValue => {
      return users.filter(e => e.id === parentValue.userId)[0];
    }
  },


  Mutation: {
      addTodo: async (_, args) => {
          const newTodo = {
              id: uuid.v4(),
              todoDescription: args.todoDescription,
              flag: false,
              userId: args.userId
          };
          await todos.push(newTodo);
          return newTodo;
      },
      removeTodo: (_, args) => {
        return lodash.remove(todos, e => e.id === args.id);
      },
      editTodo: async (_, args) => {
        let newTodo;
        todos = todos.map(e => {
          if(e.id === args.id){
            if(args.todoDescription){
              e.todoDescription = args.todoDescription
            }
            e.flag = args.flag;
            newTodo = e;
            return e;
          }
          return e;
        });
        return newTodo;
      }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});