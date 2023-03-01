import { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import { createProduct } from "../actions/productActions";
import PropTypes from "prop-types";
import AppNavbar from "./AppNavbar";

class CreateProduct extends Component {
  state = {
    title: "",
    description: "",
    price: "",
    currencyId:"",
    currencyFormat:"",
    productImage:"",
    style:"",
    availableSizes:"",
    installments:"",
    availableSizes:""

  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();

    const newProducts = {
      title: this.state.title,
      description: this.state.description,
      price: this.state.price,
      currencyId: this.state.currencyId,
      currencyFormat: this.state.currencyFormat,
      productImage: this.state.productImage,
      style: this.state.style,
      availableSizes:this.state.availableSizes
    };

    await this.props.addItem(newProducts);

    alert("Item added successfully");
  };

  render() {
    return (
      <div>
        <AppNavbar />
        <Container>
          <h2 className="text-center mb-3">Add a new Item</h2>
          {this.props.isAuthenticated ? (
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title of the item"
                  onChange={this.onChange}
                />
                <br />
                <Label for="description">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description of the item"
                  onChange={this.onChange}
                />
                <br />
                <Label for="price">Price</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price of the item"
                  onChange={this.onChange}
                />


                 <br />
                <Label for="INR">currencyId</Label>
                <Input
                  type="text"
                  name="INR"
                  id=""
                  placeholder="INR"
                  onChange={this.onChange}
                />



                <br />
                <Label for="₹">currencyFormat</Label>
                <Input
                  type="text"
                  name="₹"
                  id="₹"
                  placeholder="₹"
                  onChange={this.onChange}
                />



              <br />
                <Label for="price">productImage</Label>
                <Input
                  type="file"
                  name="img"
                  id="img"
                  placeholder="productImage"
                  onChange={this.onChange}
                />


              <br />
                <Label for="style">style</Label>
                <Input
                  type="text"
                  name="style"
                  id="style"
                  placeholder="Choose Your Style"
                  onChange={this.onChange}
                />

                <br />
                <Label for="size">availableSizes</Label>
                <Input
                  type="text"
                  name="size"
                  id="size"
                  placeholder="[S, XS,M,X, L,XXL, XL]"
                  onChange={this.onChange}
                />

                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  CreateProduct
                </Button>
              </FormGroup>
            </Form>
          ) : (
            <Alert className="text-center" color="danger">
              Login to Create product!
            </Alert>
          )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.product,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { createProduct })(CreateProduct);