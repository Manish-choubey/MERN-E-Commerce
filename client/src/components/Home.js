import { Component } from "react";
import AppNavbar from "./AppNavbar";
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Container,
  Alert,
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProducts } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";

class Home extends Component {
  componentDidMount() {
    this.props.getProducts();
  }

  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    addToCart: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  onAddToCart = async (id, productId) => {
    await this.props.addToCart(id, productId, 1);
    alert("Item added to Cart");
  };

  render() {
    const { products } = this.props.product;
    const user = this.props.user;
    return (
      <div>
        <AppNavbar />
        <Container>
          <div className="row">
            {products.length ? (
              products.map((product) => (
                <div className="col-md-4">
                  <Card className="mb-4">
                    <CardBody>
                      <CardTitle tag="h5">{product.title}</CardTitle>
                      <CardSubtitle tag="h6">Rs. {product.price}</CardSubtitle>
                      <CardText>{product.category}</CardText>
                      {this.props.isAuthenticated ? (
                        <Button
                          color="success"
                          size="sm"
                          onClick={this.onAddToCart.bind(
                            this,
                            user._id,
                            product._id
                          )}
                        >
                          Add To Cart
                        </Button>
                      ) : null}
                    </CardBody>
                  </Card>
                </div>
              ))
            ) : (
              <div style={{ width: "100%" }}>
                <Alert className="text-center">No products found. </Alert>
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.product,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getProducts, addToCart })(Home);