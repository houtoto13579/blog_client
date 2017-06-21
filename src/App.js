import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Draft, EditorState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import {stateToHTML} from 'draft-js-export-html';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import ArticleList from './ArticleList.js';
class App extends Component {
  constructor(){
    super();
    this.state={
      editorState: EditorState.createEmpty(),
      title:'',
      author:'Anonymous',
      draftHTML:'',
      articles:[],
    }
    this.onEditorStateChange=this.onEditorStateChange.bind(this);
    this.onTitleChange=this.onTitleChange.bind(this);
    this.onAuthorChange=this.onAuthorChange.bind(this);
    this.updateHTML=this.updateHTML.bind(this);

    //this.serverurl = "http://127.0.0.1:3001/";
    this.serverurl = "https://server-slxijtelnu.now.sh/";
    //this.serverurl = "https://fierce-wildwood-17550.herokuapp.com/";
  }
  onEditorStateChange(editorState){
    this.setState({editorState,}, this.updateHTML);
  }
  onTitleChange(e){
    this.setState({title:e.target.value});
  }
  onAuthorChange(e){
    this.setState({author:e.target.value});
  }
  onPostButtonClick(){
    let htmlv = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    let name = this.state.author;
    let title = this.state.title;
    let time = new Date().toString();
    fetch(`${this.serverurl}new`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        title: title,
        article: htmlv,
        time: time,
      }),
    });
  }
  componentDidMount(){
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
    fetch(`${this.serverurl}blogs/`)
      .then(checkStatus)
      .then(response=>response.json())
      .then(resObj=>{
        let articles = resObj;
        this.setState({
          articles,
        })
      })
      .catch(error=>{
        console.log('get count fail...')
        console.log(error);
      })
  }
  updateHTML(){
    console.log(this.state.editorState.getCurrentContent());
    var v = convertToRaw(this.state.editorState.getCurrentContent());
    let htmlv = draftToHtml(v);
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="title">Simple Blog</h1>
          <h5 className="subtitle">You See What You Get (maybe)</h5>
        </div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" 
              render={(props)=>(
                <div>
                  <Link to="/new">
                    <button className="new-button">New</button>
                  </Link>
                  <ArticleList articles={this.state.articles}>

                  </ArticleList>
                </div>
              )}/>
            <Route exact path="/new"
              render={(props)=>(
                <div>
                  <Link to="/">
                    <button className="back-button">Back</button>
                  </Link>
                  <div className="editor-area">
                    <h5>Title:</h5>
                    <input 
                      className="title-input"
                      onChange={this.onTitleChange} 
                      value={this.state.title}
                    ></input>
                    <Editor
                      editorState={this.state.editorState}
                      wrapperClassName="editor-wrapper"
                      onEditorStateChange={this.onEditorStateChange.bind(this)}
                    />
                    <h5>Author:</h5>
                    <input 
                      className="author-input"
                      onChange={this.onAuthorChange.bind(this)} 
                      value={this.state.author}
                    ></input>
                    
                  </div>
                  <div>
                    <Link to="/">
                      <button 
                        className="post-button" 
                        onClick={this.onPostButtonClick.bind(this)}
                      >Post Article</button>
                    </Link>
                  </div>
                </div>
              )}
            />
          </Switch>
        </BrowserRouter>
        
        
        {/*<div dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}}/>>*/}

      </div>
    );
  }
}

export default App;
