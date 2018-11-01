import React from "react";
import {Button, FormGroup } from "reactstrap";
import { FaSearch } from "react-icons/fa";

class Searchbar extends React.Component {
  render() {
    const value = this.props.value;
    const onChange = this.props.onChange;

    return (
      <div className="searchbar">
        <FormGroup className="mt-3" row>
          <input
            className="form-control"
            type="search"
            placeholder= " Search"
            id="search-input"
            value={value}
            onChange={onChange}
          />
        </FormGroup>
        <Button className="ml-1" color="link" disabled size="lg"> <FaSearch/></Button>
      </div>
    );
  }
}

export default Searchbar;
