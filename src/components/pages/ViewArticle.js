import React, { useState, useEffect } from 'react';

import {
  useParams
} from "react-router-dom";
import { EditorState, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import {SpinningIcon} from '../styled/icons'

function Article({article}) {
  return <>
    <h1>{article.title}</h1>
    { article.headerImage ? <img src={article.headerImage} alt="header"></img> : false}
    <Editor
      editorState={article.content}
      readOnly
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      toolbarStyle={{display: 'none'}}
    />
  </>
}

export default function ViewArticle() {
  const { id } = useParams()
  const [article, setArticle] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setArticle({})
    setError(null)

    const lookupValue = async () => {
      try {
        const response = await fetch(`//localhost:3000/articles/${id}`)

        if (!response.ok) {
          setError(response.statusText)
          setLoading(false)
          return;
        }
  
        const articleJson = await response.json()
        articleJson.content = articleJson.content ? EditorState.createWithContent(convertFromRaw(articleJson.content)) : EditorState.createEmpty()
        setArticle(articleJson)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
        return;
      }
    }
    lookupValue()
  }, [id])

  let displayed
  if (loading) {
    displayed = <SpinningIcon />
  } else {
    if (error) {
      displayed = <h2>there was an error! {error}</h2>
    } else {
      displayed = <Article article={article} />
    }
  }

  return displayed
}