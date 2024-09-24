import { useState } from 'react'


const BlogForm = ({ createNewBlog }) => {

    const [newTitle, setTitle] = useState('')
    const [newAuthor, setAuthor] = useState('')
    const [newUrl, setUrl] = useState('')

    const handleTitleChange = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle)
      }
    
      const handleAuthorChange = (event) => {
        const newAuthor = event.target.value;
        setAuthor(newAuthor)
      }
    
      const handleUrlChange = (event) => {
        const newUrl = event.target.value;
        setUrl(newUrl)
      }

    const addBlog = async (event) => {
        event.preventDefault()
    
        createNewBlog({
          title: newTitle,
          author: newAuthor,
          url: newUrl
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
      <div>
        <h1>create new</h1>

        <form onSubmit={addBlog}>
            <div>
                title:<input value={newTitle} onChange={handleTitleChange} />
            </div>
            <div>
                author:<input value={newAuthor} onChange={handleAuthorChange} />
            </div>
            <div>
                url:<input value={newUrl} onChange={handleUrlChange} />
            </div>
            <div>
                <button type="submit">create</button>
            </div>
        </form>
    </div>
  )
}

export default BlogForm