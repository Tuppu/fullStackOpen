import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from "./components/Notify"
import LoginForm from "./components/LoginForm"
import Recommend from "./components/BookRecommendations"
import { useQuery, useApolloClient } from "@apollo/client"
import { ALL_AUTHORS, ALL_BOOKS, ME } from "./queries"

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const hideWhenLogin = { display: token ? "none" : "" }
  const showWhenLogin = { display: token ? "" : "none" }

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME)

  if (token && page === "login") {
    setPage("authors")
  }

  if (resultAuthors.loading || resultBooks.loading || meResult.loading) {
    return <div>loading...</div>
  }

  const favoriteBooks = resultBooks.data.allBooks.filter((book) => {
    const favoriteGenre = meResult.data.me.favoriteGenre
    const found = book.genres.includes(favoriteGenre)
    if (found) return book
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button style={showWhenLogin} onClick={() => setPage("add")}>
          add book
        </button>
        <button style={showWhenLogin} onClick={() => setPage("recommend")}>
          recommend
        </button>
        <button style={hideWhenLogin} onClick={() => setPage("login")}>
          Login
        </button>
        <button style={showWhenLogin} onClick={logout}>
          logout
        </button>
      </div>

      <Authors show={page === "authors"} allAuthors={resultAuthors.data.allAuthors} setError={notify} />

      <Books show={page === "books"} allBooks={resultBooks.data.allBooks} />

      <NewBook show={page === "add" && token} setError={notify} />

      <Recommend show={page === "recommend" && token} favoriteBooks={favoriteBooks} favoriteGenre={meResult.data.me.favoriteGenre} />

      <LoginForm show={page === "login"} setToken={setToken} setError={notify} />
    </div>
  )
}

export default App