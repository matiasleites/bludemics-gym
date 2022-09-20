import { Container } from "react-bootstrap";
import LanguageButtons from "./home/languageButtons";

const Footer = () => {
  return (
    <section id="footer">
      <Container fluid className="mb-3">
        <Container className="text-center fullContainer p-2">
          <LanguageButtons />
        </Container>
      </Container>
    </section>
  );
};

export default Footer;
