import { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  NavLink,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

class RegisterModal extends Component {
  state = {
    modal: false,
    fname: "",
    lname: "",
    email: "",
    profileImage: "",
    phone: "",
    password: "",
    address: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { fname, lname, email, profileImage, phone, address, password } =
      this.state;

    // Crete user object
    const newUser = {
      fname,
      lname,
      email,
      profileImage,
      phone,
      address,
      password,
    };

    // Attempt to register
    this.props.register(newUser);
  };

  render() {
    return (
      <div className="container">
        <Button color="info" className="btn btn-sm">
          <NavLink onClick={this.toggle} href="#">
            <span className="text-dark">
              <b>Register</b>
            </span>
          </NavLink>
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Register</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Input
                  type="text"
                  name="fame"
                  id="fame"
                  placeholder="fame"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Input
                  type="text"
                  name="lame"
                  id="lame"
                  placeholder="lame"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Input
                  type="text"
                  name="fame"
                  id="fame"
                  placeholder="fame"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Input
                  type="file"
                  name="file"
                  id="file"
                  placeholder="upload your image"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="address"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  Register
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
);