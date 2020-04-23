import React from 'react';
import { Link } from 'react-router-dom'
import {Container, Row, Col, ListGroup, Image} from 'react-bootstrap';
import Request from './Request';
import UtilityService from './UtilityService';
import './News.scss';

const API_KEY = `${process.env.REACT_APP_NEWS_API_KEY}`;

const NewsService = {
  request: (type, query) => {
    const date = UtilityService.getYesterday();
    let url = `http://newsapi.org/v2/everything?q=top-covid-19-news&sortBy=popularity&apiKey=${API_KEY}`;
    const method = "GET";
    return Request(url, method).then(response => {
      return response.json();
    });
  }
}

// powered by NewsApi.org link

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    }
  }

  componentDidMount() {
    NewsService.request().then(response => {
      let articles = response.articles;
      this.setState({articles: articles});
    })
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid className="news">
          <Row>
            <Col md="12">
              <ListGroup variant="flush" className="list">
                {this.state.articles.map((article) =>
                  <ListGroup.Item>
                    <Image 
                      src={article.urlToImage}
                      rounded
                      className="news-image" />
                    <span className="news-content">
                      <a 
                      href={article.url} 
                      target="_blank">
                        {article.title}</a>
                      <p>{article.description}</p>
                    </span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <a 
                    href="https://newsapi.org"
                    target="_blank">
                    Powered by NewsApi
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default News;