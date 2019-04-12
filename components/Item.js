import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import ItemStyles from "./styles/ItemStyles";
import Title from "./styles/Title";
import PriceTag from "./styles/PriceTag";
import formatMoney from "../lib/formatMoney";
import DeleteItem from "./DeleteItem";

export default class Item extends Component {
  static propTypes = {
    prop: PropTypes.shape({
      item: PropTypes.object.isRequired,
    }),
  };

  render() {
    const { item } = this.props;
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link
            href={{
              pathname: "/item",
              query: { id: item.id },
            }}
          >
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>
        <div className="buttonList">
          <Link
            href={{
              pathname: "/update",
              query: { id: item.id },
            }}
          >
            <a>Edit ✏️</a>
          </Link>
          <button>Add to Cart</button>
          <DeleteItem itemId={item.id}>Delete</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}
