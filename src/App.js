import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);


function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories(result){
    this.setState({result});
  }

  fetchSearchTopstories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result))
    .catch(e => e);
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result, hits: updatedHits}
    });
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }


  render() {

    const {searchTerm, result} = this.state;
    return (
      <div className="page">

        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>

        { result
          ? <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
          : null
        }

        
      </div>
    );
  }
}

const Search = ({value, onChange, children}) => {
    return(
      <form>
        {children}
        <input 
          type="text"
          value = {value}
          onChange={onChange}
        />
      </form>
    );
}


class Table extends Component {
  render(){
    const {list, pattern, onDismiss} = this.props;

    const largeColumn = {width: '40%'};
    const midColumn = {width: '30%'};
    const smallColumn = {width: '10%'};

    return(
      <div className="table">
        { 
          list.filter(isSearched(pattern)).map(item=>
            <div key={item.objectID} className="table-row">
              <span style={{largeColumn}}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{midColumn}}>{item.author}</span>
              <span style={{smallColumn}}>{item.num_comments}</span>
              <span style={{smallColumn}}>{item.points}</span>
              <span style={{smallColumn}}>
                <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
                  Dismiss
                </Button>
              </span>
            </div>
          )
        }        

      </div>


    );



  }
}

class Button extends Component {
  render(){
    const{ onClick, className='', children,} = this.props;
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}

export default App;
