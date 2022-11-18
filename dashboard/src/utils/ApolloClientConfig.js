import { ApolloClient,ApolloLink, concat, InMemoryCache, ApolloProvider, gql, HttpLink, Query } from '@apollo/client';

 //add an ENV var 
export const createApolloClient = ()=>{
    const httpLink = new HttpLink({ uri: "http://localhost:6363/api/graphql/terminuscms/lego" });
    const authMiddleware = new ApolloLink((operation, forward) => {
        // add the authorization to the headers
        operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: "Basic Y29sbGFib3JhdG9yOmRlbW9fcGFzc3dvcmQ="
        }
        }));
        return forward(operation);
    })
    
    const cache = new InMemoryCache({
        addTypename: false
       /* typePolicies: {
            Query: {
              fields: {
                Part: {
                  ...offsetLimitPagination(),
                  read(existing, { args }) {
                    // Implement here
                  }
                }
              },
            },
          }*/
    });

    //offsetLimitPagination
    
    const value = concat(authMiddleware, httpLink)

    return new ApolloClient({
        cache:cache,
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
          query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
        },
        link: value,       
    });
}