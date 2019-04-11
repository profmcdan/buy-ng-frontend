import Link from "next/link";
import UpdateItem from "../components/UpdateItemxx";

const Update = props => (
  <div>
    <p>Sell!</p>
    <UpdateItem id={props.query.id} />
  </div>
);

export default Update;
