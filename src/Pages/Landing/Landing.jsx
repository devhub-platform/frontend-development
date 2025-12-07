import { NavbarLandingPage } from "../../Components/NavbarLandingPage/NavbarLandingPage";
import { Hero } from "../../Components/Hero/Hero";
import { Features } from "../../Components/Features/Features";
import { HowItWorks } from "../../Components/HowItWorks/HowItWorks";
import { About } from "../../Components/About/About";
import { Fade } from "react-awesome-reveal";
import Footer from "../../Components/Footer/Footer";
import Helmet from "react-helmet";

const Landing = () => {
  return (
    <>
    <Helmet>
      <title>DevHub | Welcome to our Community</title>
    </Helmet>
      <NavbarLandingPage />

      <Fade triggerOnce direction="up">
        <Hero />
      </Fade>

      <Fade triggerOnce direction="up">
        <Features />
      </Fade>

      <Fade triggerOnce direction="up">
        <HowItWorks />
      </Fade>

      <Fade triggerOnce direction="up">
        <About />
      </Fade>
      <Fade triggerOnce direction="up">
        <Footer/>
      </Fade>
    </>
  );
};

export default Landing;
