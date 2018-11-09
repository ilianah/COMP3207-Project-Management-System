import React from "react";
import { InputGroup, Row, Col, FormFeedback } from "reactstrap";
import { FaSearch } from "react-icons/fa";

class Searchbar extends React.Component {

  isValidInput = input => {
    return (input.length > 0 && input.length < 80) 
};

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
              valid={this.isValidInput}
              value={value}
              onChange={onChange}
            />
            <FormFeedback invalid="true">
                    Project Name must be between 1 and 80 characters
            </FormFeedback>
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
