const { ApolloServer, gql } = require("apollo-server");
const lodash = require("lodash");
const uuid = require("node-uuid");

let quotes = [
    { id: "454dccf0-9ebc-457b-b9d1-313255a7ddea", quote: "When Chuck Norris was born he drove his mom home from the hospital." },
    { id: "ac2b5539-b036-4aeb-9e62-ace5a95942ab", quote: "Chuck Norris has a diary. It's called the Guinness Book of World Records." },
    { id: "ab648889-f53a-4fdd-9e22-511bcfe45dcc", quote: "Chuck Norris threw a grenade and killed 50 people, then it exploded." },
    { id: "a6cf34b9-c317-450b-bfc0-346599df21a1", quote: "Chuck Norris counted to infinity. Twice." },
    { id: "5a1c7249-c3f4-4321-8b44-4f49707a1c9c", quote: "Chuck Norris beat the sun in a staring contest." }
];

const typeDefs = gql`
    type Query{
        quotes: [Quotes]
        quote(id: String): Quotes
    }

    type Quotes {
        id: String
        quote: String
    }

    type Mutation {
        addQuote(
            quote: String!
        ): Quotes
        removeQuote(id: String!): [Quotes]
        editQuote(
            id: String!
            quote: String!
        ): Quotes
    }
`;

const resolvers = {
    Query: {
        quotes: () => quotes
    },

    Mutation: {
        addQuote: async (_, args) => {
            const newQuote = {
                id: uuid.v4(),
                quote: args.quote
            };
            await quotes.push(newQuote);
            return newQuote;
        },
        removeQuote: (_, args) => {
            return lodash.remove(quotes, e => e.id === args.id);
        },
        editQuote: async (_, args) => {
            let newQuote;
            quotes = quotes.map(e => {
                if(e.id === args.id) {
                    if(args.quote) {
                        e.quote = args.quote;
                    }
                    newQuote = e;
                    return e;
                }
                return e;
            });
            return newQuote;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});