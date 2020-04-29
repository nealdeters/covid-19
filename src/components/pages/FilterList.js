import React, { Fragment } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

const FilterList = ({ filtered, filterPlaceholder, handleChange, handleClick}) => {
  return (
    <Fragment>
      <div className="country">
        <input 
          className="search form-control"
          type="text" 
          placeholder={filterPlaceholder}
          onChange={handleChange}
        />
        
        { filtered === null ? (
          <Spinner className="general-spinner" animation="border" role="status" variant="dark" >
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <ListGroup variant="flush" className="list">
            {filtered.map((item) =>
              <ListGroup.Item 
                key={item.key}
                data-current={item.key}
                className="list-item"
                onClick={handleClick}>
                {item.label}
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </div>
    </Fragment>
  );
}

export default FilterList;