import { Component } from "react";
import { Container } from "react-bootstrap";
import { getStr } from "./lang/lang-fun";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("error", error);
    console.log("errorInfo", errorInfo);
    this.setState({
      hasError: true
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container fluid>
          <Container>
            <p>{getStr("error500", 1)}</p>
          </Container>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
