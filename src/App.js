import './App.css';
import { ApolloClient, InMemoryCache, useQuery, gql, ApolloProvider } from '@apollo/client';
import { styled } from 'styled-components'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
        <Wrapper>
          <Title>
            Country Catalog
          </Title>
        </Wrapper>
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

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color:rgb(255, 255, 255);
`;

const CountryList = styled.ul`
  text-align: left;
  border-radius: 25px;
  border: 2px solid rgb(255, 255, 255);
  padding: 20px;
  margin: 0px;
`

const Wrapper = styled.section`
  padding: 2em;
  border-radius: 25px;
  border: 2px solid rgb(255, 255, 255);
`;

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
      <CountryList>{emoji} {name}, capital: {capital}, languages: {languages.map((language) => language.name).join(', ')}</CountryList>
    </div>
  ));
}
