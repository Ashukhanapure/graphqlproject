const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema } = require('graphql')
 
const seedData = [
    {id: 1, language: 'python', loved:true},
    {id: 2, language: 'JavaScript', loved:true},
    {id: 3, language: 'Scala', loved:true}
]
//Schema
//resolver

const languageType = new GraphQLObjectType({
    name: 'Language',
    description: 'ProgrammingLanguage',
    fields: {
        id: {
            type: GraphQLInt
        },
        language: {
            type: GraphQLString
        },
        loved: {
            type: GraphQLBoolean
        }
    }
})

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'This is the rootQuery',
    fields: {
      languages: {
        type: GraphQLList(languageType),
        resolve: () => seedData
      },
      language: {
        type: languageType,
        args: {
            id: {type:GraphQLInt}
        },
        resolve: (_,{id}) => seedData.find(language => language.id == id )
      } 
    }
})

const rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'This is the rootmutation',
    fields: {
      language: {
        type: languageType,
        args:{
        lang: {type: GraphQLString},
        loved: {type: GraphQLBoolean}
      },
        resolve: (_,{lang, loved}) => {
            const newLanguage = {id: seedData.length + 1, language:lang, loved:loved}
            seedData.push(newLanguage)
            return newLanguage
        }
      } 
    }
})
const schema = new GraphQLSchema({query:rootQuery, mutation:rootMutation})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}) )

const PORT = 3001

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})