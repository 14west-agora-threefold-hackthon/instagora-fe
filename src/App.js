import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { createGlobalStyle } from 'styled-components'
import {SpinningIcon} from './components/styled/icons'

import ViewArticle from './components/pages/ViewArticle.js'

createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 20px;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  a {
    color: palevioletred;
    &:hover {
      color: mediumvioletred;
    }
  }
`

function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setArticles([])
    setError(null)

    const lookupValue = async () => {
      try {
        const response = await fetch(`//localhost:3000/articles`)

        if (!response.ok) {
          setError(response.statusText)
          setLoading(false)
          return;
        }
  
        const articlesJson = await response.json()
        setArticles(articlesJson.articles)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
        return;
      }
    }
    lookupValue()
  }, [])

  let displayed
  if (loading) {
    displayed = <SpinningIcon />
  } else {
    if (error) {
      displayed = <h2>there was an error! {error}</h2>
    } else {
      displayed = articles.map(article => (
        <React.Fragment key={article.id}>
          { article.headerImage ? <img src={article.headerImage} alt="header"></img> : false }
          <h3><Link to={`/article/${article.id}`}>{article.title}</Link></h3>
        </React.Fragment>
      ))
    }
  }

  return (
    <>
      <h1>This is the home page</h1>
      {displayed}
    </>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
  
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/article/:id"><ViewArticle /></Route>
            <Route path="/"><Home /></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
