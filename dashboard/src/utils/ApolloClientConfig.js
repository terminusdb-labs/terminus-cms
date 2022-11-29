import { ApolloClient,ApolloLink, concat, InMemoryCache, ApolloProvider, gql, HttpLink, Query } from '@apollo/client';
 

//local/branch/main
 //add an ENV var 
export const createApolloClient = ()=>{

    const branchName =  localStorage.getItem("TERMINUSCMS_BRANCH")

    const url = branchName ? `http://localhost:6363/api/graphql/terminuscms/lego/local/branch/${branchName}` : "http://localhost:6363/api/graphql/terminuscms/lego" 

    const httpLink = new HttpLink({ uri: url });
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

export const createApolloClientWeb = ()=>{
  
  const httpLink = new HttpLink({ uri: "http://localhost:6363/api/graphql/terminuscms/lego" });
  const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext(({ headers = {} }) => ({
      headers: {
          ...headers,
          authorization: "Basic YW55VXNlcjpkZW1vX3Bhc3N3b3Jk"
      }
      }));
      return forward(operation);
  })
  
  const cache = new InMemoryCache({
      addTypename: false
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