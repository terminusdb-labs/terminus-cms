import { ApolloClient,ApolloLink, concat, InMemoryCache, ApolloProvider, gql, HttpLink, Query } from '@apollo/client';
 

//local/branch/main
 //add an ENV var 
 //This is only a demo you must not connect in base auth from the interface it is not secure
export const createApolloClient = ()=>{

    const branchName =  localStorage.getItem("TERMINUSCMS_BRANCH")
    const user = localStorage.getItem("TerminusCMS-USER") 
    const key = localStorage.getItem("TerminusCMS-KEY")

    const basicAuth = btoa(`${user}:${key}`)

    const url = branchName ? `http://localhost:6363/api/graphql/terminuscms/lego/local/branch/${branchName}` : "http://localhost:6363/api/graphql/terminuscms/lego" 

    const httpLink = new HttpLink({ uri: url });
    const authMiddleware = new ApolloLink((operation, forward) => {
        // add the authorization to the headers
        operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: 'Basic '+ basicAuth
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

// we are using anyuser credential for connecting with the web page
// maybe we can move this in the backend and have an oper endpoint for the website
// but not for the demo
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