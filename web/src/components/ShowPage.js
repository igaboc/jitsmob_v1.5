import React from 'react'
import Content from './Content'
import facebookLogo from '../images/240px-Facebook_new.svg'

function ShowPage({
  screenName,
  contents,
  id
}) {

  var x
  
  for (var i = 0; i < contents['contents'].length; i = i + 1) {
    if (contents['contents'][i]._id === id) {
      x = contents['contents'][i]
    }
  }

  return (
    <div>
      <h1>{screenName}</h1>

      <Content
        title={x.title}
        category={x.category}
        bodyPart={x.bodyPart}
        youtubeURL={x.youtubeURL}
        description={x.description}
      />

      <a href="https://www.facebook.com/sharer/sharer.php?u=example.org" target="_blank">
        Share on Facebook
        <img src={ facebookLogo } alt="Share on Facebook"></img>
      </a>
    </div>
  )
}

export default ShowPage