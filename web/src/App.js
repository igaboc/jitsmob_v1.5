import React, { Component, Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SignInForm from './components/SignInForm'
import Dashboard from './components/Dashboard'
import MyContent from './components/MyContent'
import LandingPage from './components/LandingPage';
import PrimaryNav from './components/PrimaryNav'
import ContentLibrary from './components/ContentLibrary'
import ShowPage from './components/ShowPage'
import 'bootstrap/dist/css/bootstrap.css';
import { signIn, signOutNow } from './api/auth'
import { getDecodedToken } from './api/token'
import { listContents } from './api/contents'

class App extends Component {
  state = {
    showMenu: false,
    // error: null,
    decodedToken: getDecodedToken(), // Restore the previous signed in data
    contents: null,
    catFilter: [],
    bodyFilter: [],
  }

  //Event handlers for signing in and out
  onSignIn = ({ email, password }) => {
    signIn({ email, password })
      .then((decodedToken) => {
        this.setState({ decodedToken })
        console.log('Decoded token: ', decodedToken)
      })
      .catch((error) => {
        this.setState({ error })
      })
  }

  onSignOut = () => {
    signOutNow()
    this.setState({
      decodedToken: null,
    })
  }

  // Event handler for menu toggle
  onMenuToggle = () => {
    const showMenu = this.state.showMenu
    this.setState({ showMenu: !showMenu })
  }

  onCatFilterEvent = (filterWord) => {
    const { catFilter } = this.state
    if (!catFilter.includes(filterWord)) {
      this.setState({
      catFilter: [...catFilter, filterWord]
    })
    }
    else {
      this.setState({
        catFilter: catFilter.filter(f => f !== filterWord)
      })
    }
    console.log(this.state.catFilter)
  }
  // Event handlers for Dashboard
  onAddContent = () => {
    console.log('Add Content button clicked')
  }
  onViewEditContent = () => {
    console.log('ViewEditContent button clicked')
  }
  onEmailSubscribers = () => {
    console.log('EmailSubscribers button clicked')
  }
  onBlogArticle = () => {
    console.log('BlogArticle button clicked')
  }

  // Event handlers for Add Content Screen
  onPreview = () => {
    console.log('Preview button clicked')
  }
  onSave = () => {
    console.log('Save button clicked')
  }

  render() {
    const { showMenu, decodedToken, contents, catFilter } = this.state
    const adminSignedIn = !!decodedToken

    return (
      <div className="App">
        <PrimaryNav
          className=""
          menuClassWidth={showMenu ? 'w-100' : 'null'}
          onMenuClick={this.onMenuToggle}
        />

        <Router>
          <Switch>
            <Route path='/' exact render={() => (
              <LandingPage />
            )} />

            <Route path='/admin' render={({ match }) => (

              adminSignedIn ? (
                <Fragment>
                  <Dashboard
                    url={match.url}
                    screenName={'Dashboard'}
                    subscriberCount={'0'}
                    onSignOut={this.onSignOut}
                    onAddContent={this.onAddContent}
                    onViewEditContent={this.onViewEditContent}
                    onEmailSubscribers={this.onEmailSubscribers}
                    onBlogArticle={this.onBlogArticle}
                  />

                </Fragment>
              ) : (
                  <SignInForm
                    onSignIn={this.onSignIn}
                    admin={true}
                  />
                )

            )} />

            <Route path='/signin' exact render={() => (
              <SignInForm
                screenName={'Admin Sign In'}
                onSignIn={this.onSignIn}
              />
            )} />

            <Route path='/exercises' exact render={() => (
              <Fragment>
                {contents &&
                  <MyContent
                    screenName={'My Content'}
                    contents={contents}
                  />
                }
              </Fragment>
            )} />

            <Route path='/contentlibrary' exact render={() => (
              <Fragment>
                {contents &&
                  <ContentLibrary
                    screenName={'Content Library'}
                    contents={contents["contents"]}
                    catFilter={catFilter}
                    catFilterToApp={ (word) => {
                      this.onCatFilterEvent(word)
                    }}
                  />
                }
              </Fragment>
            )} />

            <Route path='/showpage/:id' render={({ match }) => (
              <Fragment>
                {contents &&
                  <ShowPage
                    screenName={'Show Page'}
                    contents={contents}
                    id={match.params.id}
                  />
                }
              </Fragment>
            )} />

          </Switch>
        </Router>
      </div>
    );
  }

  load() {
    const saveError = (error) => {
      this.setState({ error })
    }
    //Load for everyone
    listContents()
      .then((contents) => {
        this.setState({ contents })
      })
      .catch(saveError)
  }

  // When this App first appears on screen
  componentDidMount() {
    this.load()
  }

  // When state changes
  componentDidUpdate(prevProps, prevState) {
    // If just signed in, signed up, or signed out,
    // then the token will have changed
    if (this.state.decodedToken !== prevState.decodedToken) {
      this.load()
    }
  }
}

export default App;
