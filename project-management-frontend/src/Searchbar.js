import React from "react";
import { Button, InputGroup, Row, Col } from "reactstrap";
import { FaSearch } from "react-icons/fa";

class Searchbar extends React.Component {
  render() {
    const value = this.props.value;
    const onChange = this.props.onChange;

    return (
      <Row>
        <Col md={{ size: 4, offset: 4 }} sm="12">
          <InputGroup className="mt-3">
            <input
              className="form-control"
              type="search"
              placeholder="Search by name"
              id="search-input"
              value={value}
              onChange={onChange}
            />
            <div class="input-group-append">
              <span class="input-group-text">
                <FaSearch />
              </span>
            </div>
          </InputGroup>
        </Col>
      </Row>
    );
  }
}

export default Searchbar;
