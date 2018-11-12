import React from "react";
import { InputGroup, Row, Col } from "reactstrap";
import { FaSearch } from "react-icons/fa";

/**
 * Search bar that will perform filtering on the frontend
 */
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
              placeholder={this.props.placeholder}
              id="search-input"
              value={value}
              onChange={onChange}
            />
            <div className="input-group-append">
              <span className="input-group-text">
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
