import Image from "next/image";
import logo from "../../../public/logos/logo.png";

export default function SiteFooter() {
  return (
    <footer className="pt-5 pb-3" style={{ backgroundColor: "var(--top-header)", color: "var(--text-white-fixed)" }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3 gap-3">
              <Image src={logo} alt="Logo" className="flex-shrink-0" style={{ height: 60, width: "auto", borderRadius: 4 }} />
              <h4 className="fw-bold m-0 lh-1" style={{ color: "var(--accent-primary)" }}>ស្ម័គ្រចិត្ត</h4>
            </div>
            <p className="small text-white opacity-75">
              បេសកកម្មរបស់យើងគឺភ្ជាប់ស្មារតីអាណិតអាសូរជាមួយនឹងឱកាសស្ម័គ្រចិត្តប្រកបដោយអត្ថន័យ ដើម្បីកសាងសហគមន៍កាន់តែរឹងមាំ និងមានការចូលរួម។
            </p>
            <h6 className="fw-bold mt-4 mb-2" style={{ color: "var(--text-white-fixed)" }}>តាមដានយើង</h6>
            <ul className="list-unstyled d-flex footer-social">
              <li className="me-3"><a href="#"><i className="bi bi-facebook" /></a></li>
              <li className="me-3"><a href="#"><i className="bi bi-telegram" /></a></li>
              <li className="me-3"><a href="#"><i className="bi bi-instagram" /></a></li>
              <li className="me-3"><a href="#"><i className="bi bi-twitter" /></a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3" style={{ color: "var(--accent-primary)" }}>តំណរភ្ជាប់រហ័ស</h5>
            <ul className="list-unstyled footer-nav-links">
              <li><a href="/">ទំព័រដើម</a></li>
              <li><a href="/opportunity">ការងារស្ម័គ្រចិត្ត</a></li>
              <li><a href="/eventpage">ព្រឹត្តិការណ៏</a></li>
              <li><a href="/blogs">អត្ថបទ</a></li>
              <li><a href="/donation">បរិច្ចាក</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3" style={{ color: "var(--accent-primary)" }}>ព័ត៌មាន</h5>
            <ul className="list-unstyled footer-nav-links">
              <li><a href="/about">អំពីរយើង</a></li>
              <li><a href="/contact">ទំនាក់ទំនង</a></li>
              <li><a href="#">គោលការណ៍ឯកជន</a></li>
              <li><a href="#">លក្ខខណ្ឌប្រើប្រាស់</a></li>
              <li><a href="#">ជំនួយ</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3" style={{ color: "var(--accent-primary)" }}>ទំនាក់ទំនង</h5>
            <ul className="list-unstyled footer-contact-info">
              <li className="mb-2 small"><i className="bi bi-geo-alt me-2" style={{ color: "var(--accent-primary)" }} />ផ្ទះលេខ: XXXX, ផ្លូវ YYYY, ភ្នំពេញ</li>
              <li className="mb-2 small"><i className="bi bi-telephone me-2" style={{ color: "var(--accent-primary)" }} />(855) 12 345 678</li>
              <li className="mb-2 small"><i className="bi bi-envelope me-2" style={{ color: "var(--accent-primary)" }} />info@volunteer.org</li>
            </ul>
          </div>
        </div>

        <hr className="mt-4 mb-3" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        <div className="text-center">
          <p className="small m-0 text-white opacity-50">&copy; {new Date().getFullYear()} ស្ម័គ្រចិត្ត។ រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
        </div>
      </div>
    </footer>
  );
}