import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import formatMoney from "../lib/formatMoney";
import updateCache from "../lib/updateCache";
import { ALL_ITEMS_QUERY } from "./Items";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
      title
    }
  }
`;

class CreateItem extends Component {
  state = {
    file: "",
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0,
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseInt(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    console.log("Uploading file...");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "buyng_app");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dm9ykdajq/image/upload",
      {
        method: "POST",
        body: data,
      },
    );
    const file = await res.json();
    await this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
    console.log(file);
  };

  render() {
    const { title, description, price, file, image } = this.state;
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}
        update={updateCache}
        // refetchQueries={ALL_ITEMS_QUERY}
      >
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id },
              });
            }}
          >
            <Error error={error} />

            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">Title</label>
              <input
                type="file"
                name="file"
                id="file"
                placeholder="Upload an image"
                value={file}
                onChange={this.uploadFile}
              />
              {image && <img src={image} alt="Uplaod Preview" />}

              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                required
                value={title}
                onChange={this.handleChange}
              />

              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                required
                value={price}
                onChange={this.handleChange}
              />

              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                required
                placeholder="Enter a description"
                value={description}
                onChange={this.handleChange}
              />
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
