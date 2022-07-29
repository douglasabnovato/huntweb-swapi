import React, { Component } from "react";
import api from "../../services/api";
import "./styles.css";

export default class Product extends Component {
  state = {
    product: {},
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const response = await api.get(`/people/${id}`);
    this.setState({ product: response.data });
  }

  render() {
    const { product } = this.state;

    return (
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.homeworld}</p>
        <p>
          URL:<a href="{product.url}">{product.url}</a>
        </p>
      </div>
    );
  }
}
