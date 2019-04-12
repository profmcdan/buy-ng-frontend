import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { ALL_ITEMS_QUERY } from "./Items";
const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  updateCache = async (cache, payload) => {
    //   read the items from the cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // filter the deleted item out of the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id,
    );
    // put trhe items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.itemId }}
        update={this.updateCache}
      >
        {(deleteItem, { error }) => {
          //   if (error) return <p>Error ...</p>;
          return (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this item?")) {
                  deleteItem();
                }
              }}
            >
              {this.props.children}
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default DeleteItem;
// export { DELETE_ITEM_MUTATION };
