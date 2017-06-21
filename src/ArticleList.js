import React, { Component } from 'react';
class ArticleList extends Component {
  constructor(){
    super();
    this.createList = this.createList.bind(this);
  }
  createList(articleBlock){
    return (
      <div className="article-block-container" key={`article-${articleBlock.Id}`}>
        <div className="article-block">
          <div className="article-title">
            {articleBlock.Title}
          </div>
          <div className="article-author">
            by {articleBlock.Name}
          </div>
          <div 
            dangerouslySetInnerHTML={{ __html:articleBlock.Article}}
            className="article-main">
          </div>
          <div className="article-time">
            {articleBlock.Time}
          </div>
        </div>
      </div>
    )
  }

  render() {
    let listArr = this.props.articles;
    var listArrRender = listArr.map(this.createList);
    return (
        <div className="article-list">
          {listArrRender}
        </div>
    );
  }
}

export default ArticleList;