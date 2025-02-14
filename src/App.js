import './App.css';
import { ApolloClient, InMemoryCache, useQuery, gql, ApolloProvider } from '@apollo/client';
import { styled } from 'styled-components'
import loading_semicircle from './loading-icon.svg';
import React, { useState } from "react";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Wrapper>
            <ApolloProvider client={client}>
              <PageTitle/>
              <DisplayLocations/>
            </ApolloProvider>
          </Wrapper>
        </div>
      </header>
    </div>
  );
}

export default App;

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  padding: 2em;
  border-radius: 15px;
  background:  rgb(186, 228, 252);
`;

const Wrapper = styled.section`
`;

const CountryTable = styled.table`
  overflow: hidden;
  border-radius: 15px;
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  table-layout: fixed;
`;

const TableRow = styled.tr`
  ${props =>
    props.even &&
    `
        background: rgb(219, 218, 218);
    `}
`;

const TableHeader = styled.th`
  background: rgb(219, 218, 218);
  padding: 0.5%;
  border-bottom: thin solid black;
`;

const TableItem = styled.td`
  padding: 0.125rem 0.75rem;
`;

const LoadingMessage = styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

const ErrorMessage = styled.h3`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    color: red;
`

const SearchInput = styled.input`
  width: max;
  line-height: 28px;
  border-radius: 10px;
  text-align:center;
`

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

const DisplayTableHeaders = () => (
<TableRow>
    <TableHeader>Flag</TableHeader>
    <TableHeader>Name</TableHeader>
    <TableHeader>Capital</TableHeader>
    <TableHeader>Language(s)</TableHeader>
  </TableRow>
)

const DisplayFilters = ({nameFilter, setNameFilter, capitalFilter, setCapitalFilter, languageFilter, setLanguageFilter}) => (
  <TableRow>
      <TableHeader></TableHeader>
      <TableHeader>
        <SearchInput type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Search by name"/>
      </TableHeader>
      <TableHeader>
        <SearchInput type="text" value={capitalFilter} onChange={(e) => setCapitalFilter(e.target.value)} placeholder="Search by name"/>
      </TableHeader>
      <TableHeader>
        <SearchInput type="text" value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} placeholder="Search by language"/>
      </TableHeader>
  </TableRow>
)


function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS)
  const [nameFilter, setNameFilter] = useState('')
  const [capitalFilter, setCapitalFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')

  if (loading) return LoadingPage();
  if (error) return ErrorPage(error);

  const filteredCountries = data.countries.filter(({name, capital, languages}) => {
    if (capital === null) { capital = 'N/A' };
    if (languages.length < 1 ) { languages = [ {name: 'N/A'}] };
    const matchesName = name.toLowerCase().includes(nameFilter.toLowerCase())
    const matchesCapital = capital.toLowerCase().includes(capitalFilter.toLowerCase())
    const matchesLanguage = languages.some((language) => language.name.toLowerCase().includes(languageFilter))
    return matchesName && matchesCapital && matchesLanguage
  })

  return <div>
    <CountryTable>
    <DisplayFilters nameFilter={nameFilter} setNameFilter={setNameFilter} capitalFilter={capitalFilter} setCapitalFilter={setCapitalFilter} languageFilter={languageFilter} setLanguageFilter={setLanguageFilter}/>
    <DisplayTableHeaders/>
      {filteredCountries.map(({ emoji, name, capital, languages }, index) => (
        <TableRow even={(index + 1)% 2 === 0}>
          <TableItem>{emoji}</TableItem>
          <TableItem>{name}</TableItem>
          <TableItem>{capital || 'N/A'}</TableItem>
          <TableItem>{languages.map((language) => language.name).join(', ') || 'N/A'}</TableItem>
        </TableRow>
      ))}
    </CountryTable>
  </div>
};

function LoadingPage() {
  return <LoadingMessage>
    <img src={loading_semicircle} className="Loading-icon" alt="logo" width="200" height="200"/>
    <p>Loading...</p>
  </LoadingMessage>
}

function ErrorPage(error) {
  return <ErrorMessage>Error : {error.message}</ErrorMessage>
}


function PageTitle() {
  const { loading, error } = useQuery(GET_LOCATIONS);

  if (loading || error) {
    return;
  }
  return <Title>Country Catalog</Title>
}
