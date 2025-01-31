import './App.css';
import { ApolloClient, InMemoryCache, useQuery, gql, ApolloProvider } from '@apollo/client';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h2>Country Catalog</h2>
          <br/>
          <ApolloProvider client={client}>
            <DisplayLocations />
          </ApolloProvider>,
        </div>
      </header>
    </div>
  );
}

export default App;

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});

const GET_LOCATIONS = gql`
  query {
    countries {
      emoji
      name
      capital
      languages {
        name
      }
    }
  }
`;

function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.countries.map(({ emoji, name, capital, languages }) => (
    <div>
      <p>{emoji} {name}, capital: {capital}, languages: {languages.map((language) => language.name).join(', ')}</p>
    </div>
  ));
}
