import "./Footer.scss";
import fb from "../../assets/fb.png";
import x from "../../assets/x.png";
import insta from "../../assets/insta.png";
import linkedin from "../../assets/linkedin.png";
import youtube from "../../assets/youtube.png";

export const Footer = () => {
  return (
    <div className="container-fluid p-5 footer-bg">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-12 ">
          <div className="footer-logo pb-4">Sparetan</div>
          <div className="footer-desc">
            Our platform facilitates a streamlined process where employers can
            effortlessly post small tasks, and seasoned professionals can submit
            competitive bids to undertake these tasks.
          </div>
          <div className="d-flex mt-4">
            <div>
              <img src={fb} className="social-icon" />
            </div>
            <div>
              <img src={x} className="social-icon" />
            </div>
            <div>
              <img src={insta} className="social-icon" />
            </div>
            <div>
              <img src={youtube} className="social-icon" />
            </div>
            <div>
              <img src={linkedin} className="social-icon" />
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-6 pt-lg-0 pt-md-0 pt-5">
          <div className="terms-ft">Terms of Services</div>
          <div className="terms-ft">Privacy Policy</div>
          <div className="terms-ft">Help & Support</div>
        </div>

        <div className="col-lg-2 col-md-2 col-6 pt-lg-0 pt-md-0 pt-5">
          <div className="terms-ft">Blog</div>
          <div className="terms-ft">Video Gallery</div>
          <div className="terms-ft">Support Center</div>
          <div className="terms-ft">Cookies Settings</div>
        </div>

        <div className="col-lg-2 col-md-2 col-6">
          <div className="terms-ft">Recruiting Wheel</div>
          <div className="terms-ft">About Company</div>
        </div>
      </div>
    </div>
  );
};
